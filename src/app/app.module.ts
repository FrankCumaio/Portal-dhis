import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppComponent } from './app.component';
import { MapService } from './Map/map.service';
import { ApiRequestsService} from './Shared/apiRequests.service';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavegacaoComponent } from './navegacao/navegacao.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatCardModule, MatGridListModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {ConnectionService} from './Shared/connection.service';
import {DashboardService} from "./Shared/dashboard.service";

export function dahsboardServiceFactory(provider: DashboardService) {
    return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavegacaoComponent,
  ],
  imports: [
    BrowserModule,
      HighchartsChartModule,
      HttpClientModule,
      BrowserAnimationsModule,
      LayoutModule,
      MatToolbarModule,
      MatButtonModule,
      MatSidenavModule,
      MatIconModule,
      MatListModule,
      MatCardModule,
      MatGridListModule,
      LeafletModule.forRoot(),
  ],
  providers: [
      ApiRequestsService,
      ConnectionService,
      MapService,
      { provide: APP_INITIALIZER, useFactory: dahsboardServiceFactory, deps: [DashboardService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


