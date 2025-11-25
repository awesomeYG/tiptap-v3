import { EditorProps } from '@ctzhian/tiptap/type';
import { EditorContent } from '@tiptap/react';
import React from 'react';
import CustomBubbleMenu from '../component/CustomBubbleMenu';
import CustomDragHandle from '../component/CustomDragHandle';
import { ImageViewerProvider } from '../component/ImageViewer';
import { TableCellHandleMenu } from '../extension/component/TableCellHandleMenu';
import { TableExtendRowColumnButtons } from '../extension/component/TableExtendButton';
import { TableHandle } from '../extension/component/TableHandle';
import { TableSelectionOverlay } from '../extension/component/TableSelectionOverlay';

// fix: https://github.com/ueberdosis/tiptap/issues/6785
import 'core-js/actual/array/find-last';

const Editor = ({
  editor,
  menuInDragHandle,
  menuInBubbleMenu,
  onTip
}: EditorProps) => {
  return <ImageViewerProvider
    speed={500}
    maskOpacity={0.3}
  >
    <CustomBubbleMenu editor={editor} more={menuInBubbleMenu} />
    <CustomDragHandle editor={editor} more={menuInDragHandle} onTip={onTip} />
    <EditorContent editor={editor} />
    <TableHandle editor={editor} />
    <TableExtendRowColumnButtons editor={editor} />
    <TableSelectionOverlay
      editor={editor}
      showResizeHandles={true}
      cellMenu={(props) => (
        <TableCellHandleMenu
          editor={props.editor}
          onResizeStart={props.onResizeStart}
        />
      )}
    />
  </ImageViewerProvider>
};

export default Editor;