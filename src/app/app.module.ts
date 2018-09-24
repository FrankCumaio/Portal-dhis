import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppComponent } from './app.component';
import { ConfigService } from './utils/config.service';
import { DashboardsService} from './Shared/dashboards.service';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavegacaoComponent } from './navegacao/navegacao.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatGridListModule } from '@angular/material';


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
      MatGridListModule
  ],
  providers: [DashboardsService,
      ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
