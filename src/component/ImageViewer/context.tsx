import React from 'react';
import { ImageViewerContextType } from './types';

export const ImageViewerContext = React.createContext<ImageViewerContextType>({
  setCurrentSrc: () => { },
  visible: false,
  setVisible: () => { },
  scale: 1,
  setScale: () => { },
  rotate: 0,
  setRotate: () => { },
  getScale: () => 1,
  getRotate: () => 0,
  onScale: null,
  setOnScale: () => { },
  onRotate: null,
  setOnRotate: () => { },
  onClose: null,
  setOnClose: () => { },
});

