///<reference path="../../node_modules/@types/node/index.d.ts"/>
import { Component, OnInit, Inject, ElementRef, AfterViewInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';
import { ApiRequestsService } from './Shared/apiRequests.service';
import * as L from 'leaflet';
import {MapService} from './Map/map.service';
import {DashboardService} from './Shared/dashboard.service';
import 'pivottable/dist/pivot.js';
import 'pivottable/dist/pivot.min.css';
import jQuery from 'jquery';
import {TranslateService} from "@ngx-translate/core";

declare var $: any;

HC_map( Highcharts);
HC_exporting( Highcharts);

// require('../../js/world')(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    public isCollapsed = true;
    showFiller = false;
    languages = [

        // WAHO
        // { code: 'en', label: 'English'},
        // { code: 'fr', label: 'Français'}
        // { code: 'pt', label: 'Português'},

        { code: 'pt', label: 'Português'},
        { code: 'en', label: 'English'},
        { code: 'fr', label: 'Français'}
    ];
    public currentLang = 'Português';
    public currentLocale = 'pt';
    public color = 'primary';
    public mode = 'indeterminate';
    public waiting = false;

    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'fr', 'pt']);
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('pt');

        const browserLang = translate.getBrowserLang();
        this.languages.forEach(lang => {
            if (browserLang === lang.code) {
                this.currentLang = lang.label;
            }
        });

        // WAHO
        // translate.use(browserLang.match(/en|fr|pt/) ? browserLang : 'pt');

        // MISAU
        // translate.use('pt');
        this.changeLang(this.languages[0]);
    }

    changeLang(language) {
        this.waiting = true;

        this.currentLang = language.label;
        this.currentLocale = language.code;

        this.translate.use(language.code);

        setTimeout(function() {
            this.waiting = false;
            console.log(this.waiting);
        }.bind(this), 1500);

        this.isCollapsed = !this.isCollapsed;
    }
}
