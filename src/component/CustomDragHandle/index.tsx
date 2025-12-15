import { AddLineIcon, AlignBottomIcon, AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, AlignTopIcon, ArrowDownSLineIcon, AttachmentLineIcon, BrushLineIcon, DeleteLineIcon, DownloadLineIcon, DraggableIcon, EraserLineIcon, FileCopyLineIcon, FontSizeIcon, H1Icon, H2Icon, H3Icon, ImageLineIcon, IndentDecreaseIcon, IndentIncreaseIcon, Information2LineIcon, ListCheck3Icon, ListOrdered2Icon, ListUnorderedIcon, MovieLineIcon, Music2LineIcon, QuoteTextIcon, Repeat2LineIcon, ScissorsCutLineIcon, TextIcon, TextWrapIcon } from '@ctzhian/tiptap/component/Icons';
import { getThemeTextBgColor, getThemeTextColor, NODE_TYPE_LABEL, NodeTypeEnum } from '@ctzhian/tiptap/contants/enums';
import { MenuItem, OnTipFunction } from '@ctzhian/tiptap/type';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Fragment, Node, Slice } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';
import React, { useCallback, useState } from 'react';
import { convertNodeAt, downloadFiles, FileInfo, filterResourcesByType, getAllResources, getShortcutKeyText, hasMarksInBlock } from '../../util';
import Menu from '../Menu';
import { ToolbarItem } from '../Toolbar';

const DragIcon = ({ onClick }: { onClick?: () => void }) => <Box onClick={onClick} sx={{
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '0.25rem',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

const AddIcon = ({ onClick }: { onClick?: (event: React.MouseEvent<HTMLDivElement>) => void }) => <Box onClick={onClick} sx={{
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '0.25rem',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  <AddLineIcon sx={{ fontSize: '1.25rem' }} />
</Box>

const CustomDragHandle = ({ editor, more, onTip }: { editor: Editor, more?: MenuItem[], onTip?: OnTipFunction }) => {
  const theme = useTheme()

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

  const [hasMarks, setHasMarks] = useState(false)

  const cancelNodeType = () => {
    const type = current.node?.type.name
    switch (type) {
      case NodeTypeEnum.Paragraph:
        current.editor.commands.setParagraph();
        break;
      case NodeTypeEnum.Heading:
        current.editor.commands.setParagraph();
        break;
      case NodeTypeEnum.BulletList:
        current.editor.commands.toggleBulletList();
        break;
      case NodeTypeEnum.OrderedList:
        current.editor.commands.toggleOrderedList();
        break;
      case NodeTypeEnum.TaskList:
        current.editor.commands.toggleTaskList();
        break;
      case NodeTypeEnum.Blockquote:
        current.editor.commands.toggleBlockquote();
        break;
      case NodeTypeEnum.CodeBlock:
        current.editor.commands.toggleCodeBlock();
        break;
      case NodeTypeEnum.Alert:
        current.editor.commands.setParagraph();
        break;
    }
  }

  const selectCurrentNode = () => {
    const { state, view } = current.editor
    const tr = state.tr
    const pos = current.pos
    if (pos >= 0) {
      const selection = NodeSelection.create(tr.doc as any, pos)
      tr.setSelection(selection)
      view.dispatch(tr)
      view.focus()
    }
  }

  const canCurrentNodeIndent = (): boolean => {
    return !!(current.node && (current.node as any).type)
  }

  const getCurrentIndentLevel = (): number => {
    if (!canCurrentNodeIndent()) return 0
    const node = current.node as any
    const attrs = current.editor.getAttributes(node.type.name) as Record<string, any>
    return Number(attrs.indent) || 0
  }

  const updateNodeChange = useCallback((data: {
    editor: Editor;
    node: Node | null;
    pos: number;
  }) => {
    if ((data.pos !== current.pos || data.node?.type.name !== current.node?.type.name) && data.pos !== -1 || (data.node === null && data.pos >= 0)) {
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
      if (data.node) {
        setHasMarks(hasMarksInBlock(data.node))
      }
    }
  }, [current.pos, current.node])

  return <DragHandle
    editor={editor}
    onNodeChange={updateNodeChange}
  >
    <Stack direction={'row'} alignItems={'center'} gap={1} sx={{ mr: 1, height: '1.625rem' }}>
      <Menu
        context={<AddIcon />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
        list={[
          {
            label: '上方插入行',
            key: 'insert-line-break-top',
            icon: <TextWrapIcon sx={{ fontSize: '1rem', transform: 'rotate(180deg)' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                const afterPos = current.pos
                current.editor.chain().focus().insertContentAt(afterPos, { type: 'paragraph', content: [{ type: 'text', text: '/' }] }, { updateSelection: true }).run()
              }
            }
          },
          {
            label: '下方插入行',
            key: 'insert-line-break',
            icon: <TextWrapIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (current.node && current.pos !== undefined) {
                const afterPos = current.pos + current.node.nodeSize
                current.editor.chain().focus().insertContentAt(afterPos, { type: 'paragraph', content: [{ type: 'text', text: '/' }] }).run()
              }
            }
          }
        ]}
      />
      {currentNode ? <Menu
        width={216}
        context={<DragIcon />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
        header={<>
          <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
            {currentNode?.label}
          </Typography>
          <Stack direction={'row'} flexWrap={'wrap'} sx={{ fontSize: 14 }}>
            <ToolbarItem
              key={'indent-decrease'}
              onClick={() => {
                if (!canCurrentNodeIndent()) return
                selectCurrentNode()
                current.editor.chain().focus().decreaseIndent().run()
                setCurrent(prev => ({ ...prev }))
              }}
              icon={<IndentDecreaseIcon sx={{ fontSize: '1rem' }} />}
              tip={'减少缩进'}
              disabled={getCurrentIndentLevel() <= 0}
            />
            <ToolbarItem
              key={'indent-increase'}
              onClick={() => {
                if (!canCurrentNodeIndent()) return
                selectCurrentNode()
                current.editor.chain().focus().increaseIndent().run()
                setCurrent(prev => ({ ...prev }))
              }}
              icon={<IndentIncreaseIcon sx={{ fontSize: '1rem' }} />}
              tip={'增加缩进'}
              disabled={!canCurrentNodeIndent()}
            />
            <ToolbarItem
              key={'format'}
              disabled={!hasMarks}
              onClick={() => {
                if (current.node && current.pos !== undefined) {
                  const selection = current.editor.commands.setTextSelection({ from: current.pos, to: current.pos + current.node?.nodeSize })
                  if (selection) {
                    current.editor.chain().unsetAllMarks().focus(current.pos - 1).run()
                  }
                }
              }}
              icon={<EraserLineIcon sx={{ fontSize: '1rem' }} />}
              tip={'清除格式'}
            />
            <ToolbarItem
              key={'copy'}
              onClick={async () => {
                if (current.node && current.pos !== undefined) {
                  const content = new Slice(Fragment.from(current.node), 0, 0)
                  const textContent = current.node.textContent;
                  const htmlContent = editor.view.serializeForClipboard(content).dom.innerHTML
                  try {
                    try {
                      if (htmlContent && navigator.clipboard && "write" in navigator.clipboard) {
                        const blob = new Blob([htmlContent], { type: "text/html" })
                        const clipboardItem = new ClipboardItem({ "text/html": blob })
                        await navigator.clipboard.write([clipboardItem])
                      }
                    } catch {
                      await navigator.clipboard.writeText(textContent)
                    }
                  } catch {
                    onTip?.('error', '复制失败')
                  }
                }
              }}
              icon={<FileCopyLineIcon sx={{ fontSize: '1rem' }} />}
              tip={`复制${currentNode?.label}`}
            />
            <ToolbarItem
              key={'cut'}
              onClick={async () => {
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
              }}
              icon={<ScissorsCutLineIcon sx={{ fontSize: '1rem' }} />}
              tip={`剪切${currentNode?.label}`}
            />
            <ToolbarItem
              key={'delete'}
              onClick={() => {
                if (current.node && current.pos !== undefined) {
                  current.editor.chain().focus().deleteRange({ from: current.pos, to: current.pos + current.node.nodeSize }).run();
                }
              }}
              icon={<DeleteLineIcon sx={{ fontSize: '1rem' }} />}
              tip={`删除${currentNode?.label}`}
            />
          </Stack>
          <Divider sx={{ my: 0.5 }} />
        </>}
        list={[
          ...(currentNode?.color ? [{
            key: 'color',
            label: '颜色',
            maxHeight: 400,
            width: 160,
            icon: <BrushLineIcon sx={{ fontSize: '1rem' }} />,
            children: [
              {
                customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>文字颜色</Typography>,
                key: 'text-color',
              },
              ...(getThemeTextColor(theme).map(it => ({
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
                customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>文字背景颜色</Typography>,
                key: 'background-color',
              },
              ...(getThemeTextBgColor(theme).map(it => ({
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
                      .focus()
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
            width: 100,
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
                extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'shift', 'L'], '+')}</Typography>,
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
                extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'shift', 'E'], '+')}</Typography>,
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
                extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'shift', 'R'], '+')}</Typography>,
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
                extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'shift', 'J'], '+')}</Typography>,
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
                extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'alt', 'T'], '+')}</Typography>,
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
                extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'alt', 'M'], '+')}</Typography>,
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
                extra: <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>{getShortcutKeyText(['ctrl', 'alt', 'B'], '+')}</Typography>,
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
          ...(currentNode?.convert ? [
            {
              label: '转换',
              key: 'convert',
              width: 160,
              maxHeight: 400,
              icon: <Repeat2LineIcon sx={{ fontSize: '1rem' }} />,
              children: [
                {
                  label: '文本',
                  selected: current.node?.type.name === 'paragraph',
                  key: 'convert-to-paragraph',
                  icon: <TextIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'paragraph' })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.setParagraph()
                    }
                  }
                },
                {
                  label: '标题1',
                  selected: current.node?.type.name === 'heading' && (current.node?.attrs.level === 1),
                  key: 'convert-to-heading-1',
                  icon: <H1Icon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'heading', level: 1 })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.setHeading({ level: 1 })
                    }
                  }
                },
                {
                  label: '标题2',
                  selected: current.node?.type.name === 'heading' && (current.node?.attrs.level === 2),
                  key: 'convert-to-heading-2',
                  icon: <H2Icon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'heading', level: 2 })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.setHeading({ level: 2 })
                    }
                  }
                },
                {
                  label: '标题3',
                  selected: current.node?.type.name === 'heading' && (current.node?.attrs.level === 3),
                  key: 'convert-to-heading-3',
                  icon: <H3Icon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'heading', level: 3 })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.setHeading({ level: 3 })
                    }
                  }
                },
                {
                  customLabel: <Divider sx={{ my: 0.5 }} />,
                  key: 'divider2',
                },
                {
                  label: '有序列表',
                  selected: current.node?.type.name === 'orderedList',
                  key: 'convert-to-ordered-list',
                  icon: <ListOrdered2Icon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'orderedList' })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.toggleOrderedList()
                    }
                  }
                },
                {
                  label: '无序列表',
                  selected: current.node?.type.name === 'bulletList',
                  key: 'convert-to-bullet-list',
                  icon: <ListUnorderedIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'bulletList' })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.toggleBulletList()
                    }
                  }
                },
                {
                  label: '任务列表',
                  selected: current.node?.type.name === 'taskList',
                  key: 'convert-to-task-list',
                  icon: <ListCheck3Icon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'taskList' })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.toggleTaskList()
                    }
                  }
                },
                {
                  customLabel: <Divider sx={{ my: 0.5 }} />,
                  key: 'divider3',
                },
                {
                  label: '引用',
                  selected: current.node?.type.name === 'blockquote',
                  key: 'convert-to-blockquote',
                  icon: <QuoteTextIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [NodeTypeEnum.BulletList, NodeTypeEnum.OrderedList, NodeTypeEnum.TaskList, NodeTypeEnum.Blockquote, NodeTypeEnum.CodeBlock, NodeTypeEnum.Alert]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'blockquote' })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.toggleBlockquote()
                    }
                  }
                },
                {
                  label: '警告块',
                  selected: current.node?.type.name === 'alert',
                  key: 'convert-to-alert',
                  icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    if (!current.node) return
                    const type = current.node.type.name as NodeTypeEnum
                    const groupTypes = [
                      NodeTypeEnum.BulletList,
                      NodeTypeEnum.OrderedList,
                      NodeTypeEnum.TaskList,
                      NodeTypeEnum.Blockquote,
                      NodeTypeEnum.CodeBlock,
                      NodeTypeEnum.Alert
                    ]
                    if (groupTypes.includes(type)) {
                      convertNodeAt(current.editor, current.pos, current.node as any, { type: 'alert', attrs: { variant: 'info', type: 'icon' } })
                    } else {
                      selectCurrentNode()
                      cancelNodeType()
                      current.editor.commands.toggleAlert({ type: 'icon', variant: 'info' })
                    }
                  }
                },
              ]
            }
          ] : []),
          ...(currentNode?.download && (current.node?.attrs.src || current.node?.attrs.url) ? [
            {
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
                    const srcUrl = node.attrs.src || node.attrs.url
                    const nodeFile = await fetch(srcUrl)
                    const nodeBlob = await nodeFile.blob() as Blob
                    const nodeUrl = URL.createObjectURL(nodeBlob)
                    const nodeName = node.attrs.title || `${node.type.name}.${srcUrl.split('.').pop()}`
                    const a = document.createElement('a')
                    a.href = nodeUrl
                    a.download = nodeName
                    a.click()
                    URL.revokeObjectURL(nodeUrl)
                  }
                }
              }
            }
          ] : [
            ...(resources.images.length > 0 ? [
              {
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
              }
            ] : []),
            ...(resources.videos.length > 0 ? [
              {
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
              }
            ] : []),
            ...(resources.audios.length > 0 ? [
              {
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
              }
            ] : []),
            ...(resources.attachments.length > 0 ? [
              {
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
              }
            ] : [])
          ]),
          ...(more ? more : []),
        ]}
      /> : <DragIcon />}
    </Stack>
  </DragHandle>
}

export default CustomDragHandle;