export enum NodeTypeEnum {
  BlockAttachment = 'blockAttachment',
  InlineAttachment = 'inlineAttachment',
  Paragraph = 'paragraph',
  Heading = 'heading',
  BulletList = 'bulletList',
  OrderedList = 'orderedList',
  TaskList = 'taskList',
  Blockquote = 'blockquote',
  CodeBlock = 'codeBlock',
  HorizontalRule = 'horizontalRule',
  Details = 'details',
  Table = 'table',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Link = 'link',
  Code = 'code',
  InlineMath = 'inlineMath',
  BlockMath = 'blockMath',
}

export const NODE_TYPE_LABEL: Record<NodeTypeEnum, {
  label: string;
  color?: boolean;
  fontSize?: boolean;
  align?: boolean;
  convert?: boolean;
  download?: boolean;
  [key: string]: any;
}> = {
  [NodeTypeEnum.Paragraph]: { label: '文本', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.Heading]: { label: '标题', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.BulletList]: { label: '无序列表', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.OrderedList]: { label: '有序列表', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.TaskList]: { label: '任务列表', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.Blockquote]: { label: '引用块', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.CodeBlock]: { label: '代码块', convert: true },

  [NodeTypeEnum.Details]: { label: '折叠块', align: true },
  [NodeTypeEnum.BlockMath]: { label: '块公式' },
  [NodeTypeEnum.Table]: { label: '表格', color: true, fontSize: true, align: true },
  [NodeTypeEnum.Video]: { label: '视频', download: true },
  [NodeTypeEnum.Audio]: { label: '音频', download: true },
  [NodeTypeEnum.BlockAttachment]: { label: '附件', download: true },

  [NodeTypeEnum.Code]: { label: '代码' },
  [NodeTypeEnum.Link]: { label: '链接' },
  [NodeTypeEnum.Image]: { label: '图片' },
  [NodeTypeEnum.InlineMath]: { label: '行内公式' },
  [NodeTypeEnum.InlineAttachment]: { label: '附件' },

  [NodeTypeEnum.HorizontalRule]: { label: '分割线' },
}