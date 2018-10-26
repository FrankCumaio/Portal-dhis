import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import {ApiRequestsService} from './apiRequests.service';
import {MapService} from '../Map/map.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {forEach} from "@angular/router/src/utils/collection";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private title: string;
    public dashboardItems: any = []; chartMap = [];
    private dashboards: any = [];
    private selectedDashboard: any = [];
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

    public getDashboardItems(dashboardPos) {
        // Limpamos as variaveis dos valores antigos
        this.dashboardItems = [];
        this.selectedDashboard = [];
        this.dashboards = [];

        this.load(dashboardPos)
        return this.dashboardItems;
    }

    public getDashboards() {
        console.log(this.dashboards)

        return  this.dashboards;
    }
    public getSelectedDashboard() {
      console.log(this.selectedDashboard)
        return this.selectedDashboard;
    }
    load(dashboardPos) {

        return new Promise((resolve, reject) => {
        this.apiRequestsService.getDashboards().subscribe(resultado => {

            // Verificamos se a lista das dashboards ja havia sido carregada previamente

            // Carregamos todas dashboards do sistema e atribuimos a variavel dashboards
            console.log(resultado.dashboards)

            for (let item of resultado.dashboards) {
                this.dashboards.push(item);
            }


                // Percoremos os items da dashboard para formatação dos dados
           this.selectedDashboard.push(resultado.dashboards[dashboardPos]);
            this.selectedDashboard[0].dashboardItems.forEach(async (element, intemIndex) => {
                // this.dashboards[0].dashboardItems.forEach(async (element, intemIndex) => {
                    this.dashboards.push(this.selectedDashboard);
                    if (element.type === 'CHART') {
                        this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element)).subscribe((result) => {
                            // Criamos tabela para o grafico
                            const rowDimensions = [element.series];
                            const columnDimensions = [element.category];
                            // this.builTable(element, result, rowDimensions, columnDimensions, 'chart');


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
                            this.dashboardItems.push({
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
                                        text: ''
                                    },
                                    xAxis: {
                                        categories: xcategories,
                                        crosshair: false
                                    },
                                    legend: {
                                        reversed: true
                                    }
                                },
                                type: element.type,
                                renderedType: element.type,
                                displayName: element.chart.displayName
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
                                                        this.dashboardItems.push({
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
                                                            type: element.type,
                                                            renderedType: element.type,
                                                            displayName: element.map.displayName
                                                        });
                                                        this.dashboards = resultado.dashboards;
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
                            const rowDimensions = element.reportTable.rowDimensions;
                            const columnDimensions = element.reportTable.columnDimensions;
                            console.log(rowDimensions);
                            console.log(columnDimensions);
                    this.builTable(element, result, rowDimensions, columnDimensions,'reportTable');
                        });
                    }
                });
            // });
        });
        // console.log(this.chartOptions);
    });
    }
    builTable(element, result, rowDimensions, columnDimensions, type) {
        const rowNames = [];
        let tableRows = [];
        const tableRowDimensions = [];
        const tableColumnDimensions = [];
        // console.log(rowDimensions);
        // console.log(columnDimensions);

        result.headers.forEach((header) => {
            rowNames.push(header.column);
        });

        // traduzimos os elementos usados para identificar as linhas para a tabela porque vem representados pelos id
        rowDimensions.forEach((row) => {
            tableRowDimensions.push(result.metaData.items[row].name);
        })
        // traduzimos os elementos usados para identificar as colunas para a tabela porque vem representados pelos id
        columnDimensions.forEach((column) => {
            tableColumnDimensions.push(result.metaData.items[column].name);
        })
        // traduzimos os elementos presentes na resposta rows do analytics porque vem representados pelos id
        tableRows = result.rows
        tableRows.forEach((row) => {
            row.forEach((rowElement, index) => {
                if (result.metaData.items[rowElement] !== undefined) {
                    row[index] = result.metaData.items[rowElement].name;
                }
            });
        })
        // tableRows = result.rows
        // colocamos os nomes dos elementos que representam a estrutura na primeira linha
        tableRows.unshift(rowNames);

        this.dashboardItems.push({
            tableData: {
                rowsValues: tableRows,
                rowDimensions: tableRowDimensions,
                columnDimensions: tableColumnDimensions
            } ,
            type: element.type,
            renderedType: element.type,
            displayName: element[type].displayName

        });
    }
}
