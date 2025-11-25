import 'react-photo-view/dist/react-photo-view.css';
import { ImageViewerItem } from './Item';
import { ImageViewerProvider } from './Provider';

export type { ImageViewerItemProps, ImageViewerProviderProps } from './types';
export { ImageViewerItem, ImageViewerProvider };

export default {
  Provider: ImageViewerProvider,
  Item: ImageViewerItem,
};
