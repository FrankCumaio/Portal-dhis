import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {ApiRequestsService} from './apiRequests.service';
import {MapService} from '../Map/map.service';
import {type} from "os";


@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private title: string;
    public dashboardItems: any = [];
    chartMap = [];
    public trasformedDashboardItems: any = [];
    private dashboards: any = [];
    private selectedDashboard: any = [];
    private selectedOrgUnit: any = [];
    private series = [];
    private chartData = {};
    private tableData = {};
    public Maplegends = [];
    public orgUnits: any = [];
    public periods: any = [];

    //  Variavel do mat-loader
    public waiting = true;

    constructor(
        public apiRequestsService: ApiRequestsService,
        public mapService: MapService,
    ) {
    }

    public getDashboardItems(dashboardPos, orgUnit, period) {
        // Limpamos as variaveis dos valores antigos

        if (orgUnit === null) {
            this.selectedDashboard = [];
        }
        //
        this.selectedOrgUnit = [];
        this.dashboardItems = [];
        this.dashboards = [];
        this.orgUnits = [];
        // console.log(orgUnit)
        this.load(dashboardPos, orgUnit);


        return this.dashboardItems;
    }

    public getDashboards() {
        // console.log(this.dashboards)

        return this.dashboards;
    }

    public getOrgUnits() {
        return this.orgUnits;
    }

    public getPeriods() {
        return 0;
    }

    public getSelectedDashboard() {
        // console.log(this.selectedDashboard)
        return this.selectedDashboard;
    }

    public getSelectedOrgUnit() {
        // console.log(this.selectedDashboard)
        return this.selectedOrgUnit;
    }

    load(dashboardPos, orgUnitId) {

        this.waiting = true;

        this.apiRequestsService.getDashboards().subscribe(resultado => {

            // Verificamos se a lista das dashboards ja havia sido carregada previamente

            // Carregamos todas dashboards do sistema e atribuimos a variavel dashboards

            resultado.dashboards.forEach((item) => {
                this.dashboards.push(item);
            });
            // }
            if (orgUnitId === null) {
                // Percoremos os items da dashboard para formatação dos dados
                this.selectedDashboard.push(resultado.dashboards[dashboardPos]);
            }
            this.selectedDashboard[0].dashboardItems.forEach(async (element, intemIndex) => {
                // Limpamos todas variaveis
                this.chartData = {};
                this.tableData = {};
                // this.dashboards[0].dashboardItems.forEach(async (element, intemIndex) => {
                //     this.dashboards.push(this.selectedDashboard);
                //    Vamos la tratar dos graficos
                if (element.type === 'CHART' || element.type === 'REPORT_TABLE' || element.type === 'EVENT_REPORT') {
                    this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element), orgUnitId).subscribe(async (result) => {
                        this.trasformedDashboardItems.push(result);
                        let columnDimensions, rowDimensions, elmTyp;
// console.log(element);
// console.log(element.organisationUnits);
                        let mapData = null;
                        if (element.type === 'CHART') {
                             elmTyp = 'chart';
                             rowDimensions = [element.chart.category];
                             columnDimensions = [element.chart.series];
                        } else if (element.type === 'REPORT_TABLE' || element.type === 'EVENT_REPORT') {
                            elmTyp = this.apiRequestsService.convertUnderscoreToCamelCase(element.type);
                             rowDimensions = element[elmTyp].rowDimensions;
                             columnDimensions = element[elmTyp].columnDimensions;
                        }

                        const dashboardItem = element;
                        if (element.organisationUnits !== undefined) {
                            mapData = {dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, elmTyp};
                        }
                        const chartData = {dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, elmTyp};
                        const tableData = {dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, elmTyp};
                        this.dashboardItems.push({
                            chartData: chartData,
                            tableData: tableData,
                            mapData: mapData,
                            type: element.type,
                            renderedType: element.type,
                            displayName: element[elmTyp].displayName

                        });
                    });
                } else

                if (element.type === 'MAP') {
                    // console.log(element);
                    await this.mapService.getMapviews(element.map.id).subscribe((res) => {
                        // console.log(res.organisationUnits);

                        const geoData = [];

                        res.mapViews.forEach((mapView) => {
                            // console.log(mapView)
                            if (mapView.layer !== 'boundary') {
                                const Maplegends1 = [];
                                // console.log(this.Maplegends)
                                const dashboardItem = {
                                    map: mapView,
                                    type: 'map'
                                };
                                this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(dashboardItem), orgUnitId).subscribe(async (result) => {
                                    const rowDimensions = [];
                                    const columnDimensions = [];
                                    let mapData;

                                    mapView.rows.forEach((rw) => {
                                        rowDimensions.push(rw.id);
                                    });
                                    mapView.columns.forEach((cm) => {
                                        columnDimensions.push(cm.id);
                                    });
                                    const elmTyp = 'map';
                                    mapData = {
                                        dashboardItem,
                                        result,
                                        rowDimensions,
                                        columnDimensions,
                                        orgUnitId,
                                        elmTyp
                                    }
                                    // this.buildMap(dashboardItem, result, rowDimensions,
                                    //     columnDimensions, orgUnitId, 'map').then((data) => {
                                    //     mapData = data;
                                    // })
                                    const chartData = {
                                        dashboardItem,
                                        result,
                                        rowDimensions,
                                        columnDimensions,
                                        orgUnitId,
                                        elmTyp
                                    };
                                    const tableData = {
                                        dashboardItem,
                                        result,
                                        rowDimensions,
                                        columnDimensions,
                                        orgUnitId,
                                        elmTyp
                                    }
                                    this.dashboardItems.push({
                                        chartData: chartData,
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
                } else
                //    Vamos la tratar os Event charts
                if (element.type === 'EVENT_CHART') {
                    this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element), orgUnitId).subscribe(async (result) => {
                        this.trasformedDashboardItems.push(result);
                        const elmTyp = 'eventChart';
                        const dashboardItem = element;
                        const rowDimensions = element.eventChart.rowDimensions;
                        const columnDimensions = element.eventChart.columnDimensions;
                        const chartData = {dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, elmTyp};
                        const tableData = {dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, elmTyp}
                        // const mapData = await this.buildMap(element, result, rowDimensions, columnDimensions, orgUnitId, 'eventChart');

                        this.dashboardItems.push({
                            chartData: chartData,
                            tableData: tableData,
                            mapData: [],
                            type: element.type,
                            renderedType: element.type,
                            displayName: element.eventChart.displayName

                        });
                    });
                }
            });

            // });
            //     this.dashboards = resultado.dashboards;
        });

        this.apiRequestsService.getOrgUnits().subscribe(resultado => {
            resultado.organisationUnits.forEach((item) => {
                this.orgUnits.push(item);
            });
        });
        // console.log(this.chartDataions);

    }
}

