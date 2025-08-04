import { getShortcutKeyText } from "@cq/tiptap/util/shortcutKey";
import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { ArrowDownSLineIcon, FormulaIcon, FunctionsIcon, SquareRootIcon } from "../Icons";
import ToolbarItem from "./Item";

interface EditorMathProps {
  editor: Editor
}

const EditorMath = ({ editor }: EditorMathProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("inline-math");

  const MathOptions = [
    { id: 'inline-math', icon: <SquareRootIcon sx={{ fontSize: '1rem' }} />, label: '行内公式', shortcutKey: ['ctrl', '5'] },
    { id: 'block-math', icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />, label: '块级公式', shortcutKey: ['ctrl', '6'] },
  ];

  const updateSelection = () => {
    if (editor.isActive('inlineMath')) {
      setSelectedValue('inline-math');
    } else if (editor.isActive('blockMath')) {
      setSelectedValue('block-math');
    } else {
      setSelectedValue('none');
    }
  };

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    if (value === 'inline-math') {
      editor.commands.setInlineMath({
        latex: '',
      })
    } else if (value === 'block-math') {
      editor.commands.setBlockMath({
        latex: '',
      })
    }
    setSelectedValue(value);
  };

  useEffect(() => {
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);
    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor]);

  return <Select
    value={selectedValue}
    className={['inline-math', 'block-math'].includes(selectedValue) ? "tool-active" : ""}
    onChange={handleChange}
    renderValue={(value) => {
      return <ToolbarItem
        tip={'LaTeX 数学公式'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {MathOptions.find(it => it.id === value)?.icon || <FormulaIcon sx={{ fontSize: '1rem' }} />}
        </Stack>}
      />;
    }}
    IconComponent={({ className, ...rest }) => {
      return (
        <ArrowDownSLineIcon
          sx={{
            position: 'absolute',
            right: 2,
            flexSelf: 'center',
            fontSize: '1rem',
            flexShrink: 0,
            mr: 0,
            color: 'text.disabled',
            transform: className?.includes('MuiSelect-iconOpen') ? 'rotate(-180deg)' : 'none',
            transition: 'transform 0.3s',
            cursor: 'pointer',
            pointerEvents: 'none'
          }}
          {...rest}
        />
      );
    }}
  >
    <MenuItem key={'none'} value={'none'} sx={{ display: 'none' }}>
      <FormulaIcon sx={{ fontSize: '1rem' }} />
      <Box sx={{ ml: 1 }}>无</Box>
    </MenuItem>
    {MathOptions.map(it => (
      <MenuItem key={it.id} value={it.id}>
        <Tooltip arrow title={getShortcutKeyText(it.shortcutKey || [])} placement="right">
          <Stack direction={'row'} alignItems={'center'} justifyContent='center' gap={1}>
            {it.icon}
            <Box sx={{ fontSize: '0.875rem' }}>{it.label}</Box>
          </Stack>
        </Tooltip>
      </MenuItem>
    ))}
  </Select>
}

export default EditorMath