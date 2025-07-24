import { TableKit } from '@tiptap/extension-table'

export const TableExtension = ({ editable }: { editable: boolean }) => TableKit.configure({
  table: {
    handleWidth: 5,
    cellMinWidth: 25,
    resizable: editable,
    lastColumnResizable: editable,
    allowTableNodeSelection: editable,
  },
})

export default TableExtension