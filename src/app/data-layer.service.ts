import { Injectable } from '@angular/core';
import { FullCustomDimensionsSet } from './full-custom-dimensions-set';
import { DataLayerCustomDimensions } from './data-layer-custom-dimensions';

@Injectable()
export class DataLayerCustomDimensionsService {
  private _currentSet: FullCustomDimensionsSet;
  private _constantDimensions: {};

  constructor() {
    this._generateEmptyDimensionsSet();
    this._constantDimensions = {};
  }

/* There's an error here, not sure what should be provided for
someDimensions, PICKUP TRUCK */
  set dimensions(someDimensions: any) {
    someDimensions = someDimensions || {}
    Object.keys(DataLayerCustomDimensions).map(key => DataLayerCustomDimensions[key])
    .forEach(key => {
      this._currentSet[key] = someDimensions[key] || this._constantDimensions[key];
    });
    console.log(this._currentSet);
  }

  trigger() {
    (<any>window).dataLayer.push(this._currentSet);
  }

  private _generateEmptyDimensionsSet() {
    this._currentSet = {
      [DataLayerCustomDimensions.project]: undefined,
      [DataLayerCustomDimensions.region]: undefined,
      [DataLayerCustomDimensions.topic]: undefined,
      [DataLayerCustomDimensions.advsearch]: undefined,
      [DataLayerCustomDimensions.scibase01]: undefined,
      [DataLayerCustomDimensions.scibase02]: undefined,
    };
  }
}