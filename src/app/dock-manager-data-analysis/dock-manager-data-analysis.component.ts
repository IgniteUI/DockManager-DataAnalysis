// tslint:disable: max-line-length
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { AutoPositionStrategy, CloseScrollStrategy, HorizontalAlignment, IgxDialogComponent, IgxGridComponent, IgxOverlayOutletDirective, OverlaySettings, VerticalAlignment } from "igniteui-angular";
import { IgcDockManagerLayout,  IgcDockManagerPaneType, IgcSplitPane, IgcSplitPaneOrientation } from "igniteui-dockmanager";
// tslint:disable-next-line: no-implicit-dependencies
import { ResizeObserver } from '@juggle/resize-observer';
import { Subject } from "rxjs";
import { CHART_TYPE } from "../directives/chart-integration/chart-types";
import { ConditionalFormattingDirective } from "../directives/conditional-formatting/conditional-formatting.directive";
import { DockSlotComponent } from "./dock-slot/dock-slot.component";
import {FinancialDataService} from '../services/financial-data.service';
import { IgxChartIntegrationDirective } from "igniteui-angular-extras";
import { FinancialData } from "./financialData";

@Component({
    selector: "dock-manager-data-analysis",
    templateUrl: "./dock-manager-data-analysis.component.html",
    styleUrls: ["./dock-manager-data-analysis.component.scss"]
})
export class DockManagerDataAnalysisComponent implements OnInit, AfterViewInit {

    public data;

    @ViewChild("dock", { read: ElementRef })
    public dockManager: ElementRef<HTMLIgcDockmanagerElement>;

    @ViewChild(ConditionalFormattingDirective, { read: ConditionalFormattingDirective, static: true })
    public formatting: ConditionalFormattingDirective;

    @ViewChild(IgxChartIntegrationDirective, {read: IgxChartIntegrationDirective, static: true})
    public chartIntegration: IgxChartIntegrationDirective;

    @ViewChild("grid", { read: IgxGridComponent, static: true })
    public grid: IgxGridComponent;

    @ViewChild(IgxOverlayOutletDirective, { static: true })
    public outlet: IgxOverlayOutletDirective;

    @ViewChild("contextDialog", { static: true })
    public contextDialog: IgxDialogComponent;

    @ViewChild("dialogContent", { read: ElementRef })
    public dialogContent: ElementRef<any>;

    @ViewChildren(DockSlotComponent)
    public dockSlots: QueryList<DockSlotComponent>;

    @ViewChild("template", { read: TemplateRef })
    public emptyChartTemplate: TemplateRef<any>;

    public chartData = [];
    public contextmenu = false;
    public contextmenuX = 0;
    public contextmenuY = 0;
    public selectedCharts = {};
    public range;
    public currentFormatter;
    public hasFormatter = false;
    public headersRenderButton = false;

    protected destroy$ = new Subject<any>();
    private _contextDilogOverlaySettings: OverlaySettings = {
        closeOnOutsideClick: false,
        modal: false,
        outlet: null,
        scrollStrategy: new CloseScrollStrategy(),
        positionStrategy: null
    };

    private _esfOverlayId;
    private rowIndex;
    private colIndex;
    private gridEventEmitters;
    private gridResizeNotify = new Subject();
    private contentObserver: ResizeObserver;
    // tslint:disable-next-line: member-ordering
    public docLayout: IgcDockManagerLayout = {
        rootPane: {
            type: IgcDockManagerPaneType.splitPane,
            orientation: IgcSplitPaneOrientation.horizontal,
            panes: [
                {
                    type: IgcDockManagerPaneType.documentHost,
                    rootPane: {
                        type: IgcDockManagerPaneType.splitPane,
                        size: 75,
                        orientation: IgcSplitPaneOrientation.horizontal,
                        panes: [
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: "grid",
                                header: "Grid",
                                allowClose: false
                            }
                        ]
                    }
                },
                {
                    type: IgcDockManagerPaneType.contentPane,
                    contentId: "chart-types-content",
                    header: "Chart Types",
                    size: 27,
                    allowClose: false
                }
            ]
        },
        floatingPanes: []
    };

    constructor(private cdr: ChangeDetectorRef,
                private dataService: FinancialDataService) {
             this.dataService.getFinancialRecords(1000);
    }

    public ngOnInit() {
        this.data = FinancialData.generateData(1000);
    }

    public createChartCommonLogic() {
        if (Object.keys(this.selectedCharts).length !== 0) {
            setTimeout(() => {
                Object.keys(this.selectedCharts).forEach((c: CHART_TYPE) => {
                    const chartHost = this.getChartHostFromSlot(c);
                    if (this.availableCharts.indexOf(c) !== -1) {
                        if (c !== CHART_TYPE.PIE && typeof this.selectedCharts[c] === "object") {
                            this.selectedCharts[c] = this.chartIntegration.chartFactory(c, null);
                        } else {
                            chartHost.viewContainerRef.clear();
                            this.selectedCharts[c] = this.chartIntegration.chartFactory(c, chartHost.viewContainerRef);
                        }
                    } else {
                        chartHost.viewContainerRef.clear();
                        const embeddedView = chartHost.viewContainerRef.createEmbeddedView(this.emptyChartTemplate);
                        embeddedView.detectChanges();
                        this.selectedCharts[c] = "Empty";
                    }
                });
            });
        }
    }

    public getChartHostFromSlot(type: CHART_TYPE) {
        return this.dockSlots.find(s => s.id === type).chartHost;
    }

    public ngAfterViewInit(): void {
        this.allCharts = this.chartIntegration.getAvailableCharts();
        this.cdr.detectChanges();
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public formatCurrency(value: number) {
        return "$" + value.toFixed(3);
    }

    // tslint:disable: member-ordering
    public chartTypesMenuX;
    public chartTypesMenuY;

    public availableCharts: CHART_TYPE[] = [];
    public allCharts: CHART_TYPE[] = [];
    public chartTypes = ["Column", "Area", "Bar", "Line", "Scatter", "Pie"];

    public toggleContextDialog(btn) {
        if (!this.contextDialog.isOpen) {
            this._contextDilogOverlaySettings.outlet = this.outlet;
            const positionStrategy = {
                verticalStartPoint: VerticalAlignment.Bottom,
                target: btn,
                openAnimation: null,
                closeAnimation: null
            };

            if (((this.grid.visibleColumns.length - 1) - this.colIndex) < 2 || !this.grid.navigation.isColumnFullyVisible(this.colIndex + 1)) {
                positionStrategy["horizontalDirection"] = HorizontalAlignment.Left;
                positionStrategy["horizontalStartPoint"] = HorizontalAlignment.Right;
            } else {
                positionStrategy["horizontalDirection"] = HorizontalAlignment.Center;
                positionStrategy["horizontalStartPoint"] = HorizontalAlignment.Center;
            }
            this._contextDilogOverlaySettings.positionStrategy = new AutoPositionStrategy({ ...positionStrategy });
            this.contextDialog.open(this._contextDilogOverlaySettings);
        } else {
            this.contextDialog.close();
        }
    }

    public formattersNames = [];

    public createChart(type: CHART_TYPE) {
        const floatingPane: IgcSplitPane = {
            type: IgcDockManagerPaneType.splitPane,
            orientation: IgcSplitPaneOrientation.horizontal,
            panes: [
                {
                    type: IgcDockManagerPaneType.contentPane,
                    header: type,
                    contentId: type
                }
            ]
        };
        const splitPane: IgcSplitPane = {
            type: IgcDockManagerPaneType.splitPane,
            orientation: IgcSplitPaneOrientation.horizontal,
            floatingWidth: 550,
            floatingHeight: 350,
            panes: [floatingPane]
        };

        const chartHost = this.getChartHostFromSlot(type);
        chartHost.viewContainerRef.clear();
        const chart = this.chartIntegration.chartFactory(type, chartHost.viewContainerRef);

        this.dockManager.nativeElement.layout.floatingPanes.push(splitPane);
        this.docLayout = { ...this.dockManager.nativeElement.layout };
        this.selectedCharts[type] = chart;
        this.cdr.detectChanges();
    }

    public disableContextMenu() {
        this.contextmenu = false;
        this.contextDialog.close();
    }

    public analyse(condition) {
        this.currentFormatter = condition;
        this.hasFormatter = true;
        this.formatting.formatCells(condition);
    }

    public clearFormatting() {
        this.formatting.clearFormatting();
        this.hasFormatter = false;
        this.currentFormatter = undefined;
    }

    public isWithInRange(rowIndex, colIndex) {
        return rowIndex >= this.range.rowStart && rowIndex <= this.range.rowEnd
            && colIndex >= this.range.columnStart && colIndex <= this.range.columnEnd;
    }
}
