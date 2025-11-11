import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import AceEditor from "react-ace";
import {
  AddCircleFillIcon,
  ArrowDownSLineIcon,
  AttachmentLineIcon,
  BoldIcon,
  CheckboxCircleFillIcon,
  CloseCircleFillIcon,
  CodeBoxLineIcon,
  CodeLineIcon,
  CodeSSlashLineIcon,
  DoubleQuotesLIcon,
  ErrorWarningFillIcon,
  Folder2LineIcon,
  FormulaIcon,
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
  MovieLineIcon,
  Music2LineIcon,
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
import { UploadFunction } from "../type";

interface EditorMarkdownToolbarProps {
  aceEditorRef: React.RefObject<AceEditor>
  isExpend?: boolean
  onUpload?: UploadFunction;
}

const EditorMarkdownToolbar = ({ aceEditorRef, isExpend, onUpload }: EditorMarkdownToolbarProps) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const audioInputRef = React.useRef<HTMLInputElement>(null);
  const attachmentInputRef = React.useRef<HTMLInputElement>(null);

  const insertBlockTool = (options: {
    text: string;
    position?: number;
    row?: number;
    wrap?: boolean
  }) => {
    const editor = aceEditorRef.current?.editor;
    if (!editor) return;
    const cursor = editor.getCursorPosition();
    const curRowLength = editor.session.getLine(cursor.row).length;
    const prevRowLength = editor.session.getLine(cursor.row - 1).length;
    let text = `\n\n${options.text}`;
    let plusRow = 2;
    if (curRowLength === 0 && (prevRowLength === 0 && cursor.row > 1)) {
      text = `${options.text}`;
      if (options.wrap) {
        plusRow = 0;
      }
    }
    if (curRowLength === 0 && cursor.row === 0) {
      text = options.text;
      if (options.wrap) {
        plusRow = 0;
      }
    }
    if (curRowLength === 0 && prevRowLength > 0) {
      text = `\n${options.text}`;
      if (options.wrap) {
        plusRow = 1;
      }
    }
    editor.moveCursorTo(cursor.row, curRowLength)
    editor.clearSelection();
    editor.insert(text);
    editor.moveCursorTo(cursor.row + plusRow + (options.row || 0), options.position || 0);
    editor.focus();
  }

  const insertInlineTool = (options: {
    single?: string;
    left?: string;
    right?: string;
    position?: number;
    row?: number;
  }) => {
    const editor = aceEditorRef.current?.editor;
    if (!editor) return;

    const left = options.single || options.left || ''
    const right = options.single || options.right || ''

    const selectedText = editor.getSelectedText();
    const cursor = editor.getCursorPosition();
    const selectionRange = editor.getSelectionRange();

    if (selectedText) {
      const wrappedText = `${left}${selectedText}${right}`;
      editor.insert(wrappedText);
      const startRow = selectionRange.start.row;
      const startColumn = selectionRange.start.column;
      const endRow = selectionRange.end.row;
      const endColumn = selectionRange.end.column;
      editor.moveCursorTo(startRow, startColumn);
      editor.selection.selectTo(endRow, endColumn + left.length + right.length);
    } else {
      const { position = 0, row = 0 } = options;
      const text = `${left}${right}`;
      const curRow = cursor.row + row;
      const curColumn = cursor.column + position;
      editor.insert(text);
      editor.moveCursorTo(curRow, curColumn + left.length);
    }
    editor.focus();
  }

  const insertHeadingTool = (options: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
  }) => {
    const editor = aceEditorRef.current?.editor;
    if (!editor) return;

    // 1. 获取当前行数，在下方创建一行
    const cursor = editor.getCursorPosition();
    const currentRow = cursor.row;
    const isEditorEmpty = editor.getValue().trim().length === 0;

    // 2. 在创建的行中插入标题
    const headingPrefix = '#'.repeat(options.level) + ' ';
    let text = `\n\n${headingPrefix}`;
    let targetRow = currentRow + 2;
    let targetColumn = headingPrefix.length;

    if (isEditorEmpty) {
      text = headingPrefix;
      targetRow = currentRow;
      targetColumn = headingPrefix.length;
    }

    editor.insert(text);

    // 3. 将光标置于标题中
    editor.moveCursorTo(targetRow, targetColumn);
    editor.focus();
  }

  const handleFileUpload = async (file: File, expectedType?: 'image' | 'video' | 'audio' | 'attachment') => {
    if (!onUpload) return;
    try {
      const url = await onUpload(file);
      let content = '';
      if (expectedType === 'image') {
        content = `![${file.name}](${url})`;
      } else if (expectedType === 'video') {
        content = `<p>\n<video src="${url}" controls="true"></video>\n</p>`;
      } else if (expectedType === 'audio') {
        content = `<p>\n<audio src="${url}" controls="true"></audio>\n</p>`;
      } else {
        content = `<p>\n<a href="${url}" download="${file.name}">${file.name}</a>\n</p>`;
      }
      insertBlockTool({ text: content, row: 1, position: 1000 });
    } catch (error) {
      console.error('文件上传失败:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, expectedType?: 'image' | 'video' | 'audio' | 'attachment') => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, expectedType);
    }
    event.target.value = '';
  };

  const HeadingOptions = [
    {
      id: '1',
      icon: <H1Icon sx={{ fontSize: '1rem' }} />,
      label: '一级标题',
      onClick: () => {
        insertHeadingTool({ level: 1 })
      }
    },
    {
      id: '2',
      icon: <H2Icon sx={{ fontSize: '1rem' }} />,
      label: '二级标题',
      onClick: () => {
        insertHeadingTool({ level: 2 })
      }
    },
    {
      id: '3',
      icon: <H3Icon sx={{ fontSize: '1rem' }} />,
      label: '三级标题',
      onClick: () => {
        insertHeadingTool({ level: 3 })
      }
    },
    {
      id: '4',
      icon: <H4Icon sx={{ fontSize: '1rem' }} />,
      label: '四级标题',
      onClick: () => {
        insertHeadingTool({ level: 4 })
      }
    },
    {
      id: '5',
      icon: <H5Icon sx={{ fontSize: '1rem' }} />,
      label: '五级标题',
      onClick: () => {
        insertHeadingTool({ level: 5 })
      }
    },
    {
      id: '6',
      icon: <H6Icon sx={{ fontSize: '1rem' }} />,
      label: '六级标题',
      onClick: () => {
        insertHeadingTool({ level: 6 })
      }
    },
  ]

  const ToolList = [
    {
      id: 'bold',
      icon: <BoldIcon sx={{ fontSize: '1rem' }} />,
      label: '加粗',
      onClick: () => {
        insertInlineTool({ single: '**' });
      }
    },
    {
      id: 'italic',
      icon: <ItalicIcon sx={{ fontSize: '1rem' }} />,
      label: '斜体',
      onClick: () => {
        insertInlineTool({ single: '*' });
      }
    },
    {
      id: 'strikethrough',
      icon: <StrikethroughIcon sx={{ fontSize: '1rem' }} />,
      label: '删除线',
      onClick: () => {
        insertInlineTool({ single: '~~' });
      }
    },
    {
      id: 'underline',
      icon: <UnderlineIcon sx={{ fontSize: '1rem' }} />,
      label: '下划线',
      onClick: () => {
        insertInlineTool({ single: '++' });
      }
    },
    {
      id: 'highlight',
      icon: <MarkPenLineIcon sx={{ fontSize: '1rem' }} />,
      label: '高亮',
      onClick: () => {
        insertInlineTool({ single: '==' });
      }
    },
    {
      id: 'superscript',
      icon: <SuperscriptIcon sx={{ fontSize: '1rem' }} />,
      label: '上标',
      onClick: () => {
        insertInlineTool({ single: '^' });
      }
    },
    {
      id: 'subscript',
      icon: <SubscriptIcon sx={{ fontSize: '1rem' }} />,
      label: '下标',
      onClick: () => {
        insertInlineTool({ single: '~' });
      }
    },
    {
      id: 'divider-1',
    },
    {
      id: 'bullet-list',
      icon: <ListUnorderedIcon sx={{ fontSize: '1rem' }} />,
      label: '无序列表',
      onClick: () => insertBlockTool({ text: '- ', position: 2 })
    },
    {
      id: 'ordered-list',
      icon: <ListOrdered2Icon sx={{ fontSize: '1rem' }} />,
      label: '有序列表',
      onClick: () => insertBlockTool({ text: '1. ', position: 3 })
    },
    {
      id: 'task-list',
      icon: <ListCheck3Icon sx={{ fontSize: '1rem' }} />,
      label: '任务列表',
      onClick: () => insertBlockTool({ text: '- [ ] ', position: 6 })
    },
    ...(isExpend ? [
      {
        id: 'divider-2',
      },
      {
        id: 'separator',
        icon: <SeparatorIcon sx={{ fontSize: '1rem' }} />,
        label: '分割线',
        onClick: () => insertBlockTool({ text: '---\n\n', row: 2 })
      },
      {
        id: 'blockquote',
        icon: <DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />,
        label: '引用',
        onClick: () => insertBlockTool({ text: '> ', position: 2 })
      },
      {
        id: 'details',
        icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
        label: '折叠面板',
        onClick: () => insertBlockTool({ text: ':::details\n\n:::detailsSummary\n\n:::\n\n:::detailsContent\n\n:::\n\n:::\n', row: 3, wrap: true })
      },
      {
        id: 'alert',
        icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
        label: '警告块',
        onClick: () => insertBlockTool({ text: ':::alert {variant="info"}\n\n:::', row: 1, wrap: true })
      },
      {
        id: 'inline-math',
        icon: <SquareRootIcon sx={{ fontSize: '1rem' }} />,
        label: '行内数学公式',
        onClick: () => insertInlineTool({ single: '$' })
      },
      {
        id: 'block-math',
        icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
        label: '块级数学公式',
        onClick: () => insertBlockTool({ text: '$$\n\n$$', row: 1, wrap: true })
      },
      {
        id: 'code',
        icon: <CodeLineIcon sx={{ fontSize: '1rem' }} />,
        label: '代码',
        onClick: () => insertInlineTool({ single: '`' })
      },
      {
        id: 'codeBlock',
        icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
        label: '代码块',
        onClick: () => insertBlockTool({ text: '```\n\n```', row: 1, wrap: true })
      },
    ] : []),
    {
      id: 'divider-3',
    },
    {
      id: 'link',
      icon: <LinkIcon sx={{ fontSize: '1rem' }} />,
      label: '链接',
      onClick: () => insertInlineTool({ left: '[', right: ']()' })
    },
    {
      id: 'image',
      icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />,
      label: '图片',
      onClick: () => insertInlineTool({ left: '![', right: ']()' })
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
                  insertBlockTool({ text: tableMarkdown, position: 1, wrap: true });
                }}
              />
            },
          ],
        },
        {
          label: '上传文件',
          key: 'upload-file',
          icon: <Folder2LineIcon sx={{ fontSize: '1rem' }} />,
          children: [
            {
              label: '上传图片',
              key: 'upload-image',
              icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => imageInputRef.current?.click(),
            },
            {
              label: '上传视频',
              key: 'upload-video',
              icon: <MovieLineIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => videoInputRef.current?.click(),
            },
            {
              label: '上传音频',
              key: 'upload-audio',
              icon: <Music2LineIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => audioInputRef.current?.click(),
            },
            {
              label: '上传附件',
              key: 'upload-attachment',
              icon: <AttachmentLineIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => attachmentInputRef.current?.click(),
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
          onClick: () => insertBlockTool({ text: '---\n\n', row: 2 }),
        },
        {
          label: '引用',
          key: 'blockquote',
          icon: <DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => insertBlockTool({ text: '> ', position: 2 }),
        },
        {
          label: '折叠面板',
          key: 'details',
          icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => insertBlockTool({ text: ':::details\n\n:::detailsSummary\n\n:::\n\n:::detailsContent\n\n:::\n\n:::\n', row: 3, wrap: true }),
        },
        {
          label: '警告块',
          key: 'highlight',
          icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
          children: [
            {
              label: '信息 Info',
              key: 'info',
              icon: <Information2FillIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />,
              onClick: () => insertBlockTool({ text: ':::alert {variant="info"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '警告 Warning',
              key: 'warning',
              icon: <ErrorWarningFillIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />,
              onClick: () => insertBlockTool({ text: ':::alert {variant="warning"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '错误 Error',
              key: 'error',
              icon: <CloseCircleFillIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
              onClick: () => insertBlockTool({ text: ':::alert {variant="error"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '成功 Success',
              key: 'success',
              icon: <CheckboxCircleFillIcon sx={{ fontSize: '1rem', color: 'success.main' }} />,
              onClick: () => insertBlockTool({ text: ':::alert {variant="success"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '默认 Default',
              key: 'default',
              icon: <UserSmileFillIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />,
              onClick: () => insertBlockTool({ text: ':::alert {variant="default"}\n\n:::', row: 1, wrap: true }),
            }
          ]
        },

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
              onClick: () => insertInlineTool({ single: '`' }),
            },
            {
              label: '代码块',
              key: 'codeBlock',
              icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => insertBlockTool({ text: '```\n\n```', row: 1, wrap: true }),
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
              onClick: () => insertInlineTool({ single: '$' })
            },
            {
              label: '块级数学公式',
              key: 'block-math',
              icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => insertBlockTool({ text: '$$\n\n$$', row: 1, wrap: true })
            }
          ]
        },
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
    {isExpend && <Menu
      context={<ToolbarItem
        tip={'表格'}
        icon={<Table2Icon sx={{ fontSize: '1rem' }} />}
      />}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
      zIndex={isExpend ? 2100 : undefined}
      list={[
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
              insertBlockTool({ text: tableMarkdown, position: 1, wrap: true });
            }}
          />
        }
      ]}
    />}
    {/* 隐藏的文件输入元素 */}
    <input
      ref={imageInputRef}
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={(e) => handleFileSelect(e, 'image')}
    />
    <input
      ref={videoInputRef}
      type="file"
      accept="video/*"
      style={{ display: 'none' }}
      onChange={(e) => handleFileSelect(e, 'video')}
    />
    <input
      ref={audioInputRef}
      type="file"
      accept="audio/*"
      style={{ display: 'none' }}
      onChange={(e) => handleFileSelect(e, 'audio')}
    />
    <input
      ref={attachmentInputRef}
      type="file"
      style={{ display: 'none' }}
      onChange={(e) => handleFileSelect(e, 'attachment')}
    />
  </Stack>
}

export default EditorMarkdownToolbar;