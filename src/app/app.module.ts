import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  ConditionalFormattingDirective } from "./directives/conditional-formatting/conditional-formatting.directive";
import { FloatingPanesService} from './services/floating-panes.service';
import { ChartIntegrationDirective, ChartHostDirective} from './directives/chart-integration/chart-integration.directive';
import { IgxGridModule, IgxButtonModule, IgxDialogModule, IgxDividerModule, IgxTabsModule } from 'igniteui-angular';
import { IgxDataChartComponent, IgxItemLegendComponent, IgxLegendComponent, IgxPieChartComponent, IgxDataChartCategoryModule, IgxDataChartCoreModule, IgxLegendModule, IgxDataChartInteractivityModule, IgxNumericXAxisModule, IgxNumericYAxisModule, IgxCategoryXAxisModule, IgxItemLegendModule, IgxPieChartModule, IgxDataChartStackedModule, IgxDataChartScatterModule, IgxBarSeriesModule, IgxCategoryChartModule } from 'igniteui-angular-charts';
import { NamePipe } from './pipes/name.pipe';
import { FilterTypePipe } from './pipes/filter-type.pipe';
import {DockManagerDataAnalysisComponent} from './dock-manager-data-analysis/dock-manager-data-analysis.component';
import { SelectedPipeChart } from './pipes/selected-chart.pipe';
import { FinancialDataService } from './services/financial-data.service';
import { DockSlotComponent } from './dock-manager-data-analysis/dock-slot/dock-slot.component';
@NgModule({
  declarations: [
    AppComponent,
    ConditionalFormattingDirective,
    DockManagerDataAnalysisComponent,
    ChartIntegrationDirective,
    NamePipe,
    FilterTypePipe,
    SelectedPipeChart,
    ChartHostDirective,
    DockSlotComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IgxButtonModule,
    IgxDialogModule,
    IgxDividerModule,
    IgxGridModule,
    IgxTabsModule,
    IgxDataChartCategoryModule,
    IgxDataChartCoreModule,
    IgxLegendModule,
    IgxDataChartInteractivityModule,
    IgxNumericXAxisModule,
    IgxNumericYAxisModule,
    IgxCategoryXAxisModule,
    IgxItemLegendModule,
    IgxPieChartModule,
    IgxDataChartStackedModule,
    IgxDividerModule,
    IgxDataChartScatterModule,
    IgxBarSeriesModule,
    IgxCategoryChartModule,
    HttpClientModule

  ],
  providers: [FloatingPanesService, FinancialDataService],
  bootstrap: [AppComponent],
  entryComponents: [
    IgxDataChartComponent,
    IgxItemLegendComponent,
    IgxLegendComponent,
    IgxPieChartComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
