import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PhotoProvider } from 'react-photo-view';
import { ImageViewerContext } from './context';
import { ImageViewerItem } from './Item';
import { customStyles } from './styles';
import { CustomToolbar } from './Toolbar';
import { ImageViewerItemProps, ImageViewerProviderProps } from './types';

export const ImageViewerProvider: React.FC<ImageViewerProviderProps> = ({
  children,
  speed = 500,
  maskOpacity = 0.3,
  onVisibleChange,
  onIndexChange,
  loop = 3,
  photoClosable,
  maskClosable = true,
  pullClosable = true,
  className,
  maskClassName,
  photoWrapClassName,
  photoClassName,
  loadingElement,
  brokenElement,
  portalContainer,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [onScale, setOnScale] = useState<((scale: number) => void) | null>(null);
  const [onRotate, setOnRotate] = useState<((rotate: number) => void) | null>(null);
  const [onClose, setOnClose] = useState<(() => void) | null>(null);
  const imageSrcsRef = useRef<string[]>([]);
  const overlayStateRef = useRef<{
    scale: number;
    rotate: number;
    visible: boolean;
    onScale: ((scale: number) => void) | null;
    onRotate: ((rotate: number) => void) | null;
    onClose: (() => void) | null;
    index: number | undefined;
  }>({
    scale: 1,
    rotate: 0,
    visible: false,
    onScale: null,
    onRotate: null,
    onClose: null,
    index: undefined,
  });
  const callbacksRef = useRef<{
    onScale: ((scale: number) => void) | null;
    onRotate: ((rotate: number) => void) | null;
    onClose: (() => void) | null;
  }>({
    onScale: null,
    onRotate: null,
    onClose: null,
  });

  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('image-viewer-custom-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'image-viewer-custom-styles';
      styleElement.textContent = customStyles;
      document.head.appendChild(styleElement);
    }
  }, []);

  useLayoutEffect(() => {
    const state = overlayStateRef.current;
    setScale(state.scale);
    setRotate(state.rotate);
    setVisible(state.visible);

    callbacksRef.current.onScale = state.onScale;
    callbacksRef.current.onRotate = state.onRotate;
    callbacksRef.current.onClose = state.onClose;

    setOnScale(() => state.onScale);
    setOnRotate(() => state.onRotate);
    setOnClose(() => state.onClose);

    if (state.visible && state.index !== undefined) {
      const src = imageSrcsRef.current[state.index];
      if (src) {
        setCurrentSrc(src);
      }
    }
  });

  useEffect(() => {
    const srcs: string[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === ImageViewerItem) {
        const src = (child.props as ImageViewerItemProps).src;
        if (src) {
          srcs.push(src);
        }
      }
    });
    imageSrcsRef.current = srcs;
  }, [children]);

  const contextValue = {
    setCurrentSrc,
    visible,
    setVisible,
    scale,
    setScale,
    rotate,
    setRotate,
    getScale: () => overlayStateRef.current.scale,
    getRotate: () => overlayStateRef.current.rotate,
    onScale: callbacksRef.current.onScale,
    setOnScale,
    onRotate: callbacksRef.current.onRotate,
    setOnRotate,
    onClose: callbacksRef.current.onClose,
    setOnClose,
  };

  const handleSpeed = typeof speed === 'function'
    ? speed
    : () => (typeof speed === 'number' ? speed : 500);

  return (
    <ImageViewerContext.Provider value={contextValue}>
      <PhotoProvider
        bannerVisible={false}
        speed={handleSpeed}
        maskOpacity={maskOpacity}
        loop={loop}
        photoClosable={photoClosable}
        maskClosable={maskClosable}
        pullClosable={pullClosable}
        className={className}
        maskClassName={maskClassName}
        photoWrapClassName={photoWrapClassName}
        photoClassName={photoClassName}
        loadingElement={loadingElement}
        brokenElement={brokenElement}
        portalContainer={portalContainer}
        overlayRender={({
          onScale: overlayOnScale,
          scale: overlayScale,
          rotate: overlayRotate,
          onRotate: overlayOnRotate,
          onClose: overlayOnClose,
          index,
          visible: overlayVisible
        }) => {
          overlayStateRef.current = {
            scale: overlayScale,
            rotate: overlayRotate,
            visible: overlayVisible,
            onScale: overlayOnScale,
            onRotate: overlayOnRotate,
            onClose: overlayOnClose,
            index,
          };

          return null;
        }}
        onVisibleChange={(visible, index) => {
          setVisible(visible);
          if (visible && index !== undefined) {
            const src = imageSrcsRef.current[index];
            if (src) {
              setCurrentSrc(src);
            }
          }
          onVisibleChange?.(visible, index);
        }}
        onIndexChange={(index) => {
          if (index !== undefined) {
            const src = imageSrcsRef.current[index];
            if (src) {
              setCurrentSrc(src);
            }
          }
          onIndexChange?.(index);
        }}
      >
        {children as any}
      </PhotoProvider>
      <CustomToolbar currentSrc={currentSrc} />
    </ImageViewerContext.Provider>
  );
};

