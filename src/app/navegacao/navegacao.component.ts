import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {TranslateService} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navegacao',
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.css']
})
export class NavegacaoComponent {
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

        this.isCollapsed = !this.isCollapsed
    }
  }
