import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import {forEach} from '@angular/router/src/utils/collection';
import * as L from 'leaflet';
import {ConnectionService} from '../Shared/connection.service';



// import {observableToBeFn} from 'rxjs/testing/TestScheduler';


@Injectable()
export class MapService {
    private dashboards: any[];
    private token: any;
    private headers: HttpHeaders;
    public getPeriods = [null];
    public legendSet = [];
    public getSelectedOrgUnits = [];


    constructor(
        public http: HttpClient,
        private connectionService: ConnectionService) {
        this.headers = new HttpHeaders({
            'Accept': 'application/json',
            'Authorization': `Basic ${btoa(`${this.connectionService.username}:${this.connectionService.password}`)}`
        });
    }

    criarGeoJson(item: any): Observable<any> {
        // console.log(item);
        let orgunits = ``;
        let levels = ``;
        item.organisationUnitLevels.forEach((el) => {
            levels = levels + `LEVEL-` + el + `;`;
            }
        );
        item.organisationUnits.forEach((el) => {
                orgunits = orgunits  + el.id + `;`;
            }
        );


        // return this.http.get(`${this.connectionService.apiURI}/api/organisationUnits.json?`
        // + `filter=id:in:[` + orgunits + `]&fields=:idName,coordinates,featureType`,

        // return this.http.get(`${this.connectionService.apiURI}/api/geoFeatures.json?ou=ou:${levels + orgunits}`,
        return this.http.get(`${this.connectionService.apiURI}/api/geoFeatures.json?ou=ou:${levels + orgunits}`,
            {headers: this.headers});

        // return this.http.get(`${this.connectionService.apiURI}/api/organisationUnits.geojson?parent=` + orgunits + `&`,
        //     // {headers: this.headers});
    }

    getMapviews(mapId: any): Observable<any> {
        // console.log("MApviews")

        return this.http.get(`${this.connectionService.apiURI}/api/maps/` + mapId + `.json?`
            + `fields=:idName,mapViews[:idName,columns,rows,layer,organisationUnitLevels,colorScale,classes,opacity,translations,dataDimensionItems`
            + `[indicator[:idName],dataElement[:idName],programIndicator[:idName],*],relativePeriods,periods,`
            + `legendSet[*,legends[*]],filters,organisationUnits[:idName]]`,
            {headers: this.headers});
    }

    getColor(d) {
        let cor = null;
            // console.log(this.legendSet)
            this.legendSet.forEach((legend) => {
                if (d >= legend.startValue || d <= legend.endValue) {
                    //
                     return legend.color;
                }
            });
    }

    createLegendSet (start, end, classes, colorScale) {
        colorScale = colorScale.split(',');
        const intervalo = (end - start) / classes;
        let target = 0;
        const legendSet = [];
        for (let index = 0; index < classes; index++) {
            target = start + intervalo;
            legendSet.push({
                startValue: start,
                endValue: target,
                color: colorScale[index]
            });
            start = start + intervalo;
        }
        return legendSet;
     }

    style(feature) {
        // console.log(this.getPeriods)
        const legendSet =[{startValue: 0, endValue: 1, color: '#FFEDA0'}];
        legendSet.push({startValue: 1, endValue: 100000000, color: '#fff'});
        this.getColor(2);
        // console.log(feature)
        const d = feature.properties.value;
        let cor = null;
        legendSet.forEach((legend) => {
            if (d >= legend.startValue && d <= legend.endValue) {

                cor = legend.color;
            }
        });
        // let d = '#FFEDA0';
        // console.log(legends)

        // let d = feature.properties.value;
        return {
            weight: 1,
            opacity: 1,
            color: 'black',
            dashArray: '',
            fillOpacity: 0.7,
            fillColor: cor
        };
    }

    // highlightFeature(e) {
    //     const layer = e.target;
    //
    //     layer.setStyle({
    //         weight: 0.1,
    //         color: '#006649',
    //         dashArray: '',
    //         fillOpacity: 0.7
    //     });
    //
    //     // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //     //     layer.bringToFront();
    //     // }
    // }

    resetHighlight(e) {
        L.geoJSON().resetStyle(e.target);
    }

    // zoomToFeature(e) {
    //     map.fitBounds(e.target.getBounds());
    // }

    onEachFeature(feature, layer) {
        layer.on('mouseover', function (ev) {
            layer.setStyle({
                weight: 4,
                color: 'black',
                dashArray: '',
                fillOpacity: 0.7
            }); // ev is an event object (MouseEvent in this case)
            // layer.bindPopup(feature.properties.popupContent);
            layer.bindTooltip(feature.properties.orgUnit + ` (${feature.properties.value})`).openTooltip();
        });
        layer.on('mouseout', function (ev) {
            layer.setStyle({
                weight: 1,
                color: 'black',
                dashArray: '',
                fillOpacity: 0.7
            });
        });
    }




    convertUnderscoreToCamelCase(string) {
        string = string.toLowerCase();
        return string.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }
    getApiUrl(): string {
        return this.connectionService.apiURI;
    }

    //end downloads materiais requests

}
