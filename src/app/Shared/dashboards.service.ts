import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable} from 'rxjs/Observable';
import { ConfigService } from '../utils/config.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
// import { AsyncLocalStorage } from 'angular-async-local-storage';
// import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';


@Injectable()
export class DashboardsService {
    private dashboards: any[];
    private token: any;
    private headers: HttpHeaders;
    public getPeriods = [];
    public getSelectedOrgUnits = [];
    constructor(
        public http: HttpClient,
        private configService: ConfigService) {
        this.headers = new HttpHeaders({
            'Accept': 'application/json',
            'Authorization': `Basic ${btoa(`${this.configService.username}:${this.configService.password}`)}`
        });
    }


    getDashboards(): Observable <any> {
        // console.log('olaaaa');
        // console.log(this.configService.getApiURI);
        return this.http.get(`${this.configService.apiURI}/api/dashboards.json?fields=:`
            + `idName,translations,dashboardItems[:idName,type,id,`
            + `reportTable[:idName,dataDimensionItems,relativePeriods,organisationUnits,periods],`
            + `eventChart[:idName,dataElementDimensions,relativePeriods,organisationUnits,periods,program,programStage,series,category],`
            +  `eventReport[:idName,dataElementDimensions,relativePeriods,organisationUnits,periods,program,programStage,series,category,filters,columns],`
            + `chart[:idName,translations,dataDimensionItems[indicator[:idName],dataElement[:idName],*],relativePeriods,type,periods,series,category,filterDimensions,organisationUnits[:idName]]`
            + `map[:idName, translations,latitude,longitude,zoom]`,
            { headers: this.headers });

    }


    getDataDimensionName(id, type)  {
        // console.log(type);
        this.http.get(`${this.configService.apiURI}/api/` + type + `s/` + id + `.json?fields=:`
            + `idName`,
            { headers: this.headers }).subscribe((result:any) => {
            return result.displayName;

        });
    }
    // orderRelativePeriodsASC(periods: any[]) {
    //   const list = [];
    //   periods.forEach((el) => {
    //     if (el.)
    //   })
    // }
    // getMap(token: any, Mapid: number): Observable<any> {
    //     console.log('olaaa2a');
    //
    //     return this.http.get(`${this.configService.apiURI}/api/maps/${Mapid}/data`,
    //         {headers: this.headers, responseType: ResponseContentType.Blob}).map((res: Response) => res.blob());
    // }


    prepareForRequest(dashboardItem) {
// console.log(dashboardItem);
        const dataDimensions = [];
        const mapData = [];
        const periods = [];
        const orgUnits = [];
        const filtersOptions = [];
        let series = null;
        let category = null;
        let program = null;
        let programStage = null;

        const type = this.convertUnderscoreToCamelCase(dashboardItem.type);
        if (dashboardItem[type]) {
            if (dashboardItem[type].hasOwnProperty('dataDimensionItems')) {
                dashboardItem[type].dataDimensionItems.forEach((item) => {
                    // console.log(item);
                    const dimensionType = this.convertUnderscoreToCamelCase(item.dataDimensionItemType);
                    dataDimensions.push({'type': dimensionType, 'id': item[dimensionType]['id'], 'name': item[dimensionType]['displayName']});
                });
            } else if (dashboardItem[type].hasOwnProperty('dataElementDimensions')) {
                dashboardItem[type].dataElementDimensions.forEach((item) => {
                    // console.log(item);
                    dataDimensions.push({'type': 'dataElement', 'id': item.dataElement.id, 'name': item.dataElement.displayName});
                });
            } else if (dashboardItem[type].hasOwnProperty('mapViews')) {
                // console.log(dashboardItem.map)
                mapData.push({'lat': dashboardItem.map.latitude, 'long': dashboardItem.map.longitude, 'zoom': dashboardItem.map.zoom});
                dashboardItem[type].mapViews.forEach((item) => {
                    item.dataDimensionItems.forEach((dtDm) => {
                        const dimensionType = this.convertUnderscoreToCamelCase(dtDm.dataDimensionItemType);
                        dataDimensions.push({'type': dimensionType, 'id': dtDm[dimensionType]['id']});
                    });
                });
            }

            if (dashboardItem[type].hasOwnProperty('program')) {
                program = dashboardItem[type].program.id;
            }
            // Selecionamos os filtros para a requisicao
            if (dashboardItem[type].hasOwnProperty('filterDimensions')) {
                dashboardItem[type].filterDimensions.forEach((item) => {
                    filtersOptions.push(item);
                });
            }

            if (dashboardItem[type].hasOwnProperty('series')) {
                series = dashboardItem[type].series;
            }

            if (dashboardItem[type].hasOwnProperty('category')) {
                category = dashboardItem[type].category;
            }
            if (dashboardItem[type].hasOwnProperty('programStage')) {
                programStage = dashboardItem[type].programStage.id;
            }


            // if (!(this.getPeriods === undefined) && !(this.getPeriods.length === 0)) {
            //     // caso se selecione periodo no filtro
            //     this.getPeriods.map(period => periods.push(period));
            // }else {

            if (dashboardItem[type].hasOwnProperty('relativePeriods')) {
                // console.log(dashboardItem[type].relativePeriods)
                const periodKeys = Object.keys(dashboardItem[type].relativePeriods);
                periodKeys.forEach((period) => {
                    if (dashboardItem[type].relativePeriods[period]) {
                        periods.push(this.convertCamelCaseToUnderscore(period));
                        // console.log(dashboardItem[type].relativePeriods);
                    }});
            }

            if (dashboardItem[type].hasOwnProperty('periods')) {
                dashboardItem[type].periods.forEach((period) => {
                    periods.push(period.id);
                    // console.log(dashboardItem[type].periods);

                    // console.log(type);
                });
            }
            // }
            //   if (!(this.getSelectedOrgUnits === undefined) && !(this.getSelectedOrgUnits.length === 0)) {
            //       // caso se selecione a unidade organizacional no filtro
            //       this.getSelectedOrgUnits.map(orgUnit => orgUnits.push(orgUnit));
            //   }else {
            if (dashboardItem[type].hasOwnProperty('organisationUnits')) {
                dashboardItem[type].organisationUnits.forEach((item) => {
                    orgUnits.push(item.id);
                });
            }
            //   }

        }

        return {
            dataDimensions: dataDimensions,
            mapData: mapData,
            periods: periods,
            orgUnits: orgUnits,
            program: program,
            programStage: programStage,
            filtersOptions: filtersOptions,
            series: series,
            category: category,
        };

    }

    // Colocar no Map component
    criarGeoJson(item: any) {
        // console.log(item.rows[0][2]);
        const orgunits = [];
        item.rows.forEach((el) => {
                orgunits.push(el[2]);
            });
        return this.http.get(`${this.configService.apiURI}/api/organisationUnits.json?`
        + `filter=id:in:[` + orgunits + `]&fields=:idName,coordinates,featureType`,
            {headers: this.headers});
    }
    getMapviews(mapId: any): Observable<any> {
        return this.http.get(`${this.configService.apiURI}/api/maps/` + mapId + `.json?`
        + `fields=:idName,mapViews[:idName,layer,colorScale,classes,opacity,dataDimensionItems,relativePeriods,periods]`,
            {headers: this.headers});
    }
    getItemData(options: any): Observable<any> {
        // console.log(options);
     let url = null, series = null;

        // verificamos e definimos os filtros do item para formar a requisição
        options.filtersOptions.forEach((filter, index) => {
            // console.log(options.orgUnits)
            if (options.series === 'dx' && options.category === 'ou' && filter === 'pe' ) {
                url = `?dimension=dx:${options.dataDimensions.map((el) => el.id).join(';')}`
                    + `&dimension=ou:${options.orgUnits.map((el) => el).join(';')}`
                    + `&filter=pe:${options.periods.map((el) => el).join(';')}`;
            }

            if (options.series === 'pe' && options.category === 'ou' && filter === 'dx' ) {
                url = `?dimension=ou:${options.orgUnits.map((el) => el).join(';')}`
                    + `&dimension=pe:${options.periods.map((el) => el).join(';')}`
                    + `&filter=dx:${options.dataDimensions.map((el) => el.id).join(';')}`;
            }

            if (options.series === 'dx' && options.category === 'pe' && filter === 'ou' ) {
                url = `?dimension=dx:${options.dataDimensions.map((el) => el.id).join(';')}`
                    + `&dimension=pe:${options.periods.map((el) => el).join(';')}`
                    + `&filter=ou:${options.orgUnits.map((el) => el).join(';')}`;
            }

            if (options.series === 'ou' && options.category === 'dx' && filter === 'pe' ) {
                url = `?dimension=ou:${options.orgUnits.map((el) => el).join(';')}`
                    + `&dimension=dx:${options.dataDimensions.map((el) => el.id).join(';')}`
                    + `&filter=pe:${options.periods.map((el) => el).join(';')}`;
            }
        });



        // if (options.program) {
        //     // TODO eventReport está sempre associado a um programa?
        //     // A sequencia importa 1.ou, 2.pe, 3.program
        //     // Se for um tracker
        //     return this.http.get(`${this.configService.apiURI}/api/analytics/events/aggregate/${options.program}.json`
        //         + `${options.orgUnits.length > 0 ? `?dimension=ou:${options.orgUnits.map((el) => el).join(';')}` : ``}`
        //         + `&dimension=pe:${options.periods.map((el) => el).join(';')}`
        //         + `&dimension=dx${options.dataDimensions.map((el) => el.id).join(';')}`
        //         + `&stage=${options.programStage}`
        //         + `&displayProperty=NAME&outputType=EVENT`,
        //         { headers: this.headers });
        // } else

        // console.log(options.periods);
        // LAST_5_YEARS
        if (options.mapData.length > 0) {
            // Se for um mapa
            return this.http.get(`${this.configService.apiURI}/api/analytics.json`
                + `?dimension=dx:${options.dataDimensions.map((el) => el.id).join(';')}`
                + `&dimension=pe:${options.periods.map((el) => el).join(';')}`
                + `${options.orgUnits.length > 0 ? `&dimension=ou:${options.orgUnits.map((el) => el).join(';')}` : ``}`,
                {headers: this.headers}).map((response: Response) => response.json());
        } else {
            // Resto dos items

            return this.http.get(`${this.configService.apiURI}/api/analytics.json`
                + url,
                {headers: this.headers});
        }
    }

    convertCamelCaseToUnderscore(string) {

        switch (string) {
            case 'last6Months': return 'LAST_6_MONTHS';
            case 'last4Weeks': return 'LAST_4_WEEKS';
            case 'last4Quarters': return 'LAST_4_QUARTERS';
            default: return string.replace(/([a-z0-9])([A-Z0-9])/g, '$1_$2').toUpperCase();
        }

    }

    convertUnderscoreToCamelCase(string) {
        string = string.toLowerCase();
        return string.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }

    titleCase(str) {
        str = str.toLowerCase().split('_');
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join('');
    }

    // storeData(key: string, items) {
    //     this.localSt.store(key, items);
    // }
    //
    // clearData() {
    //     this.localSt.clear();
    // }
    //
    // retrieveValue(key) {
    //     return this.localSt.retrieve(key);
    // }


    // downloads materiais requests
    getAllDocuments() {
        return this.http.get(
            this.configService.apiURI + '/api/documents.json?fields=[:idName,url,contentType,attributeValues]',
            { headers: this.headers });
    }

    // getDocumentContent(documentId) {
    //     return this.http.get(
    //         this.configService.apiURI + '/api/documents/' + documentId + '/data',
    //         { headers: this.headers, responseType: ResponseContentType.Blob })
    //         .map(res => res.blob());
    // }

    getAllCategorias() {
        return this.http.get(
            this.configService.apiURI + '/api/optionSets/' + this.configService.optionSetId + '.json?fields=options[name,code]',
            { headers: this.headers })
    }

    getApiUrl(): string {
        return this.configService.apiURI;
    }

    //end downloads materiais requests

}
