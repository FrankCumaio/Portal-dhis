///<reference path="../../node_modules/@types/node/index.d.ts"/>
import { Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';
import { DashboardsService } from './Shared/dashboards.service';

HC_map(Highcharts);
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
    private series = Array<{ name: string, data: number[]}>();
    private Mapseries = Array<{ value: number, code: string}>();
    private  OrgUnits = [];

    constructor(
        public dashboardsService: DashboardsService
    ) {
    }

    ngOnInit() {
        this.getReportGroups('');
    }
    getReportGroups(token) {
        (function (factory) {
            if (typeof module === 'object' && module.exports) {
                module.exports = factory;
            } else {
                factory(Highcharts);
            }


        }(function (Highcharts) {
            Highcharts.maps['myMapName'] = {
                'title': 'Mozambique',
                'version': '1.1.2',
                'type': 'FeatureCollection',
                'copyright': 'Copyright (c) 2015 Highsoft AS, Based on data from Natural Earth',
                'copyrightShort': 'Natural Earth',
                'copyrightUrl': 'http://www.naturalearthdata.com',
                'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:EPSG:54003'}},
                'features': [{
                    'type': 'Feature',
                    'id': 'mz',
                    'properties': {
                        'hc-key': 'mz',
                        'hc-a2': 'mz',
                        "longitude": "38.7815",
                        "woe-name": "Nampula",
                        "latitude": "-14.9497",
                        'name': 'Inhambane',
                    },
                    'geometry': {
                        'type': 'MultiPolygon',
                        'coordinates': [
                            [
                                [
                                    [
                                        5245,
                                        5882
                                    ],
                                    [
                                        5199,
                                        5897
                                    ],
                                    [
                                        5201,
                                        5958
                                    ],
                                    [
                                        5274,
                                        5969
                                    ],
                                    [
                                        5245,
                                        5882
                                    ]
                                ]
                            ],
                            [
                                [
                                    [
                                        5666,
                                        7814
                                    ],
                                    [
                                        5714,
                                        7811
                                    ],
                                    [
                                        5758,
                                        7773
                                    ],
                                    [
                                        5719,
                                        7726
                                    ],
                                    [
                                        5741,
                                        7660
                                    ],
                                    [
                                        5748,
                                        7580
                                    ],
                                    [
                                        5775,
                                        7525
                                    ],
                                    [
                                        5784,
                                        7459
                                    ],
                                    [
                                        5746,
                                        7424
                                    ],
                                    [
                                        5755,
                                        7388
                                    ],
                                    [
                                        5708,
                                        7373
                                    ],
                                    [
                                        5761,
                                        7313
                                    ],
                                    [
                                        5761,
                                        7333
                                    ],
                                    [
                                        5810,
                                        7357
                                    ],
                                    [
                                        5841,
                                        7297
                                    ],
                                    [
                                        5831,
                                        7251
                                    ],
                                    [
                                        5799,
                                        7234
                                    ],
                                    [
                                        5768,
                                        7253
                                    ],
                                    [
                                        5779,
                                        7179
                                    ],
                                    [
                                        5755,
                                        7152
                                    ],
                                    [
                                        5758,
                                        7101
                                    ],
                                    [
                                        5802,
                                        7185
                                    ],
                                    [
                                        5848,
                                        7207
                                    ],
                                    [
                                        5900,
                                        7165
                                    ],
                                    [
                                        5881,
                                        7130
                                    ],
                                    [
                                        5876,
                                        7066
                                    ],
                                    [
                                        5898,
                                        7003
                                    ],
                                    [
                                        5887,
                                        6938
                                    ],
                                    [
                                        5814,
                                        6884
                                    ],
                                    [
                                        5766,
                                        6871
                                    ],
                                    [
                                        5826,
                                        6860
                                    ],
                                    [
                                        5833,
                                        6817
                                    ],
                                    [
                                        5776,
                                        6825
                                    ],
                                    [
                                        5800,
                                        6760
                                    ],
                                    [
                                        5741,
                                        6745
                                    ],
                                    [
                                        5727,
                                        6725
                                    ],
                                    [
                                        5683,
                                        6732
                                    ],
                                    [
                                        5668,
                                        6691
                                    ],
                                    [
                                        5712,
                                        6675
                                    ],
                                    [
                                        5732,
                                        6703
                                    ],
                                    [
                                        5764,
                                        6690
                                    ],
                                    [
                                        5777,
                                        6653
                                    ],
                                    [
                                        5766,
                                        6609
                                    ],
                                    [
                                        5737,
                                        6579
                                    ],
                                    [
                                        5703,
                                        6508
                                    ],
                                    [
                                        5710,
                                        6491
                                    ],
                                    [
                                        5601,
                                        6403
                                    ],
                                    [
                                        5559,
                                        6337
                                    ],
                                    [
                                        5425,
                                        6207
                                    ],
                                    [
                                        5397,
                                        6192
                                    ],
                                    [
                                        5404,
                                        6161
                                    ],
                                    [
                                        5383,
                                        6109
                                    ],
                                    [
                                        5306,
                                        6006
                                    ],
                                    [
                                        5242,
                                        5996
                                    ],
                                    [
                                        5169,
                                        5957
                                    ],
                                    [
                                        5191,
                                        5886
                                    ],
                                    [
                                        5109,
                                        5805
                                    ],
                                    [
                                        5000,
                                        5739
                                    ],
                                    [
                                        4885,
                                        5684
                                    ],
                                    [
                                        4735,
                                        5590
                                    ],
                                    [
                                        4735,
                                        5622
                                    ],
                                    [
                                        4682,
                                        5725
                                    ],
                                    [
                                        4651,
                                        5745
                                    ],
                                    [
                                        4648,
                                        5799
                                    ],
                                    [
                                        4686,
                                        5816
                                    ],
                                    [
                                        4684,
                                        5878
                                    ],
                                    [
                                        4614,
                                        6037
                                    ],
                                    [
                                        4627,
                                        6099
                                    ],
                                    [
                                        4583,
                                        6189
                                    ],
                                    [
                                        4550,
                                        6292
                                    ],
                                    [
                                        4470,
                                        6391
                                    ],
                                    [
                                        4385,
                                        6430
                                    ],
                                    [
                                        4273,
                                        6539
                                    ],
                                    [
                                        4159,
                                        6566
                                    ],
                                    [
                                        4123,
                                        6626
                                    ],
                                    [
                                        4028,
                                        6678
                                    ],
                                    [
                                        4003,
                                        6706
                                    ],
                                    [
                                        3964,
                                        6704
                                    ],
                                    [
                                        3933,
                                        6737
                                    ],
                                    [
                                        3827,
                                        6704
                                    ],
                                    [
                                        3729,
                                        6779
                                    ],
                                    [
                                        3673,
                                        6734
                                    ],
                                    [
                                        3634,
                                        6723
                                    ],
                                    [
                                        3594,
                                        6759
                                    ],
                                    [
                                        3567,
                                        6825
                                    ],
                                    [
                                        3530,
                                        6862
                                    ],
                                    [
                                        3206,
                                        6873
                                    ],
                                    [
                                        3285,
                                        6962
                                    ],
                                    [
                                        3322,
                                        7024
                                    ],
                                    [
                                        3393,
                                        7075
                                    ],
                                    [
                                        3457,
                                        7102
                                    ],
                                    [
                                        3506,
                                        7141
                                    ],
                                    [
                                        3551,
                                        7134
                                    ],
                                    [
                                        3618,
                                        7169
                                    ],
                                    [
                                        3720,
                                        7270
                                    ],
                                    [
                                        3771,
                                        7269
                                    ],
                                    [
                                        3810,
                                        7309
                                    ],
                                    [
                                        3804,
                                        7335
                                    ],
                                    [
                                        3839,
                                        7350
                                    ],
                                    [
                                        3890,
                                        7345
                                    ],
                                    [
                                        3929,
                                        7376
                                    ],
                                    [
                                        3957,
                                        7375
                                    ],
                                    [
                                        4008,
                                        7324
                                    ],
                                    [
                                        4051,
                                        7352
                                    ],
                                    [
                                        4161,
                                        7370
                                    ],
                                    [
                                        4223,
                                        7415
                                    ],
                                    [
                                        4326,
                                        7436
                                    ],
                                    [
                                        4415,
                                        7418
                                    ],
                                    [
                                        4512,
                                        7420
                                    ],
                                    [
                                        4600,
                                        7443
                                    ],
                                    [
                                        4686,
                                        7495
                                    ],
                                    [
                                        4732,
                                        7506
                                    ],
                                    [
                                        4773,
                                        7549
                                    ],
                                    [
                                        4842,
                                        7539
                                    ],
                                    [
                                        4905,
                                        7578
                                    ],
                                    [
                                        5004,
                                        7617
                                    ],
                                    [
                                        5026,
                                        7648
                                    ],
                                    [
                                        5100,
                                        7680
                                    ],
                                    [
                                        5158,
                                        7690
                                    ],
                                    [
                                        5196,
                                        7717
                                    ],
                                    [
                                        5266,
                                        7714
                                    ],
                                    [
                                        5382,
                                        7820
                                    ],
                                    [
                                        5454,
                                        7861
                                    ],
                                    [
                                        5534,
                                        7832
                                    ],
                                    [
                                        5645,
                                        7850
                                    ],
                                    [
                                        5666,
                                        7814
                                    ]
                                ]
                            ]
                        ]
                    }
                }
                ]
            }
        }));


        this.dashboardsService.getDashboards().subscribe(resultado => {
            // console.log(resultado.dashboards);
            // Carregamos todas dashboards do sistema e atribuimos a variavel dashboards
            this.dashboards = resultado.dashboards;
            // Percoremos cada dashboard para transformar os elementos
            this.dashboards.forEach((dashboard, i) => {
                // Percoremos os items da dashboard para formatação dos dados
                dashboard.dashboardItems.forEach((element, intemIndex) => {
                    if (element.type === 'CHART') {
                        this.dashboardsService.getItemData(this.dashboardsService.prepareForRequest(element)).subscribe((result) => {
                            console.log(element.chart);
                            console.log(result);
                            element.chart.organisationUnits.forEach((orgUnit, index) => {
                                this.OrgUnits.push(orgUnit.displayName);
                                result.rows.forEach((row) => {
                                    let orgName = '';
                                        this.series.push({name:  'oi', data: [parseInt(row[2])]});

                                });
                            });

                                // console.log([49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]);
                            console.log(this.series)
                            // this.title = ;
                            this.chartOptions.push({
                                series: this.series,
                                chart: {
                                    type: 'column'
                                },
                                title: {
                                    text: element.chart.displayName
                                },
                                xAxis: {
                                    categories: 1,
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
