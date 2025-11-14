import { TocList } from '@ctzhian/tiptap/type'
import { getHierarchicalIndexes, TableOfContents } from '@tiptap/extension-table-of-contents'

export const TableOfContentsExtension = ({ onTocUpdate }: { onTocUpdate?: (toc: TocList) => void }) => TableOfContents.configure({
  getIndex: getHierarchicalIndexes,
  onUpdate(data) {
    setTimeout(() => {
      onTocUpdate?.(data.map(content => ({
        id: content.id,
        isActive: content.isActive,
        isScrolledOver: content.isScrolledOver,
        itemIndex: content.itemIndex,
        level: content.level,
        originalLevel: content.originalLevel,
        pos: content.pos,
        textContent: content.textContent,
      })))
    }, 0)
  }
})