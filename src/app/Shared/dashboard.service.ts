import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import {ApiRequestsService} from './apiRequests.service';
import {MapService} from '../Map/map.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {forEach} from "@angular/router/src/utils/collection";
import {st} from "@angular/core/src/render3";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private title: string;
    public dahsboardOptions: any = []; chartMap = [];
    private dashboards: any;
    private series = [];
    public MapGeoJson;
    public Maplegends = [];
    public reportList = Array<{
        chartOptions: any[],
        mapOptions: any[],
        tableOptions: any[],
        dashboardID: number
    }>();
    private Mapseries = Array<{ value: number, code: string}>();
    private  OrgUnits = [];

  constructor(
      public apiRequestsService: ApiRequestsService,
      public mapService: MapService,
  ) {}

    public getDashboards() {
        return this.dahsboardOptions;
    }

    load() {
        return new Promise((resolve, reject) => {
        this.apiRequestsService.getDashboards().subscribe(resultado => {
            // console.log(resultado.dashboards);
            // Carregamos todas dashboards do sistema e atribuimos a variavel dashboards
            this.dashboards = resultado.dashboards;
            // Percoremos cada dashboard para transformar os elementos
            this.dashboards.forEach((dashboard, i) => {
                // Percoremos os items da dashboard para formatação dos dados
                dashboard.dashboardItems.forEach(async (element, intemIndex) => {
                // this.dashboards[0].dashboardItems.forEach(async (element, intemIndex) => {
                    if (element.type === 'CHART') {
                        this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element)).subscribe((result) => {

                            let dataDItype = null;
                            const xcategories = [];
                            const ddiRows = [];
                            const dataDIArray = [];
                            let series = null;
                            const chartOptions = [];

                            if (element.chart.series === 'ou') {
                                series = 'organisationUnits';
                            }
                            if (element.chart.series === 'pe') {
                                series = 'periods';
                            }
                            if (element.chart.series === 'dx') {
                                series = 'dataDimensionItems';
                            }

                            // console.log(element)
                            // console.log(element.chart.series)

// console.log( series);
// console.log( element.chart[series]);
                            // Carregamos os dados PAra cada Dimensao, Unidade organizacional ou periodo que se encontra nas series
                            element.chart[series].forEach((dataDI) => {
                                let serieID;
                                const rowsArray = [];
                                // Definimos o id da dimensao pois este pode variar consoante o tipo de serie
                                if (element.chart.series === 'ou' || element.chart.series === 'pe') {
                                    serieID = dataDI.id;
                                } else {
                                    dataDItype = this.apiRequestsService.convertUnderscoreToCamelCase(dataDI.dataDimensionItemType);
                                    serieID = dataDI[dataDItype].id;
                                }
                                // console.log(dataDI)

                                result.rows.forEach((row, index) => {
                                    if (row[0] === serieID) {
                                        // console.log (row)
                                        // console.log (dataDI)
                                        const filterName = row[1];
                                        // console.log(result.metaData)
                                        xcategories.push(result.metaData.items[filterName].name)
                                        if (element.chart.type === 'PIE') {
                                            // console.log(result.metaData);
                                            rowsArray.push({
                                                'name': result.metaData.items[filterName].name,
                                                'y': parseInt(row[row.length - 1])
                                            });
                                        } else if (element.chart.type === 'COLUMN' || element.chart.type === 'LINE') {
                                            rowsArray.push(parseInt(row[row.length - 1]));
                                        }
                                    }
                                });

                        if (element.chart.type === 'COLUMN' || element.chart.type === 'LINE' ||
                                element.chart.type === 'PIE' || element.chart.type === 'BAR' ) {
                                    if (element.chart.series === 'ou' || element.chart.series === 'pe') {
                                        dataDIArray.push({'name': dataDI.displayName, 'data': rowsArray});

                                    } else {
                                        dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                                    }
                                    // } else if (element.chart.type === 'PIE') {
                                    //     dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                                    //
                                }
                            });

                            this.series = dataDIArray;
                            // console.log(element);
                            // console.log([49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]);
                            // console.log(this.series)
                            // this.title = ;
                            this.dahsboardOptions.push({
                                chartOpt: {
                                    series: this.series,
                                    chart: {
                                        type: element.chart.type.toLowerCase()
                                        // type: 'pie'
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: element.chart.displayName
                                    },
                                    xAxis: {
                                        categories: xcategories,
                                        crosshair: false
                                    },
                                    legend: {
                                        reversed: true
                                    }
                                },
                                type: element.type.toLowerCase()
                            });


                        });

                    }
                    // Vamos la tratar os Mapas
                    if (element.type === 'MAP') {
                        this.mapService.getMapviews(element.map.id).subscribe((res) => {
                            // console.log(res);
                            const geoData = []

                            res.mapViews.forEach( (mapView) => {
                                // console.log(mapView)
                                if (mapView.layer !== 'boundary') {
                                    let Maplegends1 = [];
                                    // console.log(this.Maplegends)
                                    this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest({
                                        map: mapView,
                                        type: 'map'
                                    })).subscribe((result) => {

                                        this.mapService.criarGeoJson(mapView).subscribe((obj) => {

                                            let coordenadas = [];
                                                obj.forEach((el, index) => {
                                                    let type = null;
                                                    let value = null;
                                                    let color = null;
                                                    const rowsValues: Array<number> = [];
                                                    // Aqui é onde criamos o nosso GeoJson

                                                    if (el.ty === 2) {
                                                        const valCoordenadas = el.co;
                                                        type = 'MultiPolygon'
                                                        // coordenadas  = el.co;

                                                        // coordenadas = JSON.parse('[' + el.coordinates + ']');
                                                        // if (valCoordenadas !== undefined) {
                                                            coordenadas = JSON.parse(el.co );
                                                        // }

                                                    } else if (el.ty === 1 || el.ty === 0) {
                                                        type = 'Point'
                                                        coordenadas  = el.co;
                                                            // if (valCoordenadas !== undefined) {
                                                                coordenadas = JSON.parse(el.co );
                                                                // console.log([coordenadas])
                                                            //     coordenadas = coordenadas[0];
                                                            // }
                                                        //
                                                    }

                                                    result.rows.forEach((row) => {
                                                        if (el.id === row[1]) {
                                                            value = row[row.length - 1];
                                                        }
                                                        rowsValues.push(row[row.length - 1]);
                                                    });
                                                    // console.log(result.rows)
                                                    // console.log(coordenadas);
                                                    // console.log(geoData);
                                                    // this.mapService.legendSet = this.Maplegends;
                                                    if (mapView.hasOwnProperty('legendSet')) {
                                                        mapView.legendSet.legends.forEach((legend) => {
                                                            Maplegends1.push(legend);
                                                        });
                                                    } else {
                                                        // console.log(mapView.colorScale.split(','))
                                                        Maplegends1 = this.mapService.createLegendSet(Math.min(...rowsValues), Math.max(...rowsValues), mapView.classes, mapView.colorScale)
                                                    }
                                                        Maplegends1.forEach((legend) => {
                                                            if (value >= legend.startValue && value <= legend.endValue) {
                                                                color = legend.color;
                                                                // console.log(color);
                                                            }
                                                        });


                                                    // console.log(value);
                                                    // let a = this.mapService.getColor(value);
                                                    // console.log(a);
                                                    // console.log(color);

                                                    geoData.push({
                                                        'type': 'Feature',
                                                        'properties': {
                                                            'orgUnit': el.na,
                                                            'value': value,
                                                            'color': color
                                                        },
                                                        'geometry': {
                                                            'type': type,
                                                            'coordinates': coordenadas
                                                        }
                                                    })

                                                    // this.mapService.getColor(2);

                                                    // console.log(geoData);
                                                    // i++;
                                                    // console.log(element)
                                                    if (index === obj.length - 1) {
                                                        this.MapGeoJson = L.geoJSON(geoData as any, {
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
                                                        this.dahsboardOptions.push({
                                                            mapOptions: {
                                                                zoom: element.map.zoom,
                                                                center: L.latLng(element.map.latitude, element.map.longitude),
                                                                layers: [
                                                                    this.MapGeoJson,
                                                                    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                                                                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                                                                        '&copy; <a href="https://dhis2.org">DHIS2</a>',
                                                                    })
                                                                ],
                                                            },
                                                            type: element.type.toLowerCase(),
                                                            displayName: element.map.displayName
                                                        });
                                                        resolve(true);
                                                    }
                                                });
                                        });

                                    });
                                    // geoData = [];
                                }
                            });
                        });
                    }
                //    Vamos la tratar das tabelas
                    if (element.type === 'REPORT_TABLE') {
                        // console.log(element);
                        this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element)).subscribe((result) => {
                            // console.log(result);
                            const columnNames = [{
                                id: "position",
                                value: "No."

                            }, {
                                id: "name",
                                value: "Name"
                            },
                                {
                                    id: "weight",
                                    value: "Weight"
                                },
                                {
                                    id: "symbol",
                                    value: "Symbol"
                                }];
                            const ELEMENT_DATA = [{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
                                { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
                                { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
                                { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
                                { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
                                { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' }
                            ];

                            this.dahsboardOptions.push({
                                tableOptions: {
                                    dataSource: new MatTableDataSource(ELEMENT_DATA),
                                    displayedColumns: ['position', 'name', 'weight', 'symbol']
                                } ,
                                type: element.type.toLowerCase()
                            });
                        });
                    }
                });
            });
        });
        // console.log(this.chartOptions);
    });
    }
}
