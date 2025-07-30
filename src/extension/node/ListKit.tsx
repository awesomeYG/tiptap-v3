import { ListKit } from '@tiptap/extension-list';

export const ListExtension = ListKit.configure({
  orderedList: {
    HTMLAttributes: {
      class: 'ordered-list',
      'data-type': 'orderedList',
    },
  },
  bulletList: {
    HTMLAttributes: {
      class: 'bullet-list',
      'data-type': 'bulletList',
    },
  },
  taskItem: {
    nested: true,
    HTMLAttributes: {
      class: 'task-item',
      'data-type': 'taskList',
    },
  },
})

export default ListExtension