import { Component, OnInit, Inject, ElementRef, AfterViewInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';
import { ApiRequestsService } from '../Shared/apiRequests.service';
import * as L from 'leaflet';
import {MapService} from '../Map/map.service';
import {DashboardService} from '../Shared/dashboard.service';
import {AppComponent} from '../app.component';
import 'pivottable/dist/pivot.js';
import 'pivottable/dist/pivot.min.css';
import * as $ from 'jquery';



HC_map( Highcharts);
HC_exporting( Highcharts);
NoDataToDisplay(Highcharts);

// require('../../js/world')(Highcharts);

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    private title: string;
    public chartOptions: any = []; chartMap = [];
    public Highcharts = Highcharts;
    public dashboards: any;
    public selectedDashboard: any;
    public selectedOrgUnit: any;
    private series = [];
    public MapGeoJson;
    public idDiv = 1;
    public waiting;
    public color = 'primary';
    public mode = 'indeterminate';
    public  orgUnits = [];
    public  periods = [];

    constructor(
        public dashboardService: DashboardService,
        private appComponent: AppComponent,
                @Inject(ElementRef)el: ElementRef) {
    }

    ngOnInit() {
        Highcharts.setOptions({
            colors: ['rgb(169, 190, 59)', 'rgb(85, 140, 192)', 'rgb(85, 140, 192)', 'rgb(255, 159, 58)',
                'rgb(150, 143, 143)', 'rgb(183, 64, 159);', 'rgb(255, 218, 100)', 'rgb(79, 189, 174)',
                'rgb(183, 128, 64)'],
            lang: {noData: "Sem dados por mostrar"}
        });

        console.log('AppComponent: OnInit()');
        this.getData(0);
    }
    public getRelatorioValueByLocale(dashboard: any) {
        for (const translation of dashboard.translations) {
            if ( translation.locale === this.appComponent.currentLocale) return translation.value;
        }
        console.log('tentou traduzir');
        return dashboard.displayName;
    }
    getData(dashboardIndex) {
        this.waiting = true;
        this.chartOptions = this.dashboardService.getDashboardItems(dashboardIndex, null, null);
        this.dashboards = this.dashboardService.getDashboards();
        this.orgUnits = this.dashboardService.getOrgUnits();
        this.selectedDashboard = this.dashboardService.getSelectedDashboard();
        this.selectedOrgUnit = this.dashboardService.getSelectedOrgUnit();
        this.waiting = this.dashboardService.waiting;
            }

    changeDashboard (dashboardIndex) {
        this.chartOptions = this.dashboardService.getDashboardItems(dashboardIndex, null, null);
        this.selectedDashboard = this.dashboardService.getSelectedDashboard();
        this.orgUnits = this.dashboardService.getOrgUnits();

    }
    changeOrgUnit(orgUnitID) {
        console.log(orgUnitID);
        this.chartOptions = this.dashboardService.getDashboardItems(null, orgUnitID, null);
        this.selectedDashboard = this.dashboardService.getSelectedDashboard();
    }
    onMapReady(map: L.Map) {
        map.fitBounds(this.dashboardService.MapGeoJson.getBounds(), {

        });
    }

    changeReportType(i: number, type: string, chartType?) {
        if (type === 'CHART') {
            this.chartOptions[i].chartType = chartType;
            this.chartOptions[i].renderedType = type;
            // if (!$(`#chart-container${i}`).hasClass('maximizar') && $(`#rep${i}`).hasClass('fullscreen-div')) {
            //     $(`#chart-container${i}`).toggleClass('maximizar');
            $(`#rep${i}`).focus();
            // }
        } else if (type === 'REPORT_TABLE') {
            // if (!$(`#chart-container${i}`).hasClass('maximizar') && $(`#rep${i}`).hasClass('fullscreen-div')) {
            //     $(`#chart-container${i}`).toggleClass('maximizar');
            // this.chartOptions[i] = this.dashboardService
            $(`#rep${i}`).focus();
            // }
            this.chartOptions[i].renderedType = type;
            this.chartOptions[i].chartType = 'bar';
        } else if (type === 'MAP') {
            this.chartOptions[i].renderedType = type;
            // console.log(type)
            // L.map('map' + i)
            //  this.onMapReady(L.map('map' + i));
        }
        // this.selectedType = type;
        $(`#rep${i}`).focus();
    }


}
