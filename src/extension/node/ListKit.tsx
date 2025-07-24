import { ListKit } from '@tiptap/extension-list';

export const ListExtension = ListKit.configure({
  taskItem: {
    nested: true,
  },
})

export default ListExtension