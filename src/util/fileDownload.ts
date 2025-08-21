import JSZip from 'jszip'

export interface FileInfo {
  src: string
  filename?: string
}

/**
 * 原生下载函数，使用 a 标签的 download 属性
 */
const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

const getFilenameFromUrl = (url: string, type?: string): string => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop() || ''

    if (!filename.includes('.') && type === 'img') {
      return `${filename}.jpg`
    }

    return filename
  } catch {
    return `file_${Date.now()}${type === 'img' ? '.jpg' : ''}`
  }
}

/**
 * 下载单个图片
 */
export const downloadSingleFile = async (fileInfo: FileInfo, type?: string): Promise<void> => {
  try {
    const response = await fetch(fileInfo.src)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const filename = fileInfo.filename || getFilenameFromUrl(fileInfo.src, type)

    downloadFile(blob, filename)
  } catch (error) {
    console.error('下载图片失败:', error)
    throw new Error('下载图片失败，请检查图片链接是否有效')
  }
}

/**
 * 批量下载多个图片并打包为 ZIP
 */
export const downloadFilesAsZip = async (
  files: FileInfo[],
  type?: string,
): Promise<void> => {
  const zipFilename: string = `${type}s_${Date.now()}.zip`

  if (files.length === 0) {
    throw new Error('没有要下载的文件')
  }

  try {
    const zip = new JSZip()
    const usedFilenames = new Set<string>()

    const downloadPromises = files.map(async (fileInfo) => {
      try {
        const response = await fetch(fileInfo.src)
        if (!response.ok) {
          console.warn(`文件下载失败 (${response.status}): ${fileInfo.src}`)
          return null
        }

        const blob = await response.blob()
        let filename = fileInfo.filename || getFilenameFromUrl(fileInfo.src)

        let counter = 1
        const originalFilename = filename
        while (usedFilenames.has(filename)) {
          const extension = originalFilename.split('.').pop() || ''
          const baseName = extension ? originalFilename.replace(`.${extension}`, '') : originalFilename
          filename = `${baseName}_${counter}${extension ? `.${extension}` : ''}`
          counter++
        }
        usedFilenames.add(filename)

        return { filename, blob }
      } catch (error) {
        console.warn(`下载图片失败: ${fileInfo.src}`, error)
        return null
      }
    })

    const results = await Promise.all(downloadPromises)
    const successfulDownloads = results.filter(result => result !== null)

    if (successfulDownloads.length === 0) {
      throw new Error('所有图片下载失败')
    }

    successfulDownloads.forEach((result) => {
      if (result) {
        zip.file(result.filename, result.blob)
      }
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    downloadFile(zipBlob, zipFilename)

    if (successfulDownloads.length < files.length) {
      const failedCount = files.length - successfulDownloads.length
      console.warn(`成功下载 ${successfulDownloads.length} 张图片，${failedCount} 张图片下载失败`)
    }
  } catch (error) {
    console.error('打包下载失败:', error)
    throw new Error('打包下载失败，请重试')
  }
}

/**
 * 智能下载图片 - 单张直接下载，多张打包下载
 */
export const downloadFiles = async (
  files: FileInfo[],
  type?: string
): Promise<void> => {
  if (files.length === 0) return
  if (files.length === 1) {
    await downloadSingleFile(files[0], type)
  } else {
    await downloadFilesAsZip(files, type)
  }
}
