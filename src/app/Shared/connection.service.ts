import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

      apiURI = 'https://play.dhis2.org/dev';
    username = 'admin';
      password = 'district'

    // apiURI = 'https://moz.dhis2.org/dhis';
    // username = 'fcumaio';
    // password = 'Saudigitus2018!';

    // apiURI = 'https://tland.hispmoz.org/dhis';
    // username = 'cdjedje';
    // password = 'Maputo2018!';

    // apiURI = 'http://venus.dhis2.org/dhis';
    // username = 'amuchanga';
    // password = 'Maputo2017!';

    // apiURI = 'https://dhis2.saudigitus.org/dhis';
    // username = 'dashboardApp';
    // password = '!DontTryToTypeItsV3ryS7rong!';


    // downloads material config
    optionSetId = 'j41t6IbwIvt';

    constructor() {
    }

    getApiURI(): string {
        return this.apiURI;
    }

    getUsername(): string {
        return this.username;
    }

    getPassword(): string {
        return this.password;
    }

    getApiHost() {
        // return this.apiURI.replace('','');
    }

    getOptionSetId(): String {
        return this.optionSetId;
    }
}
