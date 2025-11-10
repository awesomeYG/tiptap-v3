import { Box } from "@mui/material"
import { MarkViewProps } from "@tiptap/core"
import { MarkViewContent } from "@tiptap/react"
import React from "react"

const LinkViewWrapper: React.FC<MarkViewProps> = ({ editor }) => {
  return <MarkViewContent>
    <Box>aaa</Box>
  </MarkViewContent>
}

export default LinkViewWrapper