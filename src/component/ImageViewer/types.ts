import React, { ReactNode } from 'react';

export interface ImageViewerProviderProps {
  children: ReactNode;
  speed?: number | ((type: number) => number);
  maskOpacity?: number | null;
  onVisibleChange?: (visible: boolean, index: number) => void;
  onIndexChange?: (index: number) => void;
  loop?: boolean | number;
  photoClosable?: boolean;
  maskClosable?: boolean;
  pullClosable?: boolean;
  className?: string;
  maskClassName?: string;
  photoWrapClassName?: string;
  photoClassName?: string;
  loadingElement?: JSX.Element;
  brokenElement?: JSX.Element | ((photoProps: { src: string }) => JSX.Element);
  portalContainer?: HTMLElement;
}

export interface ImageViewerItemProps {
  src: string;
  children?: ReactNode;
  render?: (props: { attrs: Partial<React.HTMLAttributes<HTMLElement>>; scale: number; rotate: number }) => ReactNode;
  overlay?: ReactNode;
  width?: number;
  height?: number;
  triggers?: Array<'onClick' | 'onDoubleClick'>;
}

export interface ImageViewerContextType {
  setCurrentSrc: (src: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  scale: number;
  setScale: (scale: number) => void;
  rotate: number;
  setRotate: (rotate: number) => void;
  getScale: () => number;
  getRotate: () => number;
  onScale: ((scale: number) => void) | null;
  setOnScale: (fn: ((scale: number) => void) | null) => void;
  onRotate: ((rotate: number) => void) | null;
  setOnRotate: (fn: ((rotate: number) => void) | null) => void;
  onClose: (() => void) | null;
  setOnClose: (fn: (() => void) | null) => void;
}

