import { Box, Tooltip } from "@mui/material"
import { MarkViewContent, MarkViewProps } from "@tiptap/react"
import React from "react"

const TooltipView: React.FC<MarkViewProps> = ({ mark }) => {
  const tooltip = mark.attrs.tooltip
  return <Tooltip arrow placement="top" title={<Box>{tooltip}</Box>}>
    <Box component='span' sx={{
      borderBottom: '1px dotted',
      borderColor: 'text.secondary',
    }}>
      <MarkViewContent />
    </Box >
  </Tooltip>
}

export default TooltipView