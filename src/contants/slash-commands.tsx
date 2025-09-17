import { Editor } from '@tiptap/react';
import * as React from 'react';
import { AttachmentLineIcon, CodeBoxLineIcon, CodeLineIcon, DoubleQuotesLIcon, FunctionsIcon, H1Icon, H2Icon, H3Icon, H4Icon, H5Icon, H6Icon, ImageLineIcon, Information2LineIcon, LinkIcon, ListCheck2Icon, ListOrdered2Icon, ListUnorderedIcon, MenuFold2FillIcon, MovieLineIcon, Music2LineIcon, SeparatorIcon, SquareRootIcon, Table2Icon, TextWrapIcon, WindowFillIcon } from '../component/Icons';

export const slashCommands = [
  {
    title: '一级标题',
    icon: <H1Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
    }
  },
  {
    title: '二级标题',
    icon: <H2Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    }
  },
  {
    title: '三级标题',
    icon: <H3Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
    }
  },
  {
    title: '四级标题',
    icon: <H4Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run()
    }
  },
  {
    title: '五级标题',
    icon: <H5Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 5 }).run()
    }
  },
  {
    title: '六级标题',
    icon: <H6Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 6 }).run()
    }
  },
  {
    title: '有序列表',
    icon: <ListOrdered2Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    }
  },
  {
    title: '无序列表',
    icon: <ListUnorderedIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    }
  },
  {
    title: '任务列表',
    icon: <ListCheck2Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    }
  },
  {
    title: '换行',
    icon: <TextWrapIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).insertContent('<br />').run()
    }
  },
  {
    title: '分割线',
    icon: <SeparatorIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    }
  },
  {
    title: '引用块',
    icon: <DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    }
  },
  {
    title: '行内代码',
    icon: <CodeLineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setMark('code').run()
    }
  },
  {
    title: '代码块',
    icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    }
  },
  {
    title: '链接',
    icon: <LinkIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setInlineLink({ href: '' }).run()
    }
  },
  {
    title: '折叠块',
    icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setDetails().run()
    }
  },
  {
    title: '表格',
    icon: <Table2Icon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 4, withHeaderRow: true }).run()
    }
  },
  {
    title: 'iframe',
    icon: <WindowFillIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setIframe({ src: '', width: 760, height: 400 }).run()
    }
  },
  {
    title: '警告提示',
    icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range, attrs }: { editor: Editor; range: { from: number; to: number }; attrs: any }) => {
      editor.chain().focus().deleteRange(range).toggleAlert({ type: attrs?.type || 'icon', variant: attrs?.variant || 'info' }).run()
    }
  },
  {
    title: '折叠块',
    icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setDetails().run()
    }
  },
  {
    title: '代码块',
    icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    }
  },
  {
    title: '行内数学公式',
    icon: <SquareRootIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setInlineMath({ latex: '' }).run()
    }
  },
  {
    title: '块级数学公式',
    icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setBlockMath({ latex: '' }).run()
    }
  },
  {
    title: '图片',
    icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setImage({ src: '', width: 760 }).run()
    }
  },
  {
    title: '视频',
    icon: <MovieLineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setVideo({ src: '', width: 760 }).run()
    }
  },
  {
    title: '音频',
    icon: <Music2LineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setAudio({ src: '' }).run()
    }
  },
  {
    title: '附件',
    icon: <AttachmentLineIcon sx={{ fontSize: '1rem' }} />,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setInlineAttachment({ url: '', title: '', size: '0' }).run()
    }
  },
]