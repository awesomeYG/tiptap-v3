import mermaid from 'mermaid'

/**
 * 初始化 mermaid（只执行一次）
 */
let mermaidInitialized = false

export const initMermaid = () => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })
    mermaidInitialized = true
  }
}

/**
 * 生成唯一的 mermaid 渲染 ID
 */
export const generateMermaidId = (prefix = 'mermaid'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 从 mermaid 渲染结果中提取 SVG
 */
export const extractSvgFromResult = (result: any): string => {
  return result.svg || result.svgCode || ''
}

