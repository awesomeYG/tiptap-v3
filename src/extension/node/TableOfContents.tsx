
import { getHierarchicalIndexes, TableOfContents } from '@tiptap/extension-table-of-contents'
import { TocList } from '@yu-cq/tiptap/type'

export const TableOfContentsExtension = ({ onTocUpdate }: { onTocUpdate?: (toc: TocList) => void }) => {
  return TableOfContents.configure({
    getIndex: getHierarchicalIndexes,
    onUpdate(toc) {
      onTocUpdate?.(toc.map(content => ({
        id: content.id,
        isActive: content.isActive,
        isScrolledOver: content.isScrolledOver,
        itemIndex: content.itemIndex,
        level: content.level,
        originalLevel: content.originalLevel,
        pos: content.pos,
        textContent: content.textContent,
      })))
    }
  })
}

export default TableOfContentsExtension