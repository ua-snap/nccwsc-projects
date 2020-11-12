import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeafletMapModel } from './map.model';
import * as L from 'leaflet';
import * as X2JS from "x2js";

@Component({
  selector: 'sb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @Input() mapUrl: string
  LAYER_OCM: any
  LAYER_OSM: any
  model: any
  shapename: any
  shapename2: any
  shapename3: any  
  projectshape_wms_url: any
  sb_footprint: any
  sb_boundingbox: any
  sb_children: any
  arrMapCenterLatLong: any
  xmsCapabilities: any
  fitBounds: any
  center: any
  wmsLayers: any = []
  layers: L.Layer[]
  layersControl: any
  options: any
  render: boolean = false;
  layersFromWMS:any = {}
  layersArray:any = []

  defineBaseLayers(){
    this.LAYER_OCM = {
      id: 'opencyclemap',
      name: 'Open Cycle Map',
      layer: L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 15,
        attribution: 'Open Cycle Map'
      })
    }
    this.LAYER_OSM = {
      id: 'openstreetmap',
      name: 'Open Street Map',
      layer: L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 15,
        attribution: 'Open Street Map'
      })
    }
  }

  defineOverlays() {
    this.projectshape_wms_url = this.mapUrl.replace(/service=wms&request=getcapabilities&version=1.3.0/, '');
    if (this.xmsCapabilities['WMS_Capabilities'].Capability.Layer.Layer && (this.xmsCapabilities['WMS_Capabilities'].Capability.Layer.Layer.length > 0)) {
      for (var layer of this.xmsCapabilities['WMS_Capabilities'].Capability.Layer.Layer) {
        this.layersArray.push({
          id: layer.Name, 
          name: layer.Name, 
          enabled: true, 
          layer: L.tileLayer.wms(this.projectshape_wms_url, {
            layers: layer.Name, 
            format: 'image/png', 
            transparent: true, 
            enabled: true
          })
        })
        this.layersFromWMS[layer.Name] = {
          id: layer.Name, 
          name: layer.Name, 
          enabled: true, 
          layer: L.tileLayer.wms(this.projectshape_wms_url, {
            layers: layer.Name, 
            format: 'image/png', 
            transparent: true, 
            enabled: true
          })
        }
      }
    }
    this.defineBaseLayers()
    this.defineModel()
    this.onApply()
  }

  parseWMSGeographicBoundingBox(boundingBox) {
    return [
      [boundingBox.southBoundLatitude, boundingBox.westBoundLongitude], // SW
      [boundingBox.northBoundLatitude, boundingBox.eastBoundLongitude] // NE
    ];
  }

  getWMSCapabilities(mapUrl) {
    var x2js = new X2JS()
    return this.http.get(mapUrl, { responseType: 'text' }).toPromise()
      .then(response => {
        var xmlData = response
        this.xmsCapabilities = x2js.xml2js(xmlData);
        if (this.xmsCapabilities) {
          if (this.xmsCapabilities && this.xmsCapabilities['WMS_Capabilities'] && this.xmsCapabilities['WMS_Capabilities'].Capability && this.xmsCapabilities['WMS_Capabilities'].Capability.Layer) {
            var thisLayer = this.xmsCapabilities['WMS_Capabilities'].Capability.Layer;
            if (thisLayer.Layer) {
              for (var i = 0, l = thisLayer.Layer.length; i < l; i++) {
                  var wms_layer = thisLayer.Layer[i];
                  if (wms_layer && wms_layer.EX_GeographicBoundingBox) {
                      this.wmsLayers[wms_layer.Name] = this.parseWMSGeographicBoundingBox(wms_layer.EX_GeographicBoundingBox);
                  } else {
                      this.wmsLayers[wms_layer.Name] = null;
                  }
              }
          }
          if (thisLayer.EX_GeographicBoundingBox) {
            this.fitBounds = this.parseWMSGeographicBoundingBox(thisLayer.EX_GeographicBoundingBox);
          }            
        }
      } else {

        console.log("We have no json data. :/");

      }

      console.log("Why should this be last?")
      this.defineOverlays()
      this.render = true

    })
    .catch(this.handleError);
  }

  defineModel() {
    var overlayArray = []   
    for (var key in this.layersFromWMS) {
      if (this.layersFromWMS.hasOwnProperty(key)) {
        overlayArray.push(this.layersFromWMS[key]);
      }
    }
    this.model = new LeafletMapModel(
      [ this.LAYER_OSM, this.LAYER_OCM ],
      this.LAYER_OCM.id,
      overlayArray
    );
  }
  

  mapInit() {
    this.options = {
      zoom: 3,
      center: L.latLng([ 39.8282, -98.5795 ]),
      fitBounds: this.fitBounds
    }
  }

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getWMSCapabilities(this.mapUrl)
  }
  
  private handleError(error: any): Promise < any > {
    return Promise.reject(error.message || error);
  }

  onApply() {
    this.mapInit()
    let baseLayer = this.model.baseLayers.find((l) => { 
      return l.id === this.model.baseLayer 
    })
    let newLayers = this.model.overlayLayers
      .filter((l) => { 
        return l.enabled 
      })
      .map((l) => { 
        return l.layer 
      })
    newLayers.unshift(baseLayer.layer)
    this.layers = newLayers
    var overlays = {}
    for (var thisLayer of this.layersFromWMS) {
      overlays[thisLayer.name] = thisLayer.layer
    }

    for (var key in this.layersFromWMS) {
      if (this.layersFromWMS.hasOwnProperty(key)) {
        overlays[key] = this.layersFromWMS[key].layer
      }
    }
    this.layersControl = {
      baseLayers: {
        'Open Street Map': this.LAYER_OSM.layer,
        'Open Cycle Map': this.LAYER_OCM.layer
      },
      overlays: overlays

    }
    return false;
  }

}
