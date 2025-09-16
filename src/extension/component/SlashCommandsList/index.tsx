import { NestedList } from '@ctzhian/tiptap/component'
import { ArrowDownSLineIcon, AttachmentLineIcon, CheckboxCircleFillIcon, CloseCircleFillIcon, ErrorWarningFillIcon, FormulaIcon, FunctionsIcon, ImageLineIcon, Information2FillIcon, Information2LineIcon, MovieLineIcon, Music2LineIcon, SquareRootIcon, UploadIcon } from '@ctzhian/tiptap/component/Icons'
import { ToolbarItem } from '@ctzhian/tiptap/component/Toolbar'
import { SlashCommandsListProps, SlashCommandsListRef } from '@ctzhian/tiptap/type'
import {
  Divider,
  Paper,
  Stack
} from '@mui/material'
import React, { forwardRef } from 'react'

const SlashCommandsList = forwardRef<SlashCommandsListRef, SlashCommandsListProps>(
  ({ items, command }, ref) => {

    if (items.length === 0) {
      return null
    }

    return (
      <Paper
        elevation={8}
        sx={{
          // maxHeight: '300px',
          // overflow: 'auto',
          borderRadius: 'var(--mui-shape-borderRadius)',
          width: '224px',
          p: 0.5
        }}
      >
        <Stack direction={'row'} flexWrap={'wrap'}>
          {items.slice(0, 17).map((item, index) => (
            <ToolbarItem
              key={index}
              onClick={() => command(item)}
              icon={item.icon}
              tip={item.title}
            />
          ))}
        </Stack>
        <Divider sx={{ my: 0.5 }} />
        <NestedList
          list={[
            {
              label: '警告提示',
              key: 'highlight',
              icon: <Information2LineIcon sx={{ fontSize: '1rem' }} />,
              children: [
                {
                  label: '信息 Info',
                  key: 'info',
                  icon: <Information2FillIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '警告提示')
                    if (node) command({ ...node, attrs: { type: 'icon', variant: 'info' } })
                  },
                },
                {
                  label: '警告 Warning',
                  key: 'warning',
                  icon: <ErrorWarningFillIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '警告提示')
                    if (node) command({ ...node, attrs: { type: 'icon', variant: 'warning' } })
                  },
                },
                {
                  label: '错误 Error',
                  key: 'error',
                  icon: <CloseCircleFillIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '警告提示')
                    if (node) command({ ...node, attrs: { type: 'icon', variant: 'error' } })
                  },
                },
                {
                  label: '成功 Success',
                  key: 'success',
                  icon: <CheckboxCircleFillIcon sx={{ fontSize: '1rem', color: 'success.main' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '警告提示')
                    if (node) command({ ...node, attrs: { type: 'icon', variant: 'success' } })
                  },
                }
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
                  onClick: () => {
                    const node = items.find(it => it.title === '行内数学公式')
                    if (node) command(node)
                  }
                },
                {
                  label: '块级数学公式',
                  key: 'block-math',
                  icon: <FunctionsIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '块级数学公式')
                    if (node) command(node)
                  }
                }
              ]
            },
            {
              label: '上传文件',
              key: 'download',
              icon: <UploadIcon sx={{ fontSize: '1rem' }} />,
              children: [
                {
                  label: '上传图片',
                  key: 'image',
                  icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '图片')
                    if (node) command(node)
                  }
                },
                {
                  label: '上传视频',
                  key: 'video',
                  icon: <MovieLineIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '视频')
                    if (node) command(node)
                  }
                },
                {
                  label: '上传音频',
                  key: 'audio',
                  icon: <Music2LineIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '音频')
                    if (node) command(node)
                  }
                },
                {
                  label: '上传附件',
                  key: 'attachment',
                  icon: <AttachmentLineIcon sx={{ fontSize: '1rem' }} />,
                  onClick: () => {
                    const node = items.find(it => it.title === '附件')
                    if (node) command(node)
                  }
                }
              ]
            }
          ]}
          arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
        // onItemClick={(item) => {
        //   console.log(1, item)
        //   if (item.attrs) {
        //     const node = items.find(it => it.title === '警告提示')
        //     if (node) {
        //       command({ ...node, attrs: item.attrs })
        //       return
        //     }
        //   }
        //   if (item.onClick) item.onClick()
        // }}
        />
      </Paper>
    )
  }
)

SlashCommandsList.displayName = 'SlashCommandsList'

export default SlashCommandsList
