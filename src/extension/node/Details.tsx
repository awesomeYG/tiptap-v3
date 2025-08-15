import Details, { DetailsContent, DetailsSummary } from "@tiptap/extension-details";

const CustomDetails = Details.extend({
  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: element => element.hasAttribute('open'),
        renderHTML: ({ open }) => {
          if (!open) {
            return {}
          }
          return { open: '' }
        },
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-7': () => {
        return this.editor.chain().focus().setDetails().run()
      }
    }
  },
})

export const DetailsExtension = CustomDetails.configure({
  persist: true,
  openClassName: 'is-open',
  HTMLAttributes: {
    class: 'cq-details',
  },
});

export const DetailsSummaryExtension = DetailsSummary.configure({
});

export const DetailsContentExtension = DetailsContent.configure({
});