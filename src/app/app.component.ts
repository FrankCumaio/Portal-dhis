///<reference path="../../node_modules/@types/node/index.d.ts"/>
import { Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';
import { DashboardsService } from './Shared/dashboards.service';

HC_map( Highcharts);
HC_exporting(Highcharts);

// require('../../js/world')(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    private title: string;
    public chartOptions = []; chartMap = {};
    public Highcharts = Highcharts;
    private dashboards: any;
    private series = [];
    private Mapseries = Array<{ value: number, code: string}>();
    private  OrgUnits = [];

    constructor(
        public dashboardsService: DashboardsService
    ) {
    }

    ngOnInit() {
        this.getReportGroups('');
        Highcharts.setOptions({
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
        });

    }
    getReportGroups(token) {
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

                            // Carregamos os dados PAra cada Dimensao
                            element.chart.dataDimensionItems.forEach((dataDI) => {

                                const rowsArray = [];
                                dataDItype = this.dashboardsService.convertUnderscoreToCamelCase(dataDI.dataDimensionItemType);
                                console.log(result.metaData);
                                result.rows.forEach((row, index) => {
                                    if (row[0] === dataDI[dataDItype].id) {
                                      const  filterName = row[1];
                                        xcategories.push(result.metaData.items[filterName].name)
                                        rowsArray.push(parseInt(row[2]));
                                    }
                                });
                                if (element.chart.type === 'COLUMN' || element.chart.type === 'LINE') {
                                    dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                                } else if (element.chart.type === 'PIE') {
                                    this.series =  [{
                                        name: 'Brands',
                                        colorByPoint: true,
                                        data: [{
                                            name: 'Chrome',
                                            y: 61.41,
                                        }, {
                                            name: 'Internet Explorer',
                                            y: 11.84
                                        }, {
                                            name: 'Firefox',
                                            y: 10.85
                                        }, {
                                            name: 'Edge',
                                            y: 4.67
                                        }, {
                                            name: 'Safari',
                                            y: 4.18
                                        }, {
                                            name: 'Other',
                                            y: 7.05
                                        }]
                                    }];
                                }
                            });

                            this.series = dataDIArray;
                            // console.log(element);
                                // console.log([49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]);
                            // console.log(this.series)
                            // this.title = ;
                            this.chartOptions.push({
                                series: this.series,
                                chart: {
                                    type: element.chart.type.toLowerCase()
                                    // type: 'column'
                                },
                                title: {
                                    text: element.chart.displayName
                                },
                                xAxis: {
                                    categories: xcategories,
                                    crosshair: false
                                }
                            });
                        });
                    }
                    // Vamos la tratar os Mapas
                    if (element.type === 'MAP') {
                        this.dashboardsService.getMapviews(element.map.id).subscribe((res) => {
                            res.mapViews.forEach((mapView) => {
                               if ( mapView.layer !== 'boundary') {
                                   // console.log(mapView);
                                   // this.dashboardsService.getItemData(this.dashboardsService.prepareForRequest(element)).subscribe((result) => {
                                   //     this.dashboardsService.criarGeoJson(result).subscribe(async (obj) => {
                                   //         const geoData = []
                                   //         let type;
                                   //         let index = 0;
                                   //     });
                                   // });
                               }
                            });
                        });



                    }
        });
        });


    });

        const geoMap = {'type':'FeatureCollection','features':[{'type':'Feature','properties':{},'geometry':{'type':'LineString','coordinates':[[32,-21],[33,-21],[34,-24],[32,-26],[32,-26],[31,-22],[32,-21],[32,-21],[32,-21]]}}]}

        this.chartMap = {
            chart: {
                map: 'myMapName'
            },
            title: {
                text: 'Highmaps basic demo'
            },
            subtitle: {
                text: 'Map One'
            },
            colorAxis: {
                min: 0
            },
            series: [{
                name: 'Numero de doencas',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                allAreas: false,
                data: [
                    ['mz', 35],
                ]
            }]
        };
    }
}
