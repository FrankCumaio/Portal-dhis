import {AfterViewInit, Component, ElementRef, Inject, OnInit, Input} from '@angular/core';
import {DashboardService} from "../Shared/dashboard.service";
import * as $ from 'jquery';
import jQuery from 'jquery';

@Component({
  selector: 'app-pivot-table',
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.css'],
})

export class PivotTableComponent implements OnInit {
    private el: ElementRef;
    @Input() tableData;
    @Input() itemID;
    public isLoaded;


    constructor(public dashboardService: DashboardService,
                @Inject(ElementRef)el: ElementRef) {
        this.el = el;
    }

  ngOnInit() {
      this.isLoaded = false;
      this.getTable();
      // console.log(this.tableData)
  }
            getTable() {
        this.builTable(this.tableData.dashboardItem, this.tableData.result, this.tableData.rowDimensions,
            this.tableData.columnDimensions, this.tableData.orgUnitId, this.tableData.elmTyp).then((data) => {
            this.isLoaded = true;
            this.renderTable(data);
        });
            }
    // Funcao para construir tabelas
    builTable(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {
        const prom = new Promise((resolve, reject) => {
            const rowNames = [];
            let tableRows = [];
            const tableRowDimensions = [];
            const tableColumnDimensions = [];
            // console.log(rowDimensions);
            // console.log(columnDimensions);

            result.headers.forEach((header) => {
                rowNames.push(header.column);
            });

            // traduzimos os elementos usados para identificar as linhas para a tabela porque vem representados pelos id
            rowDimensions.forEach((row) => {
                tableRowDimensions.push(result.metaData.items[row].name);
            });
            // traduzimos os elementos usados para identificar as colunas para a tabela porque vem representados pelos id
            columnDimensions.forEach((column) => {
                tableColumnDimensions.push(result.metaData.items[column].name);
            });
            // traduzimos os elementos presentes na resposta rows do analytics porque vem representados pelos id
            tableRows = result.rows;
            // console.log(tableRows)

            tableRows.forEach((row) => {
                row.forEach((rowElement, index) => {
                    if (result.metaData.items[rowElement] !== undefined) {
                        row[index] = result.metaData.items[rowElement].name;
                    }
                });
            });
            // console.log(tableRows)
            // tableRows = result.rows
            // colocamos os nomes dos elementos que representam a estrutura na primeira linha
            tableRows.unshift(rowNames);
            // console.log(tableRows)
            resolve(
                {
                rv: tableRows,
                rd: tableRowDimensions,
                cd: tableColumnDimensions
            });
        });
        return prom;
    }

    renderTable (dataTb) {
                const average = $.pivotUtilities.aggregatorTemplates.sum;
        const numberFormat = $.pivotUtilities.numberFormat;
        const intFormat = numberFormat({digitsAfterDecimal: 1});
        $('#output' + this.itemID).pivot(
            dataTb.rv, {
                rows: dataTb.rd,
                cols: dataTb.cd,
                aggregator: average(intFormat)(['Value'])
            });
//         if (!this.el ||
//             !this.el.nativeElement ||
//             !this.el.nativeElement.children) {
//             console.log('cant build without element');
//             return;
//         }
//         const container = this.el.nativeElement;
//         const inst = jQuery(container);
//         const targetElement = inst.find('#output');
//
//         if (!targetElement) {
//             console.log('cant find the pivot element');
//             return;
//         }
//
//         //this helps if you build more than once as it will wipe the dom for that element
//         while (targetElement.firstChild) {
//             targetElement.removeChild(targetElement.firstChild);
//         }
//         // console.log(targetElement);
//         //here is the magic
//         // targetElement.pivot([
//         //         {color: "blue", shape: "circle"},
//         //         {color: "red", shape: "triangle"}
//         //     ],
//         //     {
//         //         rows: ["color"],
//         //         cols: ["shape"]
//         //     });
// // console.log( this.rowsValues)
// // console.log( this.rowDimensions)
// // console.log( this.columnDimensions)
//
//         const average = $.pivotUtilities.aggregatorTemplates.sum;
//         const numberFormat = $.pivotUtilities.numberFormat;
//         const intFormat = numberFormat({digitsAfterDecimal: 1});
// console.log(this.formatedTableData)
//         targetElement.pivot(
//             this.formatedTableData.rowsValues, {
//                 rows: this.formatedTableData.rowDimensions,
//                 cols: this.formatedTableData.columnDimensions,
//                 aggregator: average(intFormat)(['Value'])
//             });
//
    }
}
