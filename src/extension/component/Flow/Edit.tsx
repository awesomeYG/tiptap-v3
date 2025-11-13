import { FloatingPopover } from "@ctzhian/tiptap/component/FloatingPopover"
import { VirtualElement } from '@floating-ui/dom'
import { Button, Stack, TextField } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { FlowAttributes } from "."

type EditFlowProps = {
  anchorEl: HTMLDivElement | null
  attrs: FlowAttributes
  updateAttributes: (attrs: FlowAttributes) => void
  onCancel: () => void
}

const EditFlow = ({
  anchorEl,
  attrs,
  updateAttributes,
  onCancel,
}: EditFlowProps) => {
  const [editCode, setEditCode] = useState(attrs.code || '')

  // 当 attrs.code 更新时，同步更新 editCode
  useEffect(() => {
    setEditCode(attrs.code || '')
  }, [attrs.code])

  // 创建虚拟元素，表示 flow-wrapper 的中心点
  const centerVirtualElement = useMemo<VirtualElement | null>(() => {
    if (!anchorEl) return null

    return {
      getBoundingClientRect: () => {
        // 每次调用时重新计算，确保位置实时更新
        const rect = anchorEl.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        return {
          width: 0,
          height: 0,
          x: centerX,
          y: centerY,
          top: centerY,
          left: centerX,
          right: centerX,
          bottom: centerY,
        }
      },
    }
  }, [anchorEl])

  const handleSaveFlow = () => {
    const trimmedCode = editCode.trim()
    if (!trimmedCode) return

    updateAttributes({
      code: trimmedCode,
    })
    onCancel()
  }

  return (
    <FloatingPopover
      open={true}
      anchorEl={centerVirtualElement}
      onClose={onCancel}
      placement="top"
      style={{
        transform: 'translate(-50%, 0)',
      }}
    >
      <Stack gap={2} sx={{ p: 2, width: 600 }}>
        <TextField
          fullWidth
          multiline
          rows={12}
          value={editCode}
          onChange={(e) => setEditCode(e.target.value)}
          placeholder="输入 Mermaid 流程图代码"
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }
          }}
        />
        <Stack direction="row" gap={1}>
          <Button variant="outlined" fullWidth onClick={onCancel}>
            取消
          </Button>
          <Button variant="contained" fullWidth onClick={handleSaveFlow}>
            保存
          </Button>
        </Stack>
      </Stack>
    </FloatingPopover>
  )
}

export default EditFlow

