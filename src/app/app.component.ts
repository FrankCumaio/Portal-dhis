///<reference path="../../node_modules/@types/node/index.d.ts"/>
import { Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';
import { DashboardsService } from './Shared/dashboards.service';
import * as L from 'leaflet';

HC_map( Highcharts);
HC_exporting( Highcharts);

// require('../../js/world')(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    private title: string;
    public chartOptions: any = []; chartMap = [];
    public Highcharts = Highcharts;
    private dashboards: any;
    private series = [];
    public idDiv = 1;
    public reportList = Array<{
        chartOptions: any[],
        mapOptions: any[],
        dashboardID: number
    }>();
    private Mapseries = Array<{ value: number, code: string}>();
    private  OrgUnits = [];

    constructor(
        public dashboardsService: DashboardsService
    ) {
    }

    ngOnInit() {
        this.createDashboardItems();
        Highcharts.setOptions({
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
        });

    }

    createDashboardItems() {
        this.dashboardsService.getDashboards().subscribe(resultado => {
            // console.log(resultado.dashboards);
            // Carregamos todas dashboards do sistema e atribuimos a variavel dashboards
            this.dashboards = resultado.dashboards;
            // Percoremos cada dashboard para transformar os elementos
            this.dashboards.forEach((dashboard, i) => {
                // Percoremos os items da dashboard para formatação dos dados
                dashboard.dashboardItems.forEach((element, intemIndex) => {
                    if (element.type === 'CHART') {
                        // console.log(element)
                        this.dashboardsService.getItemData(this.dashboardsService.prepareForRequest(element)).subscribe((result) => {

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
                                    dataDItype = this.dashboardsService.convertUnderscoreToCamelCase(dataDI.dataDimensionItemType);
                                    serieID = dataDI[dataDItype].id;
                                }
                                // console.log(dataDI)
                                result.rows.forEach((row, index) => {
                                    if (row[0] === serieID) {
                                        // console.log (row)
                                        // console.log (dataDI)
                                      const  filterName = row[1];
                                        // console.log(result.metaData)
                                        xcategories.push(result.metaData.items[filterName].name)
                                       if (element.chart.type === 'PIE') {
                                            // console.log(result.metaData);
                                           rowsArray.push({'name': result.metaData.items[filterName].name , 'y': parseInt(row[2])});
                                        } else if (element.chart.type === 'COLUMN' || element.chart.type === 'LINE') {
                                            rowsArray.push(parseInt(row[2]));
                                        }
                                    }
                                })
                                if (element.chart.type === 'COLUMN' || element.chart.type === 'LINE' || element.chart.type === 'PIE') {
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
                            this.chartOptions.push({chartOpt: {
                                series: this.series,
                                chart: {
                                    type: element.chart.type.toLowerCase()
                                    // type: 'pie'
                                },
                                title: {
                                    text: element.chart.displayName
                                },
                                xAxis: {
                                    categories: xcategories,
                                    crosshair: false
                                },
                            },
                                type: element.type.toLowerCase()
                            });


                        });

                    }
                    // Vamos la tratar os Mapas
                    if (element.type === 'MAP') {
                        this.chartOptions.push({ mapOptions: {
                            zoom: element.map.zoom,
                            center: L.latLng(element.map.latitude, element.map.longitude),
                                layers: [
                                    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'DHIS2' })
                                ],
                        },
                            type: element.type.toLowerCase()
                        });
                        this.dashboardsService.getMapviews(element.map.id).subscribe((res) => {
                            console.log(res);
                            res.mapViews.forEach((mapView) => {
                               if ( mapView.layer !== 'boundary') {
                                   this.dashboardsService.getItemData(this.dashboardsService.prepareForRequest({map: mapView, type: 'map'})).subscribe((result) => {
                                      console.log(result) ;
                                   });
                        //            console.log(mapView);
                        //            this.dashboardsService.getItemData(this.dashboardsService.prepareForRequest(element)).subscribe((result) => {
                        //                console.log(element);
                        //                // this.dashboardsService.criarGeoJson(result).subscribe(async (obj) => {
                        //                //     console.log(obj);
                        //                //     const geoData = []
                        //                //     let type;
                        //                //     let index = 0;
                        //                // });
                        //            });
                               }
                            });
                        });
                        //


                    }


                });

        });
    });
        this.reportList.push(this.chartOptions, null);
        console.log(this.chartOptions);
    }
}
