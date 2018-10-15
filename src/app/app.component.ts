///<reference path="../../node_modules/@types/node/index.d.ts"/>
import { Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';
import { ApiRequestsService } from './Shared/apiRequests.service';
import * as L from 'leaflet';
import {MapService} from './Map/map.service';
import {DashboardService} from './Shared/dashboard.service';

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
    public MapGeoJson;
    public idDiv = 1;
    public reportList = Array<{
        chartOptions: any[],
        mapOptions: any[],
        dashboardID: number
    }>();
    private Mapseries = Array<{ value: number, code: string}>();
    private  OrgUnits = [];

    constructor(public dashboardService: DashboardService) {
        this.chartOptions = dashboardService.getDashboards();
    }

    ngOnInit() {
        Highcharts.setOptions({
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
        });
        console.log("AppComponent: OnInit()");
    }

    onMapReady(map: L.Map) {
        setTimeout(() => {
            map.invalidateSize();
            let div = L.DomUtil.create('div', 'infoControl');
            let info = new L.Control();

            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                // this.update();
                return this._div;
            };

            // info.update = function (props) {
            //     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
            //         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            //         : 'Hover over a state');
            // };
            console.log(div);
            info.addTo(map);
            console.log(map);
        }, 10000);
    }
}
