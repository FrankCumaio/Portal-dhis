import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import index from "@angular/cli/lib/cli";
import {ConnectionService} from './connection.service';
// import { AsyncLocalStorage } from 'angular-async-local-storage';
// import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';


@Injectable()
export class ApiRequestsService {
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


    getDashboards(): Observable <any> {
        // ('olaaaa');
        // (this.connectionService.getApiURI);
        return this.http.get(`${this.connectionService.apiURI}/api/dashboards.json?filter=id:in:[jYWdRK9QeRn,lkzxeJPSMMl,Oz9GPjCa0fu]&fields=:`
        // return this.http.get(`${this.connectionService.apiURI}/api/dashboards.json?fields=:`
            + `idName,translations,dashboardItems[:idName,type,id,`
            + `reportTable[:idName,dataDimensionItems[indicator[:idName],dataElement[:idName],programIndicator[:idName],*],organisationUnits[:idName],*],`
            + `eventChart[:all],`
            +  `eventReport[:all],`
            + `chart[:idName,dataDimensionItems[indicator[:idName],dataElement[:idName],programIndicator[:idName],*],organisationUnits[:idName],*]`
            + `map[:idName, translations,latitude,longitude,zoom]`,
            { headers: this.headers });

    }


    getDataDimensionName(id, type)  {
        // (type);
        this.http.get(`${this.connectionService.apiURI}/api/` + type + `s/` + id + `.json?fields=:`
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
    //     ('olaaa2a');
    //
    //     return this.http.get(`${this.connectionService.apiURI}/api/maps/${Mapid}/data`,
    //         {headers: this.headers, responseType: ResponseContentType.Blob}).map((res: Response) => res.blob());
    // }


    prepareForRequest(dashboardItem) {
//        Esta funcao transforma os dados brutos para que sejam eviadas requisicoes  ao analytics
(dashboardItem);
        const dataDimensions = [];
        const periods = [];
        const orgUnits = [];
        const organisationUnitLevels = [];
        let type = ' ';
        let filters = [];
        let rows = [];
        let columns = [];
        let program = null;
        let programStage = null;
if (dashboardItem.type) {
    // Preparamos outros elementos diferentes de Mapas
    type = this.convertUnderscoreToCamelCase(dashboardItem.type);
}
// (dashboardItem[type]);

        if (dashboardItem[type]) {
        if (dashboardItem[type].hasOwnProperty('dataDimensionItems')) {
            dashboardItem[type].dataDimensionItems.forEach((item) => {
                // (item);
                const dimensionType = this.convertUnderscoreToCamelCase(item.dataDimensionItemType);
                let dimensionTypeId;
                if (item.dataDimensionItemType === 'REPORTING_RATE') {
                    dimensionTypeId = item[dimensionType]['id'] + '.REPORTING_RATE';
                } else {
                    dimensionTypeId = item[dimensionType]['id'];
                }
                dataDimensions.push({
                    'type': dimensionType,
                    'id': dimensionTypeId,
                    'name': item[dimensionType]['displayName']
                });
            });
        }
        if (dashboardItem[type].hasOwnProperty('dataElementDimensions')) {
            dashboardItem[type].dataElementDimensions.forEach((item) => {
                // (item);
                dataDimensions.push({
                    'type': 'dataElement',
                    'id': item.dataElement.id,
                    'name': item.dataElement.displayName
                });
            });
        }

        if (dashboardItem[type].hasOwnProperty('program')) {
            program = dashboardItem[type].program.id;
        }
        // Selecionamos os filtros para a requisicao
        // if (dashboardItem[type].hasOwnProperty('filterDimensions')) {
        //     dashboardItem[type].filterDimensions.forEach((item) => {
        //         filtersOptions.push(item);
        //     });
        // }
        //
        // if (dashboardItem[type].hasOwnProperty('series')) {
        //     series = dashboardItem[type].series;
        // }
        //
        // if (dashboardItem[type].hasOwnProperty('category')) {
        //     category = dashboardItem[type].category;
        // }

        if (dashboardItem[type].hasOwnProperty('programStage')) {
            programStage = dashboardItem[type].programStage.id;
        }

            if (dashboardItem[type].hasOwnProperty('columnDimensions')) {
                columns = dashboardItem[type].columnDimensions;
            }

            if (dashboardItem[type].hasOwnProperty('series')) {
                columns.push(dashboardItem[type].series);
            }

            if (dashboardItem[type].hasOwnProperty('rowDimensions')) {
                rows = dashboardItem[type].rowDimensions;
            }

            if (dashboardItem[type].hasOwnProperty('category')) {
                rows.push(dashboardItem[type].category);
            }

            if (dashboardItem[type].hasOwnProperty('filterDimensions')) {
                filters = dashboardItem[type].filterDimensions;
            }

            // if (dashboardItem[type].hasOwnProperty('filters')) {
            //     filters = dashboardItem[type].filters;
            // }


        // if (!(this.getPeriods === undefined) && !(this.getPeriods.length === 0)) {
        //     // caso se selecione periodo no filtro
        //     this.getPeriods.map(period => periods.push(period));
        // }else {

        if (dashboardItem[type].hasOwnProperty('relativePeriods')) {

            const periodKeys = Object.keys(dashboardItem[type].relativePeriods);
            periodKeys.forEach((period) => {
                if (dashboardItem[type].relativePeriods[period] === true) {
                    periods.push(this.convertCamelCaseToUnderscore(period));
                    (periods);
                }
            });
        }

        if (dashboardItem[type].hasOwnProperty('periods')) {
            dashboardItem[type].periods.forEach((period) => {
                periods.push(period.id);
                // (dashboardItem[type].periods);

                // (type);
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

            if (dashboardItem[type].userOrganisationUnit === true) {
                orgUnits.push('USER_ORGUNIT');
            }

            if (dashboardItem[type].userOrganisationUnitChildren === true) {
                orgUnits.push('USER_ORGUNIT_CHILDREN');
            }

        if (dashboardItem[type].hasOwnProperty('organisationUnitLevels')) {
            dashboardItem[type].organisationUnitLevels.forEach((item) => {
                organisationUnitLevels.push('LEVEL-' + item);
            });
        }
        // (organisationUnitLevels)
        //   }

    }

        return {
            dx: dataDimensions,
            pe: periods,
            ou: orgUnits,
            organisationUnitLevels: organisationUnitLevels,
            program: program,
            programStage: programStage,
            filters: filters,
            rows: rows,
            columns: columns,
            type: type,
        };

    }

    // Colocar no Map component
    criarGeoJson(item: any) {
        // (item);
        const orgunits = [];
        item.rows.forEach((el) => {
                orgunits.push(el[2]);
            });
        return this.http.get(`${this.connectionService.apiURI}/api/organisationUnits.json?`
        + `filter=id:in:[` + orgunits + `]&fields=:idName,coordinates,featureType`,
            {headers: this.headers});
    }

    getItemData(options: any): Observable<any> {
     let url = null, urlLevls = ``, urlCategories = ``, urlDimensions = ``,wichCategory = null;


     if (options.organisationUnitLevels.length > 0) {
         urlLevls = options.organisationUnitLevels.map((el) => el).join(';');
     }
     // (options)
        // verificamos e definimos os filtros do item para formar a requisição

        // formamos as dimensoes para a url


        // formamos as categorias para a url

        options.columns.forEach((column) => {
            if (column === 'ou' && options[column].length > 0) {
                urlDimensions = urlDimensions + `dimension=${column}:${urlLevls};${options[column].map((el) => el).join(';')}&`;
            }
            if (column === 'pe' && options[column].length > 0) {
                urlDimensions = urlDimensions + `dimension=${column}:${options[column].map((el) => el).join(';')}&`;
            }
            if (column === 'dx' && options[column].length > 0) {
                urlDimensions = urlDimensions + `dimension=${column}:${options[column].map((el) => el.id).join(';')}&`;
            }
        });

        options.rows.forEach((row) => {
            if (row === 'ou' && options[row].length > 0) {
                urlDimensions = urlDimensions + `dimension=${row}:${urlLevls};${options[row].map((el) => el).join(';')}&`;
            }
            if ( row === 'pe' && options[row].length > 0) {
                urlDimensions = urlDimensions + `dimension=${row}:${options[row].map((el) => el).join(';')}&`;
            }
            if (row === 'dx' && options[row].length > 0) {
                urlDimensions = urlDimensions + `dimension=${row}:${options[row].map((el) => el.id).join(';')}&`;
            }
        });

        options.filters.forEach((fltr) => {
            if (fltr === 'ou' && options[fltr].length > 0) {
                urlDimensions = urlDimensions + `dimension=${fltr}:${urlLevls};${options[fltr].map((el) => el).join(';')}&`;
            }
            if (fltr === 'pe' && options[fltr].length > 0) {
                urlDimensions = urlDimensions + `&filter=${fltr}:${options[fltr].map((el) => el).join(';')}&`;
            }
            if (fltr === 'dx' && options[fltr].length > 0) {
                urlDimensions = urlDimensions + `&filter=${fltr}:${options[fltr].map((el) => el.id).join(';')}&`;
            }
        });

     // if (options.type === 'reportTable') {
     //     options.columns.forEach((column) => {
     //     })
     // } else if (options.type === 'chart') {
     //    //
     //    if (options.series === 'ou' && options.orgUnits.length > 0) {
     //        urlDimensions = urlDimensions + `dimension=ou:${options.orgUnits.map((el) => el).join(';')}${urlLevls}&`;
     //    }  if (options.series === 'pe' && options.periods.length > 0) {
     //        urlDimensions = urlDimensions + `dimension=pe:${options.periods.map((el) => el).join(';')}&`;
     //    }  if (options.series === 'dx' && options.dataDimensions.length > 0) {
     //        urlDimensions = urlDimensions + `dimension=dx:${options.dataDimensions.map((el) => el.id).join(';')}${urlLevls}&`;
     //    }
     //
     //    if (options.category === 'ou' && options.orgUnits.length > 0) {
     //        urlDimensions = urlDimensions + `dimension=ou:${options.orgUnits.map((el) => el).join(';') }${urlLevls}&`;
     //    }  if (options.category === 'pe' && options.periods.length > 0) {
     //        urlDimensions = urlDimensions + `dimension=pe:${options.periods.map((el) => el).join(';')}&`;
     //    }  if (options.category === 'dx' && options.dataDimensions.length > 0 ) {
     //        urlDimensions = urlDimensions + `dimension=dx:${options.dataDimensions.map((el) => el.id).join(';')}&`;
     //    }
     //
     //    options.filters.forEach((fltr) => {
     //        // (fltr)
     //        urlDimensions = urlDimensions + `&filter=${fltr}:${options[fltr].map((el) => el).join(';')}${urlLevls}`;
     //        // if (fltr === 'dx' && options.dataDimensions.length > 0) {
     //        //     urlDimensions = urlDimensions + `&filter=dx:${options.dataDimensions.map((el) => el.id).join(';')}`;
     //        // }
     //        //
     //        // if (fltr === 'pe' && options.periods.length > 0) {
     //        //     urlDimensions = urlDimensions + `&filter=pe:${options.periods.map((el) => el).join(';')}`;
     //        // }
     //        // if (fltr === 'ou' && options.orgUnits.length > 0) {
     //        //     urlDimensions = urlDimensions + `&filter=ou:${options.orgUnits.map((el) => el).join(';')}${urlLevls}`;
     //        // }
     //    });
     // } else
         if (options.type === 'map') {
            (options);
            if (options.ou.length > 0) {
                urlDimensions = urlDimensions + `dimension=ou:${urlLevls};${options.ou.map((el) => el).join(';') }&`;
            }
             if (options.dx.length > 0) {
                 urlDimensions = urlDimensions + `dimension=dx:${options.dx.map((el) => el.id).join(';')}&`;
             }
             if (options.pe.length > 0) {
                urlDimensions = urlDimensions + `&filter=pe:${options.pe.map((el) => el).join(';')}`;
             }
            // urlDimensions = urlDimensions + `dimension=ou:${urlLevls};${options.ou.map((el) => el).join(';') }&`
            // + `dimension=dx:${options.dx.map((el) => el.id).join(';')}&`
            // + `&filter=pe:${options.pe.map((el) => el).join(';')}`
            // dimension=ou:LEVEL-3;s5DPBsdoE8b&dimension=dx:sVkTp5609pT&filter=pe:THIS_YEAR&displayProperty=NAME
        }

        // (options);

        // if (options.program) {
        //     // TODO eventReport está sempre associado a um programa?
        //     // A sequencia importa 1.ou, 2.pe, 3.program
        //     // Se for um tracker
        //     return this.http.get(`${this.connectionService.apiURI}/api/analytics/events/aggregate/${options.program}.json`
        //         + `${options.orgUnits.length > 0 ? `?dimension=ou:${options.orgUnits.map((el) => el).join(';')}` : ``}`
        //         + `&dimension=pe:${options.periods.map((el) => el).join(';')}`
        //         + `&dimension=dx${options.dataDimensions.map((el) => el.id).join(';')}`
        //         + `&stage=${options.programStage}`
        //         + `&displayProperty=NAME&outputType=EVENT`,
        //         { headers: this.headers });
        // } else

        // (options.periods);
        // LAST_5_YEARS
            // Resto dos items

            return this.http.get(`${this.connectionService.apiURI}/api/analytics.json?`
                + urlDimensions,
                {headers: this.headers});
    }

    convertCamelCaseToUnderscore(string) {

        switch (string) {
            case 'last3Months': return 'LAST_6_MONTHS';
            case 'last6Months': return 'LAST_6_MONTHS';
            case 'last12Months': return 'LAST_12_MONTHS';
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
            this.connectionService.apiURI + '/api/documents.json?fields=[:idName,url,contentType,attributeValues]',
            { headers: this.headers });
    }

    // getDocumentContent(documentId) {
    //     return this.http.get(
    //         this.connectionService.apiURI + '/api/documents/' + documentId + '/data',
    //         { headers: this.headers, responseType: ResponseContentType.Blob })
    //         .map(res => res.blob());
    // }

    getAllCategorias() {
        return this.http.get(
            this.connectionService.apiURI + '/api/optionSets/' + this.connectionService.optionSetId + '.json?fields=options[name,code]',
            { headers: this.headers });
    }

    getApiUrl(): string {
        return this.connectionService.apiURI;
    }

    //end downloads materiais requests

}
