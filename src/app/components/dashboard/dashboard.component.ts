import { Component, OnInit, OnDestroy, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService, UserSession } from '../../core/services/auth.service';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: UserSession | null = null;
  dashboardData: any = null;
  activeBookings: any[] = [];

  filterStartDate: string = '';
  filterEndDate: string = '';

  private rootBar!: am5.Root;
  private rootDonut!: am5.Root;
  private rootCustomer!: am5.Root;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        if (this.rootBar) this.rootBar.dispose();
        if (this.rootDonut) this.rootDonut.dispose();
        if (this.rootCustomer) this.rootCustomer.dispose();
      });
    }
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    const today = new Date().toISOString().split('T')[0];
    this.filterStartDate = today;
    this.filterEndDate = today;
    this.loadDashboard();
  }

  onFilterChange() {
    this.loadDashboard();
  }

  loadDashboard() {
    let startQuery = this.filterStartDate ? `${this.filterStartDate}T00:00:00` : undefined;
    let endQuery = this.filterEndDate ? `${this.filterEndDate}T23:59:59` : undefined;

    this.apiService.getDashboard(startQuery, endQuery).subscribe({
      next: (data) => {
        this.dashboardData = data;
        setTimeout(() => this.updateCharts(), 100);
      },
      error: (err) => console.error('Dashboard load failed', err)
    });

    this.apiService.getBookings().subscribe({
      next: (data) => {
        // Filter for active bookings
        this.activeBookings = data.filter((b: any) => b.status === 'Assigned' || b.status === 'InProgress');
      },
      error: (err) => console.error('Failed to load bookings', err)
    });
  }

  updateCharts() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.initBarChart();
        this.initDonutChart();
        this.initCustomerChart();
      });
    }
  }

  initBarChart() {
    if (this.rootBar) {
      this.rootBar.dispose();
    }
    
    // Check if element exists
    const el = document.getElementById("barChartDiv");
    if (!el) return;

    let root = am5.Root.new("barChartDiv");
    this.rootBar = root;
    
    root.setThemes([am5themes_Animated.new(root)]);
    
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true
    }));
    
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    xRenderer.grid.template.setAll({
      location: 1
    });
    
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "category",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));
    
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });

    series.columns.template.adapters.add("fill", function(fill, target) {
      return chart.get("colors")!.getIndex(series.columns.indexOf(target) || 0);
    });
    
    series.columns.template.adapters.add("stroke", function(stroke, target) {
      return chart.get("colors")!.getIndex(series.columns.indexOf(target) || 0);
    });

    let data = [
      { category: "Own Fleet", value: this.dashboardData?.graphOwnFleetBooking || 0 },
      { category: "Vendor", value: this.dashboardData?.graphVendorBooking || 0 },
      { category: "C2C", value: this.dashboardData?.graphC2CBooking || 0 }
    ];
    
    xAxis.data.setAll(data);
    series.data.setAll(data);
    
    series.appear(1000);
    chart.appear(1000, 100);
  }

  initDonutChart() {
    if (this.rootDonut) {
      this.rootDonut.dispose();
    }
    
    const el = document.getElementById("donutChartDiv");
    if (!el) return;

    let root = am5.Root.new("donutChartDiv");
    this.rootDonut = root;
    
    root.setThemes([am5themes_Animated.new(root)]);
    
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(60)
    }));
    
    let series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category"
    }));
    
    series.slices.template.setAll({
      stroke: root.interfaceColors.get("background"),
      strokeWidth: 2,
      cornerRadius: 10
    });
    
    series.slices.template.set("fillGradient", am5.RadialGradient.new(root, {
      stops: [
        { brighten: -0.8 },
        { brighten: -0.8 },
        { brighten: -0.5 },
        { brighten: 0 },
        { brighten: -0.5 }
      ]
    }));
    
    let data = [
      { category: "Own Fleet", value: this.dashboardData?.graphOwnFleetBooking || 0 },
      { category: "Vendor", value: this.dashboardData?.graphVendorBooking || 0 },
      { category: "C2C", value: this.dashboardData?.graphC2CBooking || 0 }
    ];
    
    series.data.setAll(data);
    
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15,
    }));
    legend.data.setAll(series.dataItems);
    
    series.appear(1000, 100);
  }

  initCustomerChart() {
    if (this.rootCustomer) {
      this.rootCustomer.dispose();
    }
    
    const el = document.getElementById("customerChartDiv");
    if (!el) return;

    let root = am5.Root.new("customerChartDiv");
    this.rootCustomer = root;
    
    root.setThemes([am5themes_Animated.new(root)]);
    
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none"
    }));
    
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: 0,
      centerY: am5.p50,
      centerX: am5.p50,
      paddingTop: 10
    });

    xRenderer.grid.template.setAll({ location: 1 });
    
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 })
    }));
    
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Customers",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" })
    }));
    
    series.columns.template.setAll({ 
      cornerRadiusTL: 5, 
      cornerRadiusTR: 5, 
      strokeOpacity: 0,
      fill: am5.color(0xdc3545),
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(0xdc3545) },
          { color: am5.color(0xf8d7da) }
        ],
        rotation: 90
      })
    });

    let data = [
      { category: "Customers", value: this.dashboardData?.graphTotalCustomer || 0 }
    ];
    
    xAxis.data.setAll(data);
    series.data.setAll(data);
    
    series.appear(1000);
    chart.appear(1000, 100);
  }
}
