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
    public getPeriods = [];
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
        console.log(item.metaData.dimensions.ou);
        const orgunits = item.metaData.dimensions.ou;
        // item.rows.forEach((el) => {
        //         orgunits.push(el[2])
        //     }
        // );
        console.log(orgunits);
        return this.http.get(`${this.connectionService.apiURI}/api/organisationUnits.json?
        filter=id:in:[` + orgunits + `]&fields=:idName,coordinates,featureType`,
            {headers: this.headers});
    }

    getColor(d) {
        return d > 5000 ? '#800026' :
            d > 500 ? '#BD0026' :
                d > 200 ? '#E31A1C' :
                    d > 100 ? '#FC4E2A' :
                        d > 50 ? '#FD8D3C' :
                            d > 20 ? '#FEB24C' :
                                d > 10 ? '#FED976' :
                                    '#FFEDA0';
    }

    style(feature) {
        // console.log(feature.properties.value)
        const d = feature.properties.value;
        // let d = '#FFEDA0';
        // let d = feature.properties.value;
        const cor =  d > 5000 ? '#800026' :
            d > 4000 ? '#BD0026' :
                d > 3000 ? '#E31A1C' :
                    d > 2000 ? '#FC4E2A' :
                        d > 1000 ? '#FD8D3C' :
                            d > 500 ? '#FEB24C' :
                                d > 10 ? '#FED976' :
                                    '#FFEDA0';
        ;
        return {
            weight: 1,
            opacity: 1,
            color: 'black',
            dashArray: '',
            fillOpacity: 0.7,
            fillColor: cor
        }
    }

    highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 2,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        //     layer.bringToFront();
        // }
    }

    resetHighlight(e) {
        L.geoJSON().resetStyle(e.target);
    }

    // zoomToFeature(e) {
    //     map.fitBounds(e.target.getBounds());
    // }

    onEachFeature(feature, layer) {
        layer.bindPopup(layer.feature.properties.value);
        layer.on('mouseover', function (ev) {
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            }); // ev is an event object (MouseEvent in this case)
            layer.bindPopup(feature.properties.popupContent);
        });
        layer.on('mouseout', function (ev) {
            // this.style(feature);

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
