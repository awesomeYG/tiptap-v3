// import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material"
// import { MarkViewContent } from "@tiptap/react"
// import FloatingPopover from "@ctzhian/tiptap/component/FloatingPopover"
// import { LinkIcon } from "@ctzhian/tiptap/component/Icons"
// import React, { useRef, useState } from "react"
// import { LinkAttributes } from "."

// interface InsertLinkProps {
//   updateAttributes?: (attrs: Partial<LinkAttributes>) => void
// }

// export const InsertLink: React.FC<InsertLinkProps> = ({ updateAttributes }) => {
//   const [title, setTitle] = useState('')
//   const [href, setHref] = useState('')
//   const [type, setType] = useState<'link' | 'card'>('link')
//   const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
//   const containerRef = useRef<HTMLAnchorElement>(null)

//   const handleShowPopover = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClosePopover = () => {
//     setAnchorEl(null)
//     // 重置表单
//     setTitle('')
//     setHref('')
//     setType('link')
//   }

//   const handleSave = () => {
//     if (href.trim() && updateAttributes) {
//       updateAttributes({
//         href: href.trim(),
//         title: title.trim() || href.trim(),
//         type
//       })
//       handleClosePopover()
//     }
//   }

//   const handleKeyDown = (event: React.KeyboardEvent) => {
//     if (event.key === 'Enter') {
//       event.preventDefault()
//       handleSave()
//     } else if (event.key === 'Escape') {
//       event.preventDefault()
//       handleClosePopover()
//     }
//   }

//   return <>
//     <MarkViewContent
//       as="span"
//       ref={containerRef}
//       className="link-insert-wrapper"
//       data-drag-handle
//       role="button"
//       tabIndex={0}
//       onClick={handleShowPopover}
//       onKeyDown={handleKeyDown}
//       style={{
//         display: 'inline-block',
//         margin: '0 2px',
//       }}
//     >
//       <Stack
//         direction="row"
//         alignItems="center"
//         gap={1}
//         sx={{
//           border: '1px dashed',
//           borderColor: 'divider',
//           borderRadius: 1,
//           px: 2,
//           py: 1,
//           minWidth: 120,
//           color: 'text.secondary',
//           bgcolor: 'action.hover',
//           cursor: 'pointer',
//           transition: 'all 0.2s ease',
//           '&:hover': {
//             bgcolor: 'action.selected',
//             borderColor: 'primary.main',
//             color: 'primary.main',
//           },
//           '&:focus-within': {
//             outline: '2px solid',
//             outlineColor: 'primary.main',
//             outlineOffset: 1,
//           },
//         }}
//       >
//         <LinkIcon sx={{ fontSize: '1rem' }} />
//         <Box sx={{
//           fontSize: '0.875rem',
//           fontWeight: 500,
//           whiteSpace: 'nowrap'
//         }}>
//           插入链接
//         </Box>
//       </Stack>
//     </MarkViewContent>
//     <FloatingPopover
//       open={Boolean(anchorEl)}
//       anchorEl={anchorEl}
//       onClose={handleClosePopover}
//       placement="bottom"
//     >
//       <Stack gap={2} sx={{ p: 2, width: 320 }}>
//         <TextField
//           fullWidth
//           size="small"
//           label="标题"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="链接标题（可选）"
//           onKeyDown={handleKeyDown}
//         />
//         <TextField
//           fullWidth
//           size="small"
//           label="地址"
//           value={href}
//           onChange={(e) => setHref(e.target.value)}
//           placeholder="https://example.com"
//           required
//           autoFocus
//           error={href.length > 0 && !href.trim()}
//           helperText={href.length > 0 && !href.trim() ? "请输入有效的链接地址" : ""}
//           onKeyDown={handleKeyDown}
//         />
//         <FormControl component="fieldset">
//           <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>显示风格</FormLabel>
//           <RadioGroup
//             row
//             value={type}
//             onChange={(e) => setType(e.target.value as 'link' | 'card')}
//           >
//             <FormControlLabel
//               value="link"
//               control={<Radio size="small" />}
//               label="文字链接"
//             />
//             <FormControlLabel
//               value="card"
//               control={<Radio size="small" />}
//               label="卡片链接"
//             />
//           </RadioGroup>
//         </FormControl>
//         <Stack direction="row" gap={1}>
//           <Button
//             variant="outlined"
//             size="small"
//             fullWidth
//             onClick={handleClosePopover}
//           >
//             取消
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             fullWidth
//             onClick={handleSave}
//             disabled={!href.trim()}
//           >
//             插入链接
//           </Button>
//         </Stack>
//       </Stack>
//     </FloatingPopover>
//   </>
// }

// export default InsertLink 