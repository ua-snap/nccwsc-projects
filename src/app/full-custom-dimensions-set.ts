import { DataLayerCustomDimensions } from './data-layer-custom-dimensions';

export type FullCustomDimensionsSet = { 
  [key in DataLayerCustomDimensions]: string | undefined 
};