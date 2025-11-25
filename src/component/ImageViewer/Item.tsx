import React from 'react';
import { PhotoView } from 'react-photo-view';
import { ImageViewerItemProps } from './types';

export const ImageViewerItem: React.FC<ImageViewerItemProps> = ({
  src,
  children,
  render,
  overlay,
  width,
  height,
  triggers = ['onClick'],
}) => {
  return (
    <PhotoView
      src={src}
      render={render}
      overlay={overlay}
      width={width}
      height={height}
      triggers={triggers}
    >
      {children as any}
    </PhotoView>
  );
};

