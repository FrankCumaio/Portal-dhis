import {AfterViewInit, Component, ElementRef, Inject, OnInit, Input} from '@angular/core';
import jQuery from 'jquery';
import {DashboardService} from "../Shared/dashboard.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-pivot-table',
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.css'],
})

export class PivotTableComponent implements OnInit, AfterViewInit {
    private el: ElementRef;
    @Input() rowsValues: any[];
    @Input() rowDimensions: any[];
    @Input() columnDimensions: any[];


    constructor(public dashboardService: DashboardService,
                @Inject(ElementRef)el: ElementRef) {
        this.el = el;
    }

  ngOnInit() {
      // console.log(this.tableData)
      if (!this.el ||
          !this.el.nativeElement ||
          !this.el.nativeElement.children) {
          console.log('cant build without element');
          return;
      }
      const container = this.el.nativeElement;
      const inst = jQuery(container);
      const targetElement = inst.find('#output');

      if (!targetElement) {
          console.log('cant find the pivot element');
          return;
      }

      //this helps if you build more than once as it will wipe the dom for that element
      while (targetElement.firstChild) {
          targetElement.removeChild(targetElement.firstChild);
      }
      // console.log(targetElement);
      //here is the magic
      // targetElement.pivot([
      //         {color: "blue", shape: "circle"},
      //         {color: "red", shape: "triangle"}
      //     ],
      //     {
      //         rows: ["color"],
      //         cols: ["shape"]
      //     });
// console.log( this.rowsValues)
// console.log( this.rowDimensions)
// console.log( this.columnDimensions)

      const average = $.pivotUtilities.aggregatorTemplates.sum;
      const numberFormat = $.pivotUtilities.numberFormat;
      const intFormat = numberFormat({digitsAfterDecimal: 1});

      targetElement.pivot(
          this.rowsValues, {
              rows: this.rowDimensions,
              cols: this.columnDimensions,
              aggregator: average(intFormat)(['Value'])
          });
  }
  ngAfterViewInit() {

            }
}
