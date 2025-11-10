import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import AceEditor from "react-ace";
import {
  AddCircleFillIcon,
  ArrowDownSLineIcon,
  BoldIcon,
  CheckboxCircleFillIcon,
  CloseCircleFillIcon,
  CodeBoxLineIcon,
  CodeLineIcon,
  DoubleQuotesLIcon,
  ErrorWarningFillIcon,
  FunctionsIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  H4Icon,
  H5Icon,
  H6Icon,
  ImageLineIcon,
  Information2FillIcon,
  Information2LineIcon,
  ItalicIcon,
  LinkIcon,
  ListCheck3Icon,
  ListOrdered2Icon,
  ListUnorderedIcon,
  MarkPenLineIcon,
  MenuFold2FillIcon,
  SeparatorIcon,
  SquareRootIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  Table2Icon,
  UnderlineIcon,
  UserSmileFillIcon
} from "../component/Icons";
import Menu from "../component/Menu";
import { ToolbarItem } from "../component/Toolbar";
import TableSizePicker from "../component/Toolbar/TableSizePicker";

interface EditorMarkdownToolbarProps {
  aceEditorRef: React.RefObject<AceEditor>
  isExpend?: boolean
}

const EditorMarkdownToolbar = ({ aceEditorRef, isExpend }: EditorMarkdownToolbarProps) => {
  const insertTextAndFocusPositionRow = (options: {
    text: string;
    position?: number;
    block?: boolean;
    row?: number;
  }) => {
    const { position = 0, row = 0, block = false } = options;
    const editor = aceEditorRef.current?.editor;
    if (!editor) return;
    const cursor = editor.getCursorPosition();
    const isEditorEmpty = editor.getValue().length === 0;

    let text = options.text
    let curRow = cursor.row + row
    let curColumn = cursor.column + position

    if (block) {
      curColumn = position
      text = `\n\n${options.text}`
      curRow += 2
    }

    if (isEditorEmpty) {
      text = `${options.text}`
    }

    editor.insert(text);
    editor.moveCursorTo(curRow, curColumn);
    editor.focus();
  };

  const HeadingOptions = [
    {
      id: '1',
      icon: <H1Icon sx={{ fontSize: '1rem' }} />,
      label: '一级标题',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '# ', position: 2, block: true });
      }
    },
    {
      id: '2',
      icon: <H2Icon sx={{ fontSize: '1rem' }} />,
      label: '二级标题',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '## ', position: 3, block: true });
      }
    },
    {
      id: '3',
      icon: <H3Icon sx={{ fontSize: '1rem' }} />,
      label: '三级标题',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '### ', position: 4, block: true });
      }
    },
    {
      id: '4',
      icon: <H4Icon sx={{ fontSize: '1rem' }} />,
      label: '四级标题',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '#### ', position: 5, block: true });
      }
    },
    {
      id: '5',
      icon: <H5Icon sx={{ fontSize: '1rem' }} />,
      label: '五级标题',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '##### ', position: 6, block: true });
      }
    },
    {
      id: '6',
      icon: <H6Icon sx={{ fontSize: '1rem' }} />,
      label: '六级标题',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '###### ', position: 7, block: true });
      }
    },
  ]

  const ToolList = [
    {
      id: 'bold',
      icon: <BoldIcon sx={{ fontSize: '1rem' }} />,
      label: '加粗',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '****', position: 2 });
      }
    },
    {
      id: 'italic',
      icon: <ItalicIcon sx={{ fontSize: '1rem' }} />,
      label: '斜体',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '**', position: 1 });
      }
    },
    {
      id: 'strikethrough',
      icon: <StrikethroughIcon sx={{ fontSize: '1rem' }} />,
      label: '删除线',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '~~~~', position: 2 });
      }
    },
    {
      id: 'underline',
      icon: <UnderlineIcon sx={{ fontSize: '1rem' }} />,
      label: '下划线',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '++++', position: 2 });
      }
    },
    {
      id: 'highlight',
      icon: <MarkPenLineIcon sx={{ fontSize: '1rem' }} />,
      label: '高亮',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '====', position: 2 });
      }
    },
    {
      id: 'superscript',
      icon: <SuperscriptIcon sx={{ fontSize: '1rem' }} />,
      label: '上标',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '^^', position: 1 });
      }
    },
    {
      id: 'subscript',
      icon: <SubscriptIcon sx={{ fontSize: '1rem' }} />,
      label: '下标',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '~~', position: 1 });
      }
    },
    {
      id: 'divider-1',
    },
    {
      id: 'bullet-list',
      icon: <ListUnorderedIcon sx={{ fontSize: '1rem' }} />,
      label: '无序列表',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '- ', position: 2, block: true });
      }
    },
    {
      id: 'ordered-list',
      icon: <ListOrdered2Icon sx={{ fontSize: '1rem' }} />,
      label: '有序列表',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '1. ', position: 3, block: true });
      }
    },
    {
      id: 'task-list',
      icon: <ListCheck3Icon sx={{ fontSize: '1rem' }} />,
      label: '任务列表',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '- [ ] ', position: 6, block: true });
      }
    },
    {
      id: 'divider-2',
    },
    {
      id: 'inline-math',
      icon: <SquareRootIcon sx={{ fontSize: '1rem' }} />,
      label: '行内数学公式',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '$$', position: 1 });
      }
    },
    {
      id: 'block-math',
      icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
      label: '块级数学公式',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '$$\n\n$$', row: 1, block: true });
      }
    },
    {
      id: 'code',
      icon: <CodeLineIcon sx={{ fontSize: '1rem' }} />,
      label: '代码',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '``', position: 1 });
      }
    },
    {
      id: 'codeBlock',
      icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
      label: '代码块',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '```\n\n```', row: 1, block: true });
      }
    },
    {
      id: 'divider-3',
    },
    {
      id: 'link',
      icon: <LinkIcon sx={{ fontSize: '1rem' }} />,
      label: '链接',
      onClick: () => {
        insertTextAndFocusPositionRow({ text: '[]()', position: 1 });
      }
    },
  ]

  return <Stack direction={'row'} alignItems={'center'}>
    <Menu
      context={<ToolbarItem
        text={'插入'}
        icon={<AddCircleFillIcon sx={{ fontSize: '1rem' }} />}
      />}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
      zIndex={isExpend ? 2100 : undefined}
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
          onClick: () => insertTextAndFocusPositionRow({ text: '![alt]()', position: 7 }),
        },
        {
          label: '表格',
          key: 'table',
          icon: <Table2Icon sx={{ fontSize: '1rem' }} />,
          children: [
            {
              key: 'table-size-picker',
              customLabel: <TableSizePicker
                onConfirm={(cols, rows) => {
                  const headerRow = `| ${Array.from({ length: cols }).map(() => '').join(' | ')} |\n`;
                  const separatorRow = `| ${Array.from({ length: cols }).map(() => '---').join(' | ')} |\n`;
                  const dataRows = Array.from({ length: rows }).map(() =>
                    `| ${Array.from({ length: cols }).map(() => '').join(' | ')} |\n`
                  ).join('');
                  const tableMarkdown = `${headerRow}${separatorRow}${dataRows}`;
                  insertTextAndFocusPositionRow({ text: tableMarkdown, position: 1, block: true });
                }}
              />
            },
          ],
        },
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
          onClick: () => insertTextAndFocusPositionRow({ text: '---', position: 3, block: true }),
        },
        {
          label: '引用',
          key: 'blockquote',
          icon: <DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => insertTextAndFocusPositionRow({ text: '> ', position: 2, block: true }),
        },
        {
          label: '折叠面板',
          key: 'details',
          icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => insertTextAndFocusPositionRow({ text: ':::details\n\n:::detailsSummary\n\n:::\n\n:::detailsContent\n\n:::\n\n:::\n', row: 1, block: true }),
        },
        {
          label: '警告提示',
          key: 'highlight',
          icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
          children: [
            {
              label: '信息 Info',
              key: 'info',
              icon: <Information2FillIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />,
              onClick: () => {
                insertTextAndFocusPositionRow({ text: ':::alert {variant="info"}\n\n:::', row: -1, block: true });
              },
            },
            {
              label: '警告 Warning',
              key: 'warning',
              icon: <ErrorWarningFillIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />,
              onClick: () => {
                insertTextAndFocusPositionRow({ text: ':::alert {variant="warning"}\n\n:::', row: -1, block: true });
              },
            },
            {
              label: '错误 Error',
              key: 'error',
              icon: <CloseCircleFillIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
              onClick: () => {
                insertTextAndFocusPositionRow({ text: ':::alert {variant="error"}\n\n:::', row: -1, block: true });
              },
            },
            {
              label: '成功 Success',
              key: 'success',
              icon: <CheckboxCircleFillIcon sx={{ fontSize: '1rem', color: 'success.main' }} />,
              onClick: () => {
                insertTextAndFocusPositionRow({ text: ':::alert {variant="success"}\n\n:::', row: -1, block: true });
              },
            },
            {
              label: '默认 Default',
              key: 'default',
              icon: <UserSmileFillIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />,
              onClick: () => {
                insertTextAndFocusPositionRow({ text: ':::alert {variant="default"}\n\n:::', row: -1, block: true });
              },
            }
          ]
        }
      ]}
    />
    <Divider
      sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
      orientation="vertical"
      flexItem
    />
    <Menu
      context={<ToolbarItem
        tip={'标题'}
        text={<Box sx={{ position: 'relative', pr: 1 }}>
          <Box sx={{ width: '38px', textAlign: 'left' }}>标题</Box>
          <ArrowDownSLineIcon
            sx={{
              position: 'absolute',
              right: -6,
              top: '50%',
              transform: 'translateY(-50%)',
              flexSelf: 'center',
              fontSize: '1rem',
              flexShrink: 0,
              mr: 0,
              color: 'text.disabled',
              cursor: 'pointer',
              pointerEvents: 'none'
            }}
          />
        </Box>}
      />}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
      zIndex={isExpend ? 2100 : undefined}
      list={[
        ...HeadingOptions.map(it => ({
          label: it.label,
          key: it.id,
          icon: it.icon,
          onClick: it.onClick,
        })),
      ]}
    />
    {ToolList.map(it => (
      it.id.includes('divider') ? <Divider
        key={it.id}
        sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        orientation="vertical"
        flexItem
      /> : (
        <ToolbarItem
          key={it.id}
          tip={it.label}
          icon={it.icon}
          onClick={it?.onClick}
        />
      )))}
  </Stack>
}

export default EditorMarkdownToolbar;