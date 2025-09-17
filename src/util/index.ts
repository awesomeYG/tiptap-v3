export * from './fileDownload'
export * from './fileHandler'
export * from './floating'
export * from './linewiseConvert'
export * from './migrateMathStrings'
export * from './resourceExtractor'
export * from './shortcutKey'

import { Editor } from '@tiptap/react'

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const insertNodeAfterPosition = (editor: Editor, pos: number, nodeContent: any) => {
  editor.chain().focus().insertContentAt(pos, nodeContent).run()
}

export function addOpacityToColor(color: string, opacity: number) {
  let red, green, blue;

  if (color.startsWith("#")) {
    red = parseInt(color.slice(1, 3), 16);
    green = parseInt(color.slice(3, 5), 16);
    blue = parseInt(color.slice(5, 7), 16);
  } else if (color.startsWith("rgb")) {
    const matches = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/) as RegExpMatchArray;
    red = parseInt(matches[1], 10);
    green = parseInt(matches[2], 10);
    blue = parseInt(matches[3], 10);
  } else {
    return "";
  }

  const alpha = opacity;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export const getLinkTitle = (href: string) => {
  const paths = href.split('/').filter(it => it.trim().length > 0)
  return paths[paths.length - 1]
}