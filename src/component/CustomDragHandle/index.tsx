import { Box, Divider, Typography, useTheme } from '@mui/material';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Fragment, Node, Slice } from '@tiptap/pm/model';
import { Editor } from '@tiptap/react';
import { AlignBottomIcon, AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, AlignTopIcon, ArrowDownSLineIcon, AttachmentLineIcon, BrushLineIcon, CodeBoxLineIcon, DeleteLineIcon, DownloadLineIcon, DraggableIcon, FontSizeIcon, FormatClearIcon, H1Icon, H2Icon, H3Icon, ImageLineIcon, ListCheck3Icon, ListOrdered2Icon, ListUnorderedIcon, MovieLineIcon, Music2LineIcon, QuoteTextIcon, Repeat2LineIcon, ScissorsCutLineIcon, TextIcon } from '@yu-cq/tiptap/component/Icons';
import { NODE_TYPE_LABEL, NodeTypeEnum } from '@yu-cq/tiptap/contants/enums';
import { MenuItem, OnTipFunction } from '@yu-cq/tiptap/type';
import React, { useCallback, useState } from 'react';
import { downloadFiles, FileInfo, filterResourcesByType, getAllResources } from '../../util';
import { FileCopyLineIcon } from '../Icons/file-copy-line-icon';
import Menu from '../Menu';

const DragIcon = ({ onClick }: { onClick?: () => void }) => <Box onClick={onClick} sx={{
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '0.25rem',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mr: 1,
  color: 'text.tertiary',
  cursor: 'grab',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: 'text.secondary',
    bgcolor: 'divider',
  },
  '&:active': {
    color: 'text.primary',
    cursor: 'grabbing',
  },
}}>
  <DraggableIcon sx={{ fontSize: '1.25rem' }} />
</Box>

const CustomDragHandle = ({ editor, more, onTip }: { editor: Editor, more?: MenuItem[], onTip?: OnTipFunction }) => {
  const theme = useTheme()
  const [showFormat, setShowFormat] = useState<boolean>(true)

  const [current, setCurrent] = useState<{
    editor: Editor;
    node: Node | null;
    pos: number;
  }>({
    editor,
    node: null,
    pos: -1,
  })

  const [resources, setResources] = useState<{
    videos: Node[]
    audios: Node[]
    images: Node[]
    attachments: Node[]
  }>({
    videos: [],
    audios: [],
    images: [],
    attachments: [],
  })

  const [currentNode, setCurrentNode] = useState<{
    label: string;
    color?: boolean;
    fontSize?: boolean;
    align?: boolean;
    convert?: boolean;
    download?: boolean;
  } | null>(null)

  const THEME_TEXT_COLOR = [
    { label: '默认色', value: theme.palette.text.primary },
    { label: '主题色', value: theme.palette.primary.main },
    { label: '成功色', value: theme.palette.success.main },
    { label: '警告色', value: theme.palette.warning.main },
    { label: '错误色', value: theme.palette.error.main },
    { label: '黑色', value: theme.palette.common.black },
    { label: '灰色', value: theme.palette.text.disabled },
    { label: '白色', value: theme.palette.common.white },
  ]

  const THEME_TEXT_BG_COLOR = [
    { label: '默认背景', value: theme.palette.background.paper },
    { label: '灰色背景', value: '#f8f8f7' },
    { label: '棕色背景', value: '#f4eeee' },
    { label: '橙色背景', value: '#fbecdd' },
    { label: '黄色背景', value: '#fef9c3' },
    { label: '绿色背景', value: '#dcfce7' },
    { label: '蓝色背景', value: '#e0f2fe' },
    { label: '紫色背景', value: '#f3e8ff' },
    { label: '粉色背景', value: '#fcf1f6' },
    { label: '红色背景', value: '#ffe4e6' },
  ]

  const cancelNodeType = () => {
    const type = current.node?.type.name
    switch (type) {
      case NodeTypeEnum.Paragraph:
        current.editor.chain().focus().setParagraph().run();
        break;
      case NodeTypeEnum.Heading:
        current.editor.chain().focus().setParagraph().run();
        break;
      case NodeTypeEnum.BulletList:
        current.editor.chain().focus().toggleBulletList().run();
        break;
      case NodeTypeEnum.OrderedList:
        current.editor.chain().focus().toggleOrderedList().run();
        break;
      case NodeTypeEnum.TaskList:
        current.editor.chain().focus().toggleTaskList().run();
        break;
      case NodeTypeEnum.Blockquote:
        current.editor.chain().focus().toggleBlockquote().run();
        break;
      case NodeTypeEnum.CodeBlock:
        current.editor.chain().focus().toggleCodeBlock().run();
        break;
    }
  }

  const hasMarksDeep = (node: Node | null | undefined): boolean => {
    if (!node) return false
    if ((node as any).marks && (node as any).marks.length > 0) return true
    const children = (node as any).content?.content as Node[] | undefined
    if (!children || children.length === 0) return false
    return children.some(child => hasMarksDeep(child))
  }

  const shouldShowButton = ({ editor, data }: { editor: Editor, data: { node: Node | null, pos: number } }) => {
    if (!editor || !editor.isEditable) return false
    const currentNode = data.node
    const empty = currentNode?.textContent === ''
    if (empty) return false
    const content = currentNode?.content.content
    if (content && content.length > 0) {
      return content.some(item => hasMarksDeep(item))
    }
    return false
  }

  const updateNodeChange = useCallback((data: {
    editor: Editor;
    node: Node | null;
    pos: number;
  }) => {
    if ((data.pos !== current.pos || data.node?.type.name !== current.node?.type.name) && data.pos !== -1 || (data.node === null && data.pos >= 0)) {
      console.log(data.node?.type.name)
      const allResources = data.node ? getAllResources(data.node) : []
      const videos = filterResourcesByType(allResources, [NodeTypeEnum.Video])
      const audios = filterResourcesByType(allResources, [NodeTypeEnum.Audio])
      const images = filterResourcesByType(allResources, [NodeTypeEnum.Image])
      const attachments = filterResourcesByType(allResources, [NodeTypeEnum.InlineAttachment, NodeTypeEnum.BlockAttachment])
      setCurrent(data)
      setCurrentNode(NODE_TYPE_LABEL[(data.node?.type.name || 'paragraph') as keyof typeof NODE_TYPE_LABEL])
      setResources({
        videos,
        audios,
        images,
        attachments,
      })
      setShowFormat(shouldShowButton({ editor, data }))
    }
  }, [current.pos, current.node])

  return <DragHandle
    editor={editor}
    onNodeChange={updateNodeChange}
  >
    {currentNode ? <Menu
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      childrenProps={{
        anchorOrigin: { vertical: 'center', horizontal: 'right' },
        transformOrigin: { vertical: 'center', horizontal: 'left' },
      }}
      arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
      list={[
        {
          customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
            {currentNode?.label}
          </Typography>,
          key: 'current-node',
        },
        ...(currentNode?.color ? [{
          key: 'color',
          label: '颜色',
          maxHeight: 400,
          icon: <BrushLineIcon sx={{ fontSize: '1rem' }} />,
          children: [
            {
              customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>文字颜色</Typography>,
              key: 'text-color',
            },
            ...(THEME_TEXT_COLOR.map(it => ({
              label: it.label,
              key: it.value,
              icon: <Box sx={{
                color: it.value,
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                bgcolor: it.value,
                border: '1px solid',
                borderColor: it.value === theme.palette.common.white ? 'divider' : 'transparent'
              }}></Box>,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .setColor(it.value)
                    .run();
                }
              }
            }))),
            {
              customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>高亮颜色</Typography>,
              key: 'highlight-color',
            },
            ...(THEME_TEXT_BG_COLOR.map(it => ({
              label: it.label,
              key: it.value,
              icon: <Box sx={{
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                bgcolor: it.value,
                border: '1px solid',
                borderColor: 'divider',
              }}></Box>,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .setBackgroundColor(it.value)
                    .run();
                }
              }
            })))
          ]
        }] : []),
        ...(currentNode?.fontSize ? [{
          key: 'fontSize',
          label: '字号',
          icon: <FontSizeIcon sx={{ fontSize: '1rem' }} />,
          minWidth: 100,
          maxHeight: 200,
          children: [
            ...([10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60].map(it => ({
              label: it,
              key: `${it}px`,
              textSx: {
                textAlign: 'center',
              },
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .setFontSize(`${it}px`)
                    .run();
                }
              }
            })))
          ]
        }] : []),
        ...(currentNode?.align ? [{
          key: 'align',
          label: '对齐方式',
          icon: <AlignLeftIcon sx={{ fontSize: '1rem' }} />,
          children: [
            {
              customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
                水平对齐方式
              </Typography>,
              key: 'align-horizontal',
            },
            {
              label: '左侧对齐',
              key: 'align-horizontal-left',
              icon: <AlignLeftIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .toggleTextAlign('left')
                    .run();
                }
              }
            },
            {
              label: '居中对齐',
              key: 'align-horizontal-center',
              icon: <AlignCenterIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .toggleTextAlign('center')
                    .run();
                }
              }
            },
            {
              label: '右侧对齐',
              key: 'align-horizontal-right',
              icon: <AlignRightIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .toggleTextAlign('right')
                    .run();
                }
              }
            },
            {
              label: '两端对齐',
              key: 'align-horizontal-justify',
              icon: <AlignJustifyIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .toggleTextAlign('justify')
                    .run();
                }
              }
            },
            {
              customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
                垂直对齐方式
              </Typography>,
              key: 'align-vertical',
            },
            {
              label: '顶部对齐',
              key: 'align-vertical-top',
              icon: <AlignTopIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .toggleVerticalAlign('top')
                    .run();
                }
              }
            },
            {
              label: '居中对齐',
              key: 'align-vertical-center',
              icon: <AlignCenterIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .toggleVerticalAlign('middle')
                    .run();
                }
              }
            },
            {
              label: '底部对齐',
              key: 'align-vertical-bottom',
              icon: <AlignBottomIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                if (current.node && current.pos !== undefined) {
                  const from = current.pos;
                  const to = current.pos + current.node.nodeSize;
                  current.editor.chain()
                    .setTextSelection({ from, to })
                    .toggleVerticalAlign('bottom')
                    .run();
                }
              }
            },
          ]
        }] : []),
        // ...(currentNode?.color || currentNode?.fontSize ? [{
        //   customLabel: <Divider sx={{ my: 0.5 }} />,
        //   key: 'divider1',
        // }] : []),
        ...(currentNode?.convert ? [{
          label: '转换',
          key: 'convert',
          icon: <Repeat2LineIcon sx={{ fontSize: '1rem' }} />,
          children: [{
            label: '文本',
            selected: editor.isActive('paragraph'),
            key: 'convert-to-paragraph',
            icon: <TextIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().setParagraph().run();
              }
            }
          }, {
            label: '一级标题',
            selected: editor.isActive('heading', { level: 1 }),
            key: 'convert-to-heading-1',
            icon: <H1Icon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().setHeading({ level: 1 }).run();
              }
            }
          }, {
            label: '二级标题',
            selected: editor.isActive('heading', { level: 2 }),
            key: 'convert-to-heading-2',
            icon: <H2Icon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().setHeading({ level: 2 }).run();
              }
            }
          }, {
            label: '三级标题',
            selected: editor.isActive('heading', { level: 3 }),
            key: 'convert-to-heading-3',
            icon: <H3Icon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().setHeading({ level: 3 }).run();
              }
            }
          }, {
            customLabel: <Divider sx={{ my: 0.5 }} />,
            key: 'divider2',
          }, {
            label: '有序列表',
            selected: editor.isActive('orderedList'),
            key: 'convert-to-ordered-list',
            icon: <ListOrdered2Icon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().toggleOrderedList().run();
              }
            }
          }, {
            label: '无序列表',
            selected: editor.isActive('bulletList'),
            key: 'convert-to-bullet-list',
            icon: <ListUnorderedIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().toggleBulletList().run();
              }
            }
          }, {
            label: '任务列表',
            selected: editor.isActive('taskList'),
            key: 'convert-to-task-list',
            icon: <ListCheck3Icon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().toggleTaskList().run();
              }
            }
          }, {
            customLabel: <Divider sx={{ my: 0.5 }} />,
            key: 'divider3',
          }, {
            label: '引用块',
            selected: editor.isActive('blockquote'),
            key: 'convert-to-blockquote',
            icon: <QuoteTextIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().toggleBlockquote().run();
              }
            }
          }, {
            label: '代码块',
            selected: editor.isActive('codeBlock'),
            key: 'convert-to-code-block',
            icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                cancelNodeType()
                current.editor.chain().focus().toggleCodeBlock().run();
              }
            }
          }]
        }] : []),
        // ...(currentNode?.convert ? [{
        //   customLabel: <Divider sx={{ my: 0.5 }} />,
        //   key: 'divider4',
        // }] : []),
        ...(currentNode?.download && (current.node?.attrs.src || current.node?.attrs.src) ? [{
          label: `下载${currentNode?.label}`,
          key: 'download',
          icon: <DownloadLineIcon sx={{ fontSize: '1rem' }} />,
          onClick: async () => {
            if (current.node && current.pos !== undefined) {
              if ([
                NodeTypeEnum.Video,
                NodeTypeEnum.Audio,
                NodeTypeEnum.BlockAttachment
              ].includes(current.node?.type.name as NodeTypeEnum)) {
                const node = current.node
                const nodeFile = await fetch(node.attrs.src || node.attrs.url)
                const nodeBlob = await nodeFile.blob() as Blob
                const nodeUrl = URL.createObjectURL(nodeBlob)
                const nodeName = node.attrs.title || `${node.type.name}.${node.attrs.src.split('.').pop()}`
                const a = document.createElement('a')
                a.href = nodeUrl
                a.download = nodeName
                a.click()
                URL.revokeObjectURL(nodeUrl)
              }
            }
          }
        }] : [
          ...(resources.images.length > 0 ? [{
            label: '下载图片',
            key: 'download-img',
            icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />,
            extra: <Box sx={{
              lineHeight: '0.75rem',
              fontSize: '0.75rem',
              color: 'text.disabled',
              border: '1px solid',
              borderColor: 'text.disabled',
              borderRadius: 'var(--mui-shape-borderRadius)',
              py: 0,
              px: 0.5,
              minWidth: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{resources.images.length}</Box>,
            onClick: async () => {
              try {
                const imageInfos: FileInfo[] = resources.images.map(img => ({
                  src: img.attrs.src,
                  filename: img.attrs.alt || img.attrs.title || undefined
                }))
                await downloadFiles(imageInfos, 'img')
              } catch (error) {
                console.error('下载图片失败:', error)
              }
            }
          }] : []),
          ...(resources.videos.length > 0 ? [{
            label: '下载视频',
            key: 'download-video',
            icon: <MovieLineIcon sx={{ fontSize: '1rem' }} />,
            extra: <Box sx={{
              lineHeight: '0.75rem',
              fontSize: '0.75rem',
              color: 'text.disabled',
              border: '1px solid',
              borderColor: 'text.disabled',
              borderRadius: 'var(--mui-shape-borderRadius)',
              py: 0,
              px: 0.5,
              minWidth: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{resources.videos.length}</Box>,
            onClick: async () => {
              try {
                const videoInfos: FileInfo[] = resources.videos.map(video => ({
                  src: video.attrs.src,
                  filename: video.attrs.alt || video.attrs.title || undefined
                }))
                await downloadFiles(videoInfos, 'video')
              } catch (error) {
                console.error('下载视频失败:', error)
              }
            }
          }] : []),
          ...(resources.audios.length > 0 ? [{
            label: '下载音频',
            key: 'download-audio',
            icon: <Music2LineIcon sx={{ fontSize: '1rem' }} />,
            extra: <Box sx={{
              lineHeight: '0.75rem',
              fontSize: '0.75rem',
              color: 'text.disabled',
              border: '1px solid',
              borderColor: 'text.disabled',
              borderRadius: 'var(--mui-shape-borderRadius)',
              py: 0,
              px: 0.5,
              minWidth: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{resources.audios.length}</Box>,
            onClick: async () => {
              try {
                const audioInfos: FileInfo[] = resources.audios.map(audio => ({
                  src: audio.attrs.src,
                  filename: audio.attrs.alt || audio.attrs.title || undefined
                }))
                await downloadFiles(audioInfos, 'audio')
              } catch (error) {
                console.error('下载音频失败:', error)
              }
            }
          }] : []),
          ...(resources.attachments.length > 0 ? [{
            label: '下载附件',
            key: 'download-attachment',
            icon: <AttachmentLineIcon sx={{ fontSize: '1rem' }} />,
            extra: <Box sx={{
              lineHeight: '0.75rem',
              fontSize: '0.75rem',
              color: 'text.disabled',
              border: '1px solid',
              borderColor: 'text.disabled',
              borderRadius: 'var(--mui-shape-borderRadius)',
              py: 0,
              px: 0.5,
              minWidth: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{resources.attachments.length}</Box>,
            onClick: async () => {
              try {
                const attachmentInfos: FileInfo[] = resources.attachments.map(attachment => ({
                  src: attachment.attrs.url,
                  filename: attachment.attrs.title || undefined
                }))
                await downloadFiles(attachmentInfos, 'attachment')
              } catch (error) {
                console.error('下载附件失败:', error)
              }
            }
          }] : [])
        ]),
        // ...(currentNode?.download ? [{
        //   customLabel: <Divider sx={{ my: 0.5 }} />,
        //   key: 'divider5',
        // }] : []),
        ...(more ? more : []),
        ...(showFormat ? [{
          label: '文本格式化',
          key: 'format',
          icon: <FormatClearIcon sx={{ fontSize: '1rem' }} />,
          onClick: async () => {
            if (current.node && current.pos !== undefined) {
              const tr = current.editor.state.tr
              const currentNode = current.node
              const empty = currentNode?.textContent === ''
              if (!empty) {
                const content = currentNode?.content.content
                if (content && content.length > 0) {
                  tr.doc.nodesBetween(current.pos, current.pos + current.node.nodeSize, (node, pos) => {
                    if (!node.isInline) return true
                    node.marks.forEach((mark) => {
                      tr.removeMark(pos, pos + node.nodeSize, mark.type)
                    })
                    return true
                  })
                }
              }
              editor.view.dispatch(tr)
            }
          }
        }] : []),
        {
          label: `复制${currentNode?.label}`,
          key: 'copy',
          icon: <FileCopyLineIcon sx={{ fontSize: '1rem' }} />,
          onClick: async () => {
            if (current.node && current.pos !== undefined) {
              const content = new Slice(Fragment.from(current.node), 0, 0)
              const textContent = current.node.textContent;
              const htmlContent = editor.view.serializeForClipboard(content).dom.innerHTML
              try {
                if (htmlContent && navigator.clipboard && "write" in navigator.clipboard) {
                  const blob = new Blob([htmlContent], { type: "text/html" })
                  const clipboardItem = new ClipboardItem({ "text/html": blob })
                  await navigator.clipboard.write([clipboardItem])
                  onTip?.('success', '复制成功')
                }
              } catch {
                await navigator.clipboard.writeText(textContent)
              }
            }
          }
        },
        {
          label: `剪切${currentNode?.label}`,
          key: 'cut',
          icon: <ScissorsCutLineIcon sx={{ fontSize: '1rem' }} />,
          onClick: async () => {
            if (current.node && current.pos !== undefined) {
              try {
                const content = new Slice(Fragment.from(current.node), 0, 0)
                const textContent = current.node.textContent;
                const htmlContent = editor.view.serializeForClipboard(content).dom.innerHTML
                try {
                  if (htmlContent && navigator.clipboard && "write" in navigator.clipboard) {
                    const blob = new Blob([htmlContent], { type: "text/html" })
                    const clipboardItem = new ClipboardItem({ "text/html": blob })
                    await navigator.clipboard.write([clipboardItem])
                  }
                } catch {
                  await navigator.clipboard.writeText(textContent)
                }
                current.editor.chain().focus().deleteRange({ from: current.pos, to: current.pos + current.node.nodeSize }).run();
              } catch {
                onTip?.('error', '剪切失败')
              }
            }
          }
        },
        // {
        //   label: `复制并粘贴`,
        //   key: 'duplicate-and-overwrite',
        //   icon: <FileCopyLineIcon sx={{ fontSize: '1rem' }} />,
        //   onClick: () => {
        //     if (current.node && current.pos !== undefined) {
        //       const nodeJSON = current.node.toJSON();
        //       const insertPos = current.pos + current.node.nodeSize;
        //       current.editor.chain()
        //         .focus()
        //         .insertContentAt(insertPos, nodeJSON)
        //         .run();
        //     }
        //   },
        // },
        {
          label: `删除${currentNode?.label}`,
          key: 'delete',
          icon: <DeleteLineIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => {
            if (current.node && current.pos !== undefined) {
              current.editor.chain().focus().deleteRange({ from: current.pos, to: current.pos + current.node.nodeSize }).run();
            }
          }
        }
      ]}
      context={<DragIcon />}
    /> : <DragIcon />}
  </DragHandle>
}

export default CustomDragHandle;