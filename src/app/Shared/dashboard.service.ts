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
    public trasformedDashboardItems: any = [];
    private dashboards: any = [];
    private selectedDashboard: any = [];
    private series = [];
    public MapGeoJson;
    private chartOpt = {};
    private tableData  = {};
    public Maplegends = [];
    public reportList = Array<{
        chartOptions: any[],
        mapOptions: any[],
        tableOptions: any[],
        dashboardID: number
    }>();
    private Mapseries = Array<{ value: number, code: string}>();
    private  OrgUnits = [];

  //  Variavel do mat-loader
    public waiting = true;

  constructor(
      public apiRequestsService: ApiRequestsService,
      public mapService: MapService,
  ) {}

    public getDashboardItems(dashboardPos) {
        // Limpamos as variaveis dos valores antigos
        this.dashboardItems = [];
        this.selectedDashboard = [];
        this.dashboards = [];

        this.load(dashboardPos);
        return this.dashboardItems;
    }

    public getDashboards() {
        // console.log(this.dashboards)

        return  this.dashboards;
    }
    public getSelectedDashboard() {
      // console.log(this.selectedDashboard)
        return this.selectedDashboard;
    }
    load(dashboardPos) {

            this.waiting = true;

            this.apiRequestsService.getDashboards().subscribe(resultado => {

            // Verificamos se a lista das dashboards ja havia sido carregada previamente

            // Carregamos todas dashboards do sistema e atribuimos a variavel dashboards
            // console.log(resultado.dashboards)

            for (let item of resultado.dashboards) {
                this.dashboards.push(item);
            }


                // Percoremos os items da dashboard para formatação dos dados
           this.selectedDashboard.push(resultado.dashboards[dashboardPos]);
            this.selectedDashboard[0].dashboardItems.forEach(async (element, intemIndex) => {
                // Limpamos todas variaveis
                this.chartOpt = {};
                this.tableData  = {};
                // this.dashboards[0].dashboardItems.forEach(async (element, intemIndex) => {
                    this.dashboards.push(this.selectedDashboard);
                this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element)).subscribe(async (result) => {
                    this.trasformedDashboardItems.push(result);
                    if (element.type === 'CHART') {
                        const rowDimensions = [element.chart.series];
                        const columnDimensions = [element.chart.category];
                        const mapData =  await this.buildMap(element, result, rowDimensions, columnDimensions, 'chart');
                        const chartOpt = this.buildChart(element, result, rowDimensions, columnDimensions, 'chart');
                        const tableData = this.builTable(element, result, rowDimensions, columnDimensions, 'chart');
                        this.dashboardItems.push({
                            chartOpt: chartOpt,
                            tableData: tableData,
                            mapData: mapData,
                            type: element.type,
                            renderedType: element.type,
                            displayName: element.chart.displayName

                        });
                        {

                        }
                    }
                });

                    // Vamos la tratar os Mapas
                    if (element.type === 'MAP') {
                        this.mapService.getMapviews(element.map.id).subscribe((res) => {
                            // console.log(res);
                            const geoData = [];

                            res.mapViews.forEach( (mapView) => {
                                // console.log(mapView)
                                if (mapView.layer !== 'boundary') {
                                    let Maplegends1 = [];
                                    // console.log(this.Maplegends)
                                    const dashboardItem = {
                                        map: mapView,
                                        type: 'map'
                                    };
                                    this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(dashboardItem)).subscribe(async (result) => {
                                        const rowDimensions = [];
                                        const columnDimensions = [];

                                        mapView.rows.forEach((rw) => {
                                            rowDimensions.push(rw.id);
                                        });
                                        mapView.columns.forEach((cm) => {
                                            columnDimensions.push(cm.id);
                                        });
                                        const mapData = await this.buildMap(dashboardItem, result, rowDimensions, columnDimensions, 'map');
                                        const chartOpt = this.buildChart(dashboardItem, result, rowDimensions, columnDimensions, 'map');
                                        const tableData = this.builTable(dashboardItem, result, rowDimensions, columnDimensions, 'map');
                                        this.dashboardItems.push({
                                            chartOpt: chartOpt,
                                            tableData: tableData,
                                            mapData: mapData,
                                            type: element.type,
                                            renderedType: element.type,
                                            displayName: element.map.displayName
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

                        this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element)).subscribe(async (result) => {
                            const rowDimensions = element.reportTable.rowDimensions;
                            const columnDimensions = element.reportTable.columnDimensions;
                            console.log(rowDimensions);
                            // console.log(columnDimensions);
                            const mapData = await this.buildMap(element, result, rowDimensions, columnDimensions, 'reportTable');
                            const chartOpt = this.buildChart(element, result, rowDimensions, columnDimensions, 'reportTable');
                            const tableData = this.builTable(element, result, rowDimensions, columnDimensions, 'reportTable');


                            this.dashboardItems.push({
                                chartOpt: chartOpt,
                                tableData: tableData,
                                mapData: mapData,
                                type: element.type,
                                renderedType: element.type,
                                displayName: element.reportTable.displayName

                            });
                        });
                    }
                });
            // });
                this.dashboards = resultado.dashboards;
        });
        // console.log(this.chartOptions);

    }

    // Funcao para construir tabelas
    builTable(dashboardItem, result, rowDimensions, columnDimensions, dashboardItemType) {
      // console.log(rowDimensions)
      // console.log(columnDimensions)
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
        });
        // traduzimos os elementos usados para identificar as colunas para a tabela porque vem representados pelos id
        columnDimensions.forEach((column) => {
            tableColumnDimensions.push(result.metaData.items[column].name);
        });
        // traduzimos os elementos presentes na resposta rows do analytics porque vem representados pelos id
        tableRows = result.rows;
        // console.log(tableRows)

        tableRows.forEach((row) => {
            row.forEach((rowElement, index) => {
                if (result.metaData.items[rowElement] !== undefined) {
                    row[index] = result.metaData.items[rowElement].name;
                }
            });
        });
        // console.log(tableRows)
        // tableRows = result.rows
        // colocamos os nomes dos elementos que representam a estrutura na primeira linha
        tableRows.unshift(rowNames);
        // console.log(tableRows)

        return {
                rowsValues: tableRows,
                rowDimensions: tableRowDimensions,
                columnDimensions: tableColumnDimensions
            };
    }

   buildChart(dashboardItem, result, rowDimensions, columnDimensions, dashboardItemType) {
    // Criamos tabela para o grafico
       let chartType;
if (dashboardItem[dashboardItemType].type !== undefined) {
    chartType = dashboardItem[dashboardItemType].type;
} else {
    chartType = 'COLUMN';
}

    // this.builTable(element, result, rowDimensions, columnDimensions, 'chart');


    let dataDItype = null;
    const xcategories = [];
    const ddiRows = [];
    const dataDIArray = [];
    let series = null;
    const chartOptions = [];
    let columnNamePosition;
    const rowDimensionValue = rowDimensions[0];
    const columnDimensionsValue = columnDimensions[0];


    if (rowDimensionValue === 'ou') {
    series = 'organisationUnits';
}
if (rowDimensionValue === 'pe') {
    series = 'periods';
}
if (rowDimensionValue === 'dx') {
    series = 'dataDimensionItems';
}

       // if (columnDimensionsValue === 'ou') {
       //     columnNamePosition = 2;
       // }
       // if (columnDimensionsValue === 'pe') {
       //     columnNamePosition = 1;
       // }
       // if (columnDimensionsValue === 'dx') {
       //  // console.log(result)
       //     columnNamePosition = 0;
       // }
       result.headers.forEach( (header, index) => {
           if (header.name === columnDimensionsValue) {
               columnNamePosition = index;
           }
       })

// console.log(dashboardItem)
// console.log(element.chart.series)

// console.log( dashboardItem[dashboardItemType]);
// console.log( element.chart[series]);
// Carregamos os dados PAra cada Dimensao, Unidade organizacional ou periodo que se encontra nas series
       dashboardItem[dashboardItemType][series].forEach((dataDI) => {
    let serieID;
    const rowsArray = [];
    // Definimos o id da dimensao pois este pode variar consoante o tipo de serie
    if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
        serieID = dataDI.id;
    } else {
        dataDItype = this.apiRequestsService.convertUnderscoreToCamelCase(dataDI.dataDimensionItemType);
        serieID = dataDI[dataDItype].id;
    }
    // console.log(result)
    // console.log(result.rows[1])

    result.rows.forEach((row, index) => {
        // console.log(result.metaData.items[filterName].name)
        row.forEach((rowElment, index2) => {
            if (rowElment.split('.')[0] === serieID) {
                const filterNameID = row[columnNamePosition];
                const filterName = result.metaData.items[filterNameID].name
                xcategories.push(filterName);
                if (chartType === 'PIE') {
                    // console.log("E pie");
                    // console.log(result.metaData.items[filterName].name);
                    // console.log(row[row.length - 1]);
                    rowsArray.push({
                        'name': filterName,
                        'y': parseFloat(row[row.length - 1])
                    });
                } else if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'LINE' || chartType === 'BAR' ) {
                    // console.log(dashboardItem)
                    // console.log(row[row.length - 1])
                    rowsArray.push(parseFloat(row[row.length - 1]));
                }
            }
        });
    });

    if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'LINE' || chartType === 'PIE' || chartType === 'BAR' ) {
        if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
            dataDIArray.push({'name': dataDI.displayName, 'data': rowsArray});

        } else {
            dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
        }
        // } else if (element.chart.type === 'PIE') {
        //     dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
        //
    }
});
// Atribuimos os valores trabalhados de acordo com o tipo de grafico
this.series = dataDIArray;

//
       let stackedColumnOptions = null;
       let chartTypeAtt = chartType;
       if (chartTypeAtt === 'STACKED_COLUMN') {
           chartTypeAtt = 'bar';
           stackedColumnOptions = {
                   stacking: 'normal'
           };
       } else {
           chartTypeAtt = chartType.toLowerCase();
       }
// console.log(element);
// console.log([49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]);
// console.log(this.series)
// this.title = ;
       this.waiting = false;
    return  {
        series: this.series,
        chart: {
            type: chartTypeAtt
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
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                }
            },
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            column: {
                dataLabels: {
                    enabled: true
                },
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{name}</b>: {point.y:.1f}',
                    }
                }
            },
            series: {
                stackedColumnOptions
            }

        }
    };


}

    buildMap (dashboardItem, result, rowDimensions, columnDimensions, dashboardItemType){
      const prom =  new Promise((resolve, reject) => {
          const targetDashboardItem = dashboardItem[dashboardItemType];
            const geoData = [];
            let Maplegends1 = [];
            let mapData = {};
            this.mapService.criarGeoJson(targetDashboardItem).subscribe((obj) => {

                let coordenadas = [];
                obj.forEach((el, index) => {
                    let type = null;
                    let value = null;
                    let color = null;
                    const rowsValues: Array<number> = [];
                    // Aqui é onde criamos o nosso GeoJson

                    if (el.ty === 2) {
                        const valCoordenadas = el.co;
                        type = 'MultiPolygon';
                        // coordenadas  = el.co;

                        // coordenadas = JSON.parse('[' + el.coordinates + ']');
                        // if (valCoordenadas !== undefined) {
                        coordenadas = JSON.parse(el.co);
                        // }

                    } else if (el.ty === 1 || el.ty === 0) {
                        type = 'Point';
                        coordenadas = el.co;
                        // if (valCoordenadas !== undefined) {
                        coordenadas = JSON.parse(el.co);
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

                    // this.mapService.legendSet = this.Maplegends;
                    if (targetDashboardItem.hasOwnProperty('legendSet')) {
                        // console.log(targetDashboardItem);
                        targetDashboardItem.legendSet.legends.forEach((legend) => {
                            Maplegends1.push(legend);
                        });
                    } else {
                        // console.log(mapView.colorScale.split(','))
                        let legendClasses;
                        if (targetDashboardItem.hasOwnProperty('legendSet')) {
                            legendClasses = targetDashboardItem.classes;
                        } else {
                            legendClasses = 5;
                        }
                        let colorScale;
                        if (!targetDashboardItem.hasOwnProperty('colorscale')) {
                            colorScale = '#ffffd4,#fed98e,#fe9929,#d95f0e,#993404';
                        } else {
                            colorScale = targetDashboardItem.colorScale;
                        }
                        Maplegends1 = this.mapService.createLegendSet(Math.min(...rowsValues), Math.max(...rowsValues), legendClasses, colorScale);
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
                    });

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

                        mapData =  {
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
                        resolve(mapData);
                    }
                });
            });
        });
      return prom;
  }
}

