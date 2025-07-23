import Details, { DetailsContent, DetailsSummary } from "@tiptap/extension-details";

export const DetailsExtension = Details.configure({
  persist: true,
  openClassName: 'cq-details-open',
  HTMLAttributes: {
    class: 'cq-details',
  },
});

export const DetailsSummaryExtension = DetailsSummary.configure({
  HTMLAttributes: {
    class: 'cq-details-summary',
  },
});

export const DetailsContentExtension = DetailsContent.configure({
  HTMLAttributes: {
    class: 'cq-details-content',
  },
});