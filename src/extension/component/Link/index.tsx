// import { MarkViewRendererProps } from "@tiptap/react"
// import React from "react"
// import InsertLink from "./Insert"

// export interface LinkAttributes {
//   href: string
//   target?: string | null
//   rel?: string | null
//   class?: string | null
//   title?: string
//   type?: 'link' | 'card'
// }

// export const LinkViewWrapper: React.FC<MarkViewRendererProps> = (props) => {
//   const {
//     editor,
//     mark,
//     updateAttributes,
//   } = props

//   const attrs = mark.attrs as LinkAttributes

//   // const [showActions, setShowActions] = useState(false)
//   // const [selected, setSelected] = useState(false)
//   // const [linkElement, setLinkElement] = useState<HTMLAnchorElement | null>(null)
//   // const [editMode, setEditMode] = useState(false)
//   // const [editTitle, setEditTitle] = useState('')
//   // const [editHref, setEditHref] = useState('')
//   // const [editType, setEditType] = useState<'link' | 'card'>('link')

//   // const getFavicon = (url: string) => {
//   //   try {
//   //     const urlObj = new URL(url)
//   //     return `${urlObj.protocol}//${urlObj.host}/favicon.ico`
//   //   } catch {
//   //     return null
//   //   }
//   // }

//   // const handleClick = (e: React.MouseEvent) => {
//   //   e.preventDefault()
//   //   if (editor.isEditable) {
//   //     setSelected(!selected)
//   //     if (!selected) {
//   //       setShowActions(true)
//   //     } else {
//   //       // 第二次点击，打开链接
//   //       window.open(attrs.href, attrs.target || '_blank')
//   //       setShowActions(false)
//   //       setSelected(false)
//   //     }
//   //   } else {
//   //     // 只读模式直接打开链接
//   //     window.open(attrs.href, attrs.target || '_blank')
//   //   }
//   // }

//   // const handleOpen = () => {
//   //   window.open(attrs.href, attrs.target || '_blank')
//   //   setShowActions(false)
//   //   setSelected(false)
//   // }

//   // const handleEdit = () => {
//   //   setEditTitle(attrs.title || '')
//   //   setEditHref(attrs.href)
//   //   setEditType(attrs.type || 'link')
//   //   setEditMode(true)
//   //   setShowActions(false)
//   // }

//   // const handleSaveEdit = () => {
//   //   if (editHref.trim()) {
//   //     updateAttributes({
//   //       href: editHref.trim(),
//   //       title: editTitle.trim() || editHref.trim(),
//   //       type: editType
//   //     })
//   //   }
//   //   setEditMode(false)
//   //   setSelected(false)
//   // }

//   // const handleCancelEdit = () => {
//   //   setEditMode(false)
//   //   setEditTitle('')
//   //   setEditHref('')
//   //   setEditType('link')
//   // }

//   // const handleCopy = async () => {
//   //   try {
//   //     await navigator.clipboard.writeText(attrs.href)
//   //   } catch (err) {
//   //     console.error('复制失败:', err)
//   //   }
//   //   setShowActions(false)
//   //   setSelected(false)
//   // }

//   // const handleUnlink = () => {
//   //   editor.chain().unsetLink().run()
//   //   setShowActions(false)
//   //   setSelected(false)
//   // }

//   // const handleToggleStyle = () => {
//   //   updateAttributes({
//   //     type: attrs.type === 'link' ? 'card' : 'link'
//   //   })
//   //   setShowActions(false)
//   //   setSelected(false)
//   // }

//   // 点击外部关闭操作菜单
//   // useEffect(() => {
//   //   const handleClickOutside = (event: MouseEvent) => {
//   //     if (linkElement && !linkElement.contains(event.target as Node)) {
//   //       setShowActions(false)
//   //       setSelected(false)
//   //     }
//   //   }

//   //   if (showActions) {
//   //     document.addEventListener('mousedown', handleClickOutside)
//   //     return () => document.removeEventListener('mousedown', handleClickOutside)
//   //   }
//   // }, [showActions, linkElement])

//   // 对于空 href，渲染插入组件
//   if (!attrs.href) {
//     return <InsertLink updateAttributes={updateAttributes} />
//   }

//   // 只读模式
//   // if (!editor.isEditable) {
//   //   return <ReadonlyLink attrs={attrs} />
//   // }

//   // 简单的测试实现，显示 attrs 数据确实可以获取到
//   return (
//     <a
//       href={attrs.href}
//       target={attrs.target || '_blank'}
//       className={attrs.class || ''}
//       title={attrs.title || ''}
//       data-type={attrs.type || 'link'}
//       style={{
//         color: 'blue',
//         textDecoration: 'underline',
//         background: attrs.type === 'card' ? '#f0f0f0' : 'transparent',
//         padding: attrs.type === 'card' ? '4px' : '0'
//       }}
//     >
//       {/* 显示调试信息 */}
//       {attrs.title || attrs.href}
//       {attrs.type === 'card' && ' [Card Style]'}
//     </a>
//   )

//   // 卡片风格
//   // if (attrs.type === 'card') {
//   //   return (
//   //     <>
//   //       <Box
//   //         ref={setLinkElement}
//   //         component="div"
//   //         onClick={handleClick}
//   //         sx={{
//   //           display: 'block',
//   //           border: '1px solid',
//   //           borderColor: selected ? 'primary.main' : 'divider',
//   //           borderRadius: 1,
//   //           p: 2,
//   //           cursor: 'pointer',
//   //           textDecoration: 'none',
//   //           color: 'inherit',
//   //           maxWidth: 400,
//   //           mb: 1,
//   //           '&:hover': {
//   //             bgcolor: 'action.hover'
//   //           }
//   //         }}
//   //       >
//   //         <Stack direction="row" gap={2} alignItems="center">
//   //           <Avatar
//   //             sx={{ width: 24, height: 24 }}
//   //             src={getFavicon(attrs.href) || undefined}
//   //           >
//   //             <LinkIcon sx={{ fontSize: 16 }} />
//   //           </Avatar>
//   //           <Stack flex={1} sx={{ minWidth: 0 }}>
//   //             <Box
//   //               sx={{
//   //                 fontWeight: 500,
//   //                 fontSize: '0.875rem',
//   //                 overflow: 'hidden',
//   //                 textOverflow: 'ellipsis',
//   //                 whiteSpace: 'nowrap'
//   //               }}
//   //             >
//   //               {attrs.title || attrs.href}
//   //             </Box>
//   //             <Box
//   //               sx={{
//   //                 fontSize: '0.75rem',
//   //                 color: 'text.secondary',
//   //                 overflow: 'hidden',
//   //                 textOverflow: 'ellipsis',
//   //                 whiteSpace: 'nowrap'
//   //               }}
//   //             >
//   //               {attrs.href}
//   //             </Box>
//   //           </Stack>
//   //         </Stack>
//   //       </Box>

//   //       <FloatingPopover
//   //         open={showActions}
//   //         anchorEl={linkElement}
//   //         onClose={() => {
//   //           setShowActions(false)
//   //           setSelected(false)
//   //         }}
//   //         placement="top"
//   //       >
//   //         <Stack direction="row" sx={{ p: 1 }}>
//   //           <Tooltip title="打开">
//   //             <IconButton size="small" onClick={handleOpen}>
//   //               <ShareBoxLineIcon fontSize="small" />
//   //             </IconButton>
//   //           </Tooltip>
//   //           <Tooltip title="编辑">
//   //             <IconButton size="small" onClick={handleEdit}>
//   //               <EditBoxLineIcon fontSize="small" />
//   //             </IconButton>
//   //           </Tooltip>
//   //           <Tooltip title="复制链接">
//   //             <IconButton size="small" onClick={handleCopy}>
//   //               <CopyIcon fontSize="small" />
//   //             </IconButton>
//   //           </Tooltip>
//   //           <Tooltip title="取消链接">
//   //             <IconButton size="small" onClick={handleUnlink}>
//   //               <DeleteLineIcon fontSize="small" />
//   //             </IconButton>
//   //           </Tooltip>
//   //           <Tooltip title="切换到文字链接">
//   //             <IconButton size="small" onClick={handleToggleStyle}>
//   //               <TitleIcon fontSize="small" />
//   //             </IconButton>
//   //           </Tooltip>
//   //         </Stack>
//   //       </FloatingPopover>

//   //       <FloatingPopover
//   //         open={editMode}
//   //         anchorEl={linkElement}
//   //         onClose={handleCancelEdit}
//   //         placement="bottom"
//   //       >
//   //         <Stack gap={2} sx={{ p: 2, width: 320 }}>
//   //           <TextField
//   //             fullWidth
//   //             size="small"
//   //             label="标题"
//   //             value={editTitle}
//   //             onChange={(e) => setEditTitle(e.target.value)}
//   //             placeholder="链接标题（可选）"
//   //           />
//   //           <TextField
//   //             fullWidth
//   //             size="small"
//   //             label="地址"
//   //             value={editHref}
//   //             onChange={(e) => setEditHref(e.target.value)}
//   //             placeholder="https://example.com"
//   //             required
//   //           />
//   //           <FormControl component="fieldset">
//   //             <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>风格</FormLabel>
//   //             <RadioGroup
//   //               row
//   //               value={editType}
//   //               onChange={(e) => setEditType(e.target.value as 'link' | 'card')}
//   //             >
//   //               <FormControlLabel value="link" control={<Radio size="small" />} label="链接" />
//   //               <FormControlLabel value="card" control={<Radio size="small" />} label="卡片" />
//   //             </RadioGroup>
//   //           </FormControl>
//   //           <Stack direction="row" gap={1}>
//   //             <Button
//   //               variant="outlined"
//   //               size="small"
//   //               fullWidth
//   //               onClick={handleCancelEdit}
//   //             >
//   //               取消
//   //             </Button>
//   //             <Button
//   //               variant="contained"
//   //               size="small"
//   //               fullWidth
//   //               onClick={handleSaveEdit}
//   //               disabled={!editHref.trim()}
//   //             >
//   //               保存
//   //             </Button>
//   //           </Stack>
//   //         </Stack>
//   //       </FloatingPopover>
//   //     </>
//   //   )
//   // }

//   // 链接风格
//   // return (
//   //   <>
//   //     <MarkViewContent
//   //       as="a"
//   //       ref={setLinkElement}
//   //       onClick={handleClick}
//   //       style={{
//   //         color: '#1976d2',
//   //         textDecoration: 'underline',
//   //         cursor: 'pointer',
//   //         borderRadius: '4px',
//   //         padding: selected ? '0 4px' : '0',
//   //         backgroundColor: selected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
//   //       }}
//   //       onMouseEnter={(e) => {
//   //         e.currentTarget.style.textDecoration = 'none'
//   //         e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
//   //       }}
//   //       onMouseLeave={(e) => {
//   //         e.currentTarget.style.textDecoration = 'underline'
//   //         e.currentTarget.style.backgroundColor = selected ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
//   //       }}
//   //     />

//   //     <FloatingPopover
//   //       open={showActions}
//   //       anchorEl={linkElement}
//   //       onClose={() => {
//   //         setShowActions(false)
//   //         setSelected(false)
//   //       }}
//   //       placement="top"
//   //     >
//   //       <Stack direction="row" sx={{ p: 1 }}>
//   //         <Tooltip title="打开">
//   //           <IconButton size="small" onClick={handleOpen}>
//   //             <ShareBoxLineIcon fontSize="small" />
//   //           </IconButton>
//   //         </Tooltip>
//   //         <Tooltip title="编辑">
//   //           <IconButton size="small" onClick={handleEdit}>
//   //             <EditBoxLineIcon fontSize="small" />
//   //           </IconButton>
//   //         </Tooltip>
//   //         <Tooltip title="复制链接">
//   //           <IconButton size="small" onClick={handleCopy}>
//   //             <CopyIcon fontSize="small" />
//   //           </IconButton>
//   //         </Tooltip>
//   //         <Tooltip title="取消链接">
//   //           <IconButton size="small" onClick={handleUnlink}>
//   //             <LinkUnlinkIcon fontSize="small" />
//   //           </IconButton>
//   //         </Tooltip>
//   //         <Tooltip title="切换到卡片链接">
//   //           <IconButton size="small" onClick={handleToggleStyle}>
//   //             <LinkIcon fontSize="small" />
//   //           </IconButton>
//   //         </Tooltip>
//   //       </Stack>
//   //     </FloatingPopover>

//   //     <FloatingPopover
//   //       open={editMode}
//   //       anchorEl={linkElement}
//   //       onClose={handleCancelEdit}
//   //       placement="bottom"
//   //     >
//   //       <Stack gap={2} sx={{ p: 2, width: 320 }}>
//   //         <TextField
//   //           fullWidth
//   //           size="small"
//   //           label="标题"
//   //           value={editTitle}
//   //           onChange={(e) => setEditTitle(e.target.value)}
//   //           placeholder="链接标题（可选）"
//   //         />
//   //         <TextField
//   //           fullWidth
//   //           size="small"
//   //           label="地址"
//   //           value={editHref}
//   //           onChange={(e) => setEditHref(e.target.value)}
//   //           placeholder="https://example.com"
//   //           required
//   //         />
//   //         <FormControl component="fieldset">
//   //           <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>风格</FormLabel>
//   //           <RadioGroup
//   //             row
//   //             value={editType}
//   //             onChange={(e) => setEditType(e.target.value as 'link' | 'card')}
//   //           >
//   //             <FormControlLabel value="link" control={<Radio size="small" />} label="链接" />
//   //             <FormControlLabel value="card" control={<Radio size="small" />} label="卡片" />
//   //           </RadioGroup>
//   //         </FormControl>
//   //         <Stack direction="row" gap={1}>
//   //           <Button
//   //             variant="outlined"
//   //             size="small"
//   //             fullWidth
//   //             onClick={handleCancelEdit}
//   //           >
//   //             取消
//   //           </Button>
//   //           <Button
//   //             variant="contained"
//   //             size="small"
//   //             fullWidth
//   //             onClick={handleSaveEdit}
//   //             disabled={!editHref.trim()}
//   //           >
//   //             保存
//   //           </Button>
//   //         </Stack>
//   //       </Stack>
//   //     </FloatingPopover>
//   //   </>
//   // )
// }

// export default LinkViewWrapper