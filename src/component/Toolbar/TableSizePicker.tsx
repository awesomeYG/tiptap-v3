import { Box, Stack } from "@mui/material";
import React, { useState } from "react";

const TableSizePicker: React.FC<{ onConfirm: (cols: number, rows: number) => void }> = ({ onConfirm }) => {
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const size = 10;

  return (
    <Stack gap={0.5}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 18px)`,
          gridAutoRows: '18px',
          gap: '2px',
          p: 0.25,
        }}
        onMouseLeave={() => {
          setCols(0);
          setRows(0);
        }}
      >
        {Array.from({ length: size }).map((_, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {Array.from({ length: size }).map((__, colIndex) => {
              const r = rowIndex + 1;
              const c = colIndex + 1;
              const activeCell = r <= rows && c <= cols;
              return (
                <Box
                  key={`cell-${r}-${c}`}
                  onMouseEnter={() => {
                    setCols(c);
                    setRows(r);
                  }}
                  onClick={() => onConfirm(c, r)}
                  sx={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: activeCell ? 'primary.main' : 'background.default',
                    transition: 'background-color 0.12s ease',
                    cursor: 'pointer',
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </Box>
      <Box sx={{ fontSize: 12, textAlign: 'center' }}>
        {cols > 0 && rows > 0 ? `${cols} 列 × ${rows} 行` : '选择表格大小'}
      </Box>
    </Stack>
  );
};

export default TableSizePicker;