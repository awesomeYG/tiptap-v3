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
  FlowChartIcon,
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
import { insertBlockTool, insertHeadingTool, insertInlineTool } from "./util";

interface EditorMarkdownToolbarProps {
  aceEditorRef: React.RefObject<AceEditor>
  isExpend?: boolean
  onFileUpload: (file: File, expectedType?: 'image' | 'video' | 'audio' | 'attachment') => void;
}

const EditorMarkdownToolbar = ({ aceEditorRef, isExpend, onFileUpload }: EditorMarkdownToolbarProps) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const audioInputRef = React.useRef<HTMLInputElement>(null);
  const attachmentInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, expectedType?: 'image' | 'video' | 'audio' | 'attachment') => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, expectedType);
    }
    event.target.value = '';
  };

  const handleInsertHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!aceEditorRef.current) return;
    insertHeadingTool(aceEditorRef.current, { level })
  }

  const handleInsertInline = (options: {
    single?: string;
    left?: string;
    right?: string;
    position?: number;
    row?: number;
  }) => {
    if (!aceEditorRef.current) return;
    insertInlineTool(aceEditorRef.current, options)
  }

  const handleInsertBlock = (options: {
    text: string;
    position?: number;
    row?: number;
    wrap?: boolean;
  }) => {
    if (!aceEditorRef.current) return;
    insertBlockTool(aceEditorRef.current, options)
  }

  const HeadingOptions = [
    {
      id: '1',
      icon: <H1Icon sx={{ fontSize: '1rem' }} />,
      label: '一级标题',
      onClick: () => handleInsertHeading(1)
    },
    {
      id: '2',
      icon: <H2Icon sx={{ fontSize: '1rem' }} />,
      label: '二级标题',
      onClick: () => handleInsertHeading(2)
    },
    {
      id: '3',
      icon: <H3Icon sx={{ fontSize: '1rem' }} />,
      label: '三级标题',
      onClick: () => handleInsertHeading(3)
    },
    {
      id: '4',
      icon: <H4Icon sx={{ fontSize: '1rem' }} />,
      label: '四级标题',
      onClick: () => handleInsertHeading(4)
    },
    {
      id: '5',
      icon: <H5Icon sx={{ fontSize: '1rem' }} />,
      label: '五级标题',
      onClick: () => handleInsertHeading(5)
    },
    {
      id: '6',
      icon: <H6Icon sx={{ fontSize: '1rem' }} />,
      label: '六级标题',
      onClick: () => handleInsertHeading(6)
    },
  ]

  const ToolList = [
    {
      id: 'bold',
      icon: <BoldIcon sx={{ fontSize: '1rem' }} />,
      label: '加粗',
      onClick: () => handleInsertInline({ single: '**' })
    },
    {
      id: 'italic',
      icon: <ItalicIcon sx={{ fontSize: '1rem' }} />,
      label: '斜体',
      onClick: () => handleInsertInline({ single: '*' })
    },
    {
      id: 'strikethrough',
      icon: <StrikethroughIcon sx={{ fontSize: '1rem' }} />,
      label: '删除线',
      onClick: () => handleInsertInline({ single: '~~' })
    },
    {
      id: 'underline',
      icon: <UnderlineIcon sx={{ fontSize: '1rem' }} />,
      label: '下划线',
      onClick: () => handleInsertInline({ single: '++' })
    },
    {
      id: 'highlight',
      icon: <MarkPenLineIcon sx={{ fontSize: '1rem' }} />,
      label: '高亮',
      onClick: () => handleInsertInline({ single: '==' })
    },
    {
      id: 'superscript',
      icon: <SuperscriptIcon sx={{ fontSize: '1rem' }} />,
      label: '上标',
      onClick: () => handleInsertInline({ single: '^' })
    },
    {
      id: 'subscript',
      icon: <SubscriptIcon sx={{ fontSize: '1rem' }} />,
      label: '下标',
      onClick: () => handleInsertInline({ single: '~' })
    },
    {
      id: 'divider-1',
    },
    {
      id: 'bullet-list',
      icon: <ListUnorderedIcon sx={{ fontSize: '1rem' }} />,
      label: '无序列表',
      onClick: () => handleInsertBlock({ text: '- ', position: 2 })
    },
    {
      id: 'ordered-list',
      icon: <ListOrdered2Icon sx={{ fontSize: '1rem' }} />,
      label: '有序列表',
      onClick: () => handleInsertBlock({ text: '1. ', position: 3 })
    },
    {
      id: 'task-list',
      icon: <ListCheck3Icon sx={{ fontSize: '1rem' }} />,
      label: '任务列表',
      onClick: () => handleInsertBlock({ text: '- [ ] ', position: 6 })
    },
    ...(isExpend ? [
      {
        id: 'divider-2',
      },
      {
        id: 'separator',
        icon: <SeparatorIcon sx={{ fontSize: '1rem' }} />,
        label: '分割线',
        onClick: () => handleInsertBlock({ text: '---\n\n', row: 2 })
      },
      {
        id: 'blockquote',
        icon: <DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />,
        label: '引用',
        onClick: () => handleInsertBlock({ text: '> ', position: 2 })
      },
      {
        id: 'details',
        icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
        label: '折叠面板',
        onClick: () => handleInsertBlock({ text: ':::details\n\n:::detailsSummary\n\n:::\n\n:::detailsContent\n\n:::\n\n:::\n', row: 3, wrap: true })
      },
      {
        id: 'alert',
        icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
        label: '警告块',
        onClick: () => handleInsertBlock({ text: ':::alert {variant="info"}\n\n:::', row: 1, wrap: true })
      },
      {
        id: 'inline-math',
        icon: <SquareRootIcon sx={{ fontSize: '1rem' }} />,
        label: '行内数学公式',
        onClick: () => handleInsertInline({ single: '$' })
      },
      {
        id: 'block-math',
        icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
        label: '块级数学公式',
        onClick: () => handleInsertBlock({ text: '$$\n\n$$', row: 1, wrap: true })
      },
      {
        id: 'code',
        icon: <CodeLineIcon sx={{ fontSize: '1rem' }} />,
        label: '代码',
        onClick: () => handleInsertInline({ single: '`' })
      },
      {
        id: 'codeBlock',
        icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
        label: '代码块',
        onClick: () => handleInsertBlock({ text: '```\n\n```', row: 1, wrap: true })
      },
    ] : []),
    {
      id: 'divider-3',
    },
    {
      id: 'link',
      icon: <LinkIcon sx={{ fontSize: '1rem' }} />,
      label: '链接',
      onClick: () => handleInsertInline({ left: '[', right: ']()' })
    },
    {
      id: 'image',
      icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />,
      label: '图片',
      onClick: () => handleInsertInline({ left: '![', right: ']()' })
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
                  handleInsertBlock({ text: tableMarkdown, position: 1, wrap: true });
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
          onClick: () => handleInsertBlock({ text: '---\n\n', row: 2 }),
        },
        {
          label: '引用',
          key: 'blockquote',
          icon: <DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => handleInsertBlock({ text: '> ', position: 2 }),
        },
        {
          label: '折叠面板',
          key: 'details',
          icon: <MenuFold2FillIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => handleInsertBlock({ text: ':::details\n\n:::detailsSummary\n\n:::\n\n:::detailsContent\n\n:::\n\n:::\n', row: 3, wrap: true }),
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
              onClick: () => handleInsertBlock({ text: ':::alert {variant="info"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '警告 Warning',
              key: 'warning',
              icon: <ErrorWarningFillIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />,
              onClick: () => handleInsertBlock({ text: ':::alert {variant="warning"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '错误 Error',
              key: 'error',
              icon: <CloseCircleFillIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
              onClick: () => handleInsertBlock({ text: ':::alert {variant="error"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '成功 Success',
              key: 'success',
              icon: <CheckboxCircleFillIcon sx={{ fontSize: '1rem', color: 'success.main' }} />,
              onClick: () => handleInsertBlock({ text: ':::alert {variant="success"}\n\n:::', row: 1, wrap: true }),
            },
            {
              label: '默认 Default',
              key: 'default',
              icon: <UserSmileFillIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />,
              onClick: () => handleInsertBlock({ text: ':::alert {variant="default"}\n\n:::', row: 1, wrap: true }),
            }
          ]
        },

        {
          customLabel: <Typography sx={{ px: 1, pt: 2, fontSize: '12px', color: 'text.disabled' }}>
            专业
          </Typography>,
          key: 'professional',
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
              onClick: () => handleInsertInline({ single: '`' }),
            },
            {
              label: '代码块',
              key: 'codeBlock',
              icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => handleInsertBlock({ text: '```\n\n```', row: 1, wrap: true }),
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
              onClick: () => handleInsertInline({ single: '$' })
            },
            {
              label: '块级数学公式',
              key: 'block-math',
              icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
              onClick: () => handleInsertBlock({ text: '$$\n\n$$', row: 1, wrap: true })
            }
          ]
        },
        {
          label: 'Mermaid 流程图',
          key: 'flowchart',
          icon: <FlowChartIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => handleInsertBlock({ text: '```mermaid\n\n```', row: 1, wrap: true }),
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
              handleInsertBlock({ text: tableMarkdown, position: 1, wrap: true });
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