import { alpha, Paper, useTheme } from "@mui/material";
import React from "react";

interface UploadProgressProps {
  progress: number;
  fileName: string;
}

const UploadProgress = ({ progress, fileName }: UploadProgressProps) => {
  const theme = useTheme();

  return <Paper sx={{
    position: 'absolute',
    left: '50%',
    top: 45,
    overflow: 'hidden',
    px: 2,
    py: 1,
    transform: 'translateX(-50%)',
    bgcolor: 'background.default',
    zIndex: 10,
    border: '1px solid',
    borderColor: 'primary.main',
    color: 'text.disabled',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${progress}%`,
      height: '100%',
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      transition: 'width 0.3s ease',
    },
  }}>
    正在上传文件：{fileName}
  </Paper>
}

export default UploadProgress;