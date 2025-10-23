import { getShortcutKeyText } from '@ctzhian/tiptap/util';
import { Typography } from '@mui/material';
import { Editor } from '@tiptap/react';
import React from 'react';
import { AddCircleFillIcon, ArrowDownSLineIcon, AttachmentLineIcon, CheckboxCircleFillIcon, CloseCircleFillIcon, CodeBoxLineIcon, CodeLineIcon, CodeSSlashLineIcon, DoubleQuotesLIcon, ErrorWarningFillIcon, Folder2LineIcon, FormulaIcon, FunctionsIcon, ImageLineIcon, Information2FillIcon, Information2LineIcon, MenuFold2FillIcon, MovieLineIcon, Music2LineIcon, SeparatorIcon, SquareRootIcon, Table2Icon, UserSmileFillIcon, WindowFillIcon } from '../../Icons';
import Menu from '../../Menu';
import ToolbarItem from '../Item';
import TableSizePicker from '../TableSizePicker';

interface EditorInsertProps {
  editor: Editor;
  isMarkdown: boolean;
}

const EditorInsert = ({ editor, isMarkdown }: EditorInsertProps) => {
  return <Menu
    width={224}
    context={<ToolbarItem
      tip={'插入'}
      text={'插入'}
      icon={<AddCircleFillIcon sx={{ fontSize: '1rem' }} />}
    />}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
    list={[
      {
        customLabel: <Typography sx={{ px: 1, pt: 2, fontSize: '12px', color: 'text.disabled' }}>
          通用
        </Typography>,
        key: 'current-node',
      },
      {
        label: '图片',
        key: 'image',
        icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />,
        extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '2'], '+')}</Typography>,
        onClick: () => editor.commands.setImage({ src: '', width: 760 }),
      },
      {
        label: '表格',
        key: 'table',
        icon: <Table2Icon sx={{ fontSize: '1rem' }} />,
        extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '9'], '+')}</Typography>,
        children: [
          {
            key: 'table-size-picker',
            customLabel: <TableSizePicker
              onConfirm={(cols, rows) => {
                editor.commands.insertTable({ rows, cols, withHeaderRow: true });
              }}
            />
          },
        ],
      },
      ...!isMarkdown ? [{
        label: '文件',
        key: 'file',
        icon: <Folder2LineIcon sx={{ fontSize: '1rem' }} />,
        children: [
          {
            label: '附件',
            key: 'attachment',
            extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '5'], '+')}</Typography>,
            icon: <AttachmentLineIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => editor.commands.setInlineAttachment({ url: '', title: '', size: '0' }),
          },
          {
            label: '音频',
            key: 'audio',
            extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '4'], '+')}</Typography>,
            icon: <Music2LineIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => editor.commands.setAudio({ src: '', controls: true, autoplay: false }),
          },
          {
            label: '视频',
            key: 'video',
            extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '3'], '+')}</Typography>,
            icon: <MovieLineIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => editor.commands.setVideo({ src: '', width: 760, controls: true, autoplay: false }),
          },
        ]
      }] : [],
      {
        customLabel: <Typography sx={{ px: 1, pt: 2, fontSize: '12px', color: 'text.disabled' }}>
          样式布局
        </Typography>,
        key: 'style',
      },
      {
        label: '分割线',
        key: 'separator',
        icon: <SeparatorIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        label: '引用',
        key: 'blockquote',
        icon: <DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />,
        extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'shift', 'B'], '+')}</Typography>,
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        label: '折叠面板',
        key: 'details',
        icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
        extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '8'], '+')}</Typography>,
        onClick: () => editor.chain().focus().setDetails().run(),
      },
      ...!isMarkdown ? [{
        label: '警告提示',
        key: 'highlight',
        icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
        children: [
          {
            label: '信息 Info',
            key: 'info',
            icon: <Information2FillIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />,
            onClick: () => {
              editor.chain().focus().setAlert({ type: 'icon', variant: 'info' }).run()
            },
          },
          {
            label: '警告 Warning',
            key: 'warning',
            icon: <ErrorWarningFillIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />,
            onClick: () => {
              editor.chain().focus().setAlert({ type: 'icon', variant: 'warning' }).run()
            },
          },
          {
            label: '错误 Error',
            key: 'error',
            icon: <CloseCircleFillIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
            onClick: () => {
              editor.chain().focus().setAlert({ type: 'icon', variant: 'error' }).run()
            },
          },
          {
            label: '成功 Success',
            key: 'success',
            icon: <CheckboxCircleFillIcon sx={{ fontSize: '1rem', color: 'success.main' }} />,
            onClick: () => {
              editor.chain().focus().setAlert({ type: 'icon', variant: 'success' }).run()
            },
          },
          {
            label: '默认 Default',
            key: 'default',
            icon: <UserSmileFillIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />,
            onClick: () => {
              editor.chain().focus().setAlert({ type: 'icon', variant: 'default' }).run()
            },
          }
        ]
      }] : [],
      {
        customLabel: <Typography sx={{ px: 1, pt: 2, fontSize: '12px', color: 'text.disabled' }}>
          程序员专用
        </Typography>,
        key: 'programmer',
      },
      {
        label: '代码',
        key: 'code',
        icon: <CodeSSlashLineIcon sx={{ fontSize: '1rem' }} />,
        children: [
          {
            label: '行内代码',
            key: 'inlineCode',
            icon: <CodeLineIcon sx={{ fontSize: '1rem' }} />,
            extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'E'], '+')}</Typography>,
            onClick: () => editor.chain().focus().toggleCode().run(),
          },
          {
            label: '代码块',
            key: 'codeBlock',
            icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
            extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'alt', 'C'], '+')}</Typography>,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          },
        ]
      },
      {
        label: '数学公式',
        key: 'math',
        icon: <FormulaIcon sx={{ fontSize: '1rem' }} />,
        children: [
          {
            label: '行内数学公式',
            key: 'inline-math',
            icon: <SquareRootIcon sx={{ fontSize: '1rem' }} />,
            extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '6'], '+')}</Typography>,
            onClick: () => {
              editor.commands.setInlineMath({ latex: '' });
            }
          },
          {
            label: '块级数学公式',
            key: 'block-math',
            icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
            extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', '7'], '+')}</Typography>,
            onClick: () => {
              editor.commands.setBlockMath({ latex: '' });
            }
          }
        ]
      },
      ...!isMarkdown ? [{
        customLabel: <Typography sx={{ px: 1, pt: 2, fontSize: '12px', color: 'text.disabled' }}>
          其他
        </Typography>,
        key: 'other',
      },
      {
        label: 'Iframe 链接',
        key: 'iframe',
        icon: <WindowFillIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => editor.commands.setIframe({ src: '', width: 760, height: 400 }),
      }] : [],
    ]}
  />
}

export default EditorInsert;