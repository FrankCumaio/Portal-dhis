import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppComponent } from './app.component';
import { MapService } from './Map/map.service';
import { ApiRequestsService} from './Shared/apiRequests.service';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavegacaoComponent } from './navegacao/navegacao.component';
import { LayoutModule } from '@angular/cdk/layout';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {ConnectionService} from './Shared/connection.service';
import { PivotTableComponent } from './pivot-table/pivot-table.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Angular Material Components
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material';
import { ReportComponent } from './report/report.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { DownloadsComponent } from './downloads/downloads.component';
import { MapComponent } from './Map/map.component';
import { ChartComponent } from './chart/chart.component';
// export function dahsboardServiceFactory(provider: DashboardService) {
//     return () => provider.load();
// }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
    { path: '', redirectTo: '/reports', pathMatch: 'full' },
    { path: 'reports', component: ReportComponent },
    { path: 'about',      component: AboutComponent },
    { path: 'downloads',      component: DownloadsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavegacaoComponent,
    PivotTableComponent,
    ReportComponent,
    AboutComponent,
    DownloadsComponent,
    MapComponent,
    ChartComponent,
  ],
  imports: [
      NgbModule,
    BrowserModule,
      BrowserModule,
      BrowserAnimationsModule,
      MatCardModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatExpansionModule,
      HighchartsChartModule,
      HttpClientModule,
      BrowserAnimationsModule,
      MatButtonToggleModule,
      LayoutModule,
      LeafletModule.forRoot(),
      TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
          }
      }),
      RouterModule.forRoot(
          appRoutes,
          { enableTracing: true } // <-- debugging purposes only
      ),
  ],
  providers: [
      ApiRequestsService,
      ConnectionService,
      MapService,
      // { provide: APP_INITIALIZER, useFactory: dahsboardServiceFactory, deps: [DashboardService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


