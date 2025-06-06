import { Component, Injector, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  basicData: any;
  basicOptions: any;

  data: any;
  options: any;

  notRegisteredInstructor: any;
  registeredInstructor: any;
  approve: any;
  notYetApprove: any;
  currentYear: any = new Date().getFullYear();

  constructor(private _router: Router, private _service: DashboardService) {}
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.loadChartProjectStatisticsByTopic(null);
    this.loadChartProjectScoreStatisticsForYear(null);
    this.getDashboardTotal();
    this.getProjectStatisticsByTopic();
    this.getProjectScoreStatisticsForYear();
  }

  getDashboardTotal() {
    this._service.getDashboardTotal().then((res) => {
      this.notRegisteredInstructor = res.data.notRegisteredInstructor;
      this.registeredInstructor = res.data.registeredInstructor;
      this.approve = res.data.approve;
      this.notYetApprove = res.data.notYetApprove;
    });
  }

  getProjectStatisticsByTopic() {
    this._service.getDashboardProjectStatisticsByTopic().then((res) => {
      this.loadChartProjectStatisticsByTopic(res.data);
    });
  }

  getProjectScoreStatisticsForYear() {
    this._service.getDashboardProjectScoreStatisticsForYear().then((res) => {
      this.loadChartProjectScoreStatisticsForYear(res.data);
    });
  }

  loadChartProjectStatisticsByTopic(data) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const generateRandomColor = (opacity) => 
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${opacity})`;

    const backgroundColors = data?.map(() => generateRandomColor(0.2));
    const borderColors = data?.map(() => generateRandomColor(1));

    this.basicData = {
      labels: data?.map(item => item.topic), 
      datasets: [
        {
          label: 'Số lượng đồ án',
          data: data?.map(item => item.projectCount), 
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  loadChartProjectScoreStatisticsForYear(data) {
    const documentStyle1 = getComputedStyle(document.documentElement);
    const textColor1 = documentStyle1.getPropertyValue('--text-color');

    this.data = {
      labels: data?.map(item => item.category),  // Lấy tên danh mục từ API
      datasets: [
        {
          data: data?.map(item => item.count),  // Lấy số lượng tương ứng
          backgroundColor: [
            documentStyle1.getPropertyValue('--blue-500'),
            documentStyle1.getPropertyValue('--yellow-500'),
            documentStyle1.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle1.getPropertyValue('--blue-400'),
            documentStyle1.getPropertyValue('--yellow-400'),
            documentStyle1.getPropertyValue('--green-400'),
          ],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor1,
          },
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.raw} sinh viên`; 
            },
          },
        },
      },
    };
  }
}
