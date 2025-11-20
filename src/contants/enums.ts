import { Theme } from "@mui/material";

export enum NodeTypeEnum {
  Alert = 'alert',
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
  Iframe = 'iframe',
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
  [NodeTypeEnum.Alert]: { label: '警告块', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.Blockquote]: { label: '引用', color: true, fontSize: true, align: true, convert: true },
  [NodeTypeEnum.CodeBlock]: { label: '代码块', convert: true },

  [NodeTypeEnum.Details]: { label: '折叠面板', align: true },
  [NodeTypeEnum.BlockMath]: { label: '块公式' },
  [NodeTypeEnum.Table]: { label: '表格', color: true, fontSize: true, align: true },
  [NodeTypeEnum.Video]: { label: '视频', download: true },
  [NodeTypeEnum.Audio]: { label: '音频', download: true },
  [NodeTypeEnum.BlockAttachment]: { label: '附件', download: true },

  [NodeTypeEnum.Code]: { label: '行内代码' },
  [NodeTypeEnum.Link]: { label: '链接' },
  [NodeTypeEnum.Image]: { label: '图片' },
  [NodeTypeEnum.Iframe]: { label: 'iframe' },
  [NodeTypeEnum.InlineMath]: { label: '行内公式' },
  [NodeTypeEnum.InlineAttachment]: { label: '附件' },

  [NodeTypeEnum.HorizontalRule]: { label: '分割线' },
}



export const getThemeTextColor = (theme: Theme) => [
  { label: '默认色', value: theme.palette.text.primary },
  { label: '主题色', value: theme.palette.primary.main },
  { label: '成功色', value: theme.palette.success.main },
  { label: '警告色', value: theme.palette.warning.main },
  { label: '错误色', value: theme.palette.error.main },
  { label: '黑色', value: theme.palette.common.black },
  { label: '灰色', value: theme.palette.text.disabled },
  { label: '白色', value: theme.palette.common.white },
]

export const getThemeTextBgColor = (theme: Theme) => [
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