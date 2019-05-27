import {Component, Input, OnInit} from '@angular/core';
import {DashboardService} from '../Shared/dashboard.service';
import * as L from 'leaflet';
import {MapService} from "./map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    @Input() mapData;
public isLoaded;
public processedMapData;
public MapGeoJson;
  constructor(
      public dashboardService: DashboardService,
      public mapService: MapService,
  ) { }

  ngOnInit () {
    // console.log(this.mapData)
      this.isLoaded = false;
    this.getMap();

      // setTimeout(() => {
      //     console.log('hide');
      //     this.isLoaded = true;
      // }, 6000);
  }
  getMap () {
      this.buildMap(this.mapData.dashboardItem, this.mapData.result, this.mapData.rowDimensions,
          this.mapData.columnDimensions, this.mapData.orgUnitId, this.mapData.elmTyp).then((data) => {
          this.isLoaded = true;
          this.processedMapData = data;
          console.log(data);
      });
  }
    onMapReady(map: L.Map) {
    // console.log(map);
        map.fitBounds(this.MapGeoJson.getBounds(), {});
    }
    buildMap(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {
        const prom = new Promise((resolve, reject) => {
            const targetDashboardItem = dashboardItem[dashboardItemType];
            // console.log(dashboardItem);
            console.log(result);
            // console.log(rowDimensions);
            // console.log(columnDimensions);
            // console.log(orgUnitId);
            // console.log(dashboardItemType);
            // console.log(targetDashboardItem.hasOwnProperty('legendSet'));

            const geoData = [];
            let Maplegends1 = [];
            let mapData = {};
           this.mapService.criarGeoJson(targetDashboardItem, orgUnitId).subscribe((obj)  => {

                let coordenadas = [];
                // console.log(obj)
                obj.forEach((el, index) => {
                    // console.log("Elemento X",el)
                    let type = null;
                    let value = null;
                    let color = null;
                    const rowsValues: Array<number> = [];
                    // Aqui é onde criamos o nosso GeoJson
                    // console.log(result.rows)
                    // console.log(el);

                     result.rows.forEach((row, rowindex) => {
// console.log('entrou')
//                          console.log("Es2",index)
                         if (rowindex > 0) {
                             rowsValues.push(row[row.length - 1]);
                         }

                        if (el.id === row[1] || el.na === row[1]) {
                            value = row[row.length - 1];
                            // console.log(value);
                         if (el.ty === 1 || el.ty === 0) {
                                type = 'Point';
                                coordenadas = el.co;
                                // if (valCoordenadas !== undefined) {
                             console.log(el.co)
                                coordenadas = JSON.parse(el.co);
                                // console.log([coordenadas])
                                //     coordenadas = coordenadas[0];
                                // }
                                //
                            } else
                            if (el.ty === 2) {
                                const valCoordenadas = el.co;
                                type = 'MultiPolygon';
                                // coordenadas  = el.co;

                                // coordenadas = JSON.parse('[' + el.coordinates + ']');
                                // if (valCoordenadas !== undefined) {
                                coordenadas = JSON.parse(el.co);
                                // }

                            }

                            // this.mapService.legendSet = this.Maplegends;
                            if (targetDashboardItem.hasOwnProperty('legendSet')) {
                                // console.log(targetDashboardItem);
                                targetDashboardItem.legendSet.legends.forEach((legend) => {
                                    Maplegends1.push(legend);
                                });
                            } else {
                                // console.log(mapView.colorScale.split(','))
                                let legendClasses = 5;
                                let colorScale;
                                if (!targetDashboardItem.hasOwnProperty('colorScale')) {
                                    colorScale = '#d95f0e,#fe9929,#fed98e,#ffffd4,#993404';
                                } else {
                                    colorScale = targetDashboardItem.colorScale;
                                }
                                // console.log(rowsValues)
                                Maplegends1 = this.mapService.createLegendSet(Math.min(...rowsValues), Math.max(...rowsValues), legendClasses, colorScale);
                            }
                            Maplegends1.forEach((legend) => {
                                if (value >= legend.startValue && value <= legend.endValue) {
                                    color = legend.color;
                                    // console.log(color);
                                }
                            });

                            geoData.push({
                                'type': 'Feature',
                                'properties': {
                                    'orgUnit': el.na,
                                    'value': value,
                                    'color': color
                                },
                                'geometry': {
                                    "type": type,
                                    "coordinates": coordenadas
                                }
                            });

                            // this.mapService.getColor(2);

                            // console.log(coordenadas);
                            // i++;
                            // console.log(index)
                            // console.log(obj.length)

                            const geojsonMarkerOptions = {

                            };
                            if (index === obj.length - 1) {
                                this.MapGeoJson = L.geoJSON(geoData as any, {
                                    pointToLayer: function (feature, latlng) {
                                        return L.circleMarker(latlng);
                                    },
                                    style: function (feature) {
                                        return {
                                            weight: 1,
                                            opacity: 1,
                                            color: 'black',
                                            dashArray: '',
                                            fillOpacity: 0.7,
                                            fillColor: feature.properties.color
                                        };
                                    },
                                    onEachFeature: this.mapService.onEachFeature
                                });

                                mapData = {
                                    mapOptions: {
                                        center: L.latLng(0, 0),
                                        scrollWheelZoom: false,
                                        layers: [
                                            this.MapGeoJson,
                                            L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                                                '&copy; <a href="https://dhis2.org">DHIS2</a>',
                                            })
                                        ],
                                    }
                                };
                                console.log("resolveu")
                                resolve(mapData);
                            }

                        }

                    });
                    // console.log(result.rows)
                    // console.log(coordenadas);




                    // console.log(value);
                    // let a = this.mapService.getColor(value);
                    // console.log(a);
                    // console.log(color);


                });
            });
        });
        return prom;
    }
  }

