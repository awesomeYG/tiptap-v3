import Details, { DetailsContent, DetailsSummary } from "@tiptap/extension-details";

const CustomDetails = Details.extend({
  addKeyboardShortcuts() {
    return {
      'Shift-D': () => {
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