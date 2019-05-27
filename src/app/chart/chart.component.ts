import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';

HC_map( Highcharts);
HC_exporting( Highcharts);
NoDataToDisplay(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  public isLoaded;
  public chartOptions;
    public Highcharts = Highcharts;
    @Input() chartData;
    @Input() itemID;

  constructor() { }

  ngOnInit() {
      this.isLoaded = false;
      Highcharts.setOptions({
          colors: ['rgb(169, 190, 59)', 'rgb(85, 140, 192)', 'rgb(211, 73, 87)', 'rgb(255, 159, 58)',
              'rgb(150, 143, 143)', 'rgb(183, 64, 159);', 'rgb(255, 218, 100)', 'rgb(79, 189, 174)',
              'rgb(183, 128, 64)'],
          lang: {noData: "Sem dados por mostrar"}
      });
      this.getChart();
  }

  getChart() {
      this.buildEventChart(this.chartData.dashboardItem, this.chartData.result, this.chartData.rowDimensions,
          this.chartData.columnDimensions, this.chartData.orgUnitId, this.chartData.elmTyp)
              // console.log(data);
  }
    buildEventChart(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {
        // console.log('dashboardotem', dashboardItem);
        // console.log('result', result);
        // console.log('rowDimensions', rowDimensions);
        //
        // console.log('columnDimensions', columnDimensions);
        // console.log('orgUnitId', orgUnitId);
        // console.log('dashboardItemType', dashboardItemType);

            const rowDimensionValue = rowDimensions[0];
            const columnDimensionsValue = columnDimensions[0];
            let columnNamePosition;
            let rowNamePosition;

            // Determinando o tipo de grafico
            let chartType = 'COLUMN';
            if (dashboardItem[dashboardItemType].type !== undefined) {
                chartType = dashboardItem[dashboardItemType].type;
            }
            const stackedColumnOptions = [];

            let chartTypeAtt = chartType;
            // COlocamos a opcao stacked para esse tipo de objectos
            if (chartTypeAtt === 'STACKED_COLUMN' || chartTypeAtt === 'AREA' || chartTypeAtt === 'STACKED_BAR') {
                stackedColumnOptions.push({
                    stacking: 'normal'
                });
            } else {
                stackedColumnOptions.push('');
            }

            if (chartTypeAtt === 'STACKED_COLUMN') {
                chartTypeAtt = 'column';
            } else if (chartTypeAtt === 'STACKED_BAR') {
                chartTypeAtt = 'bar';
            } else {
                chartTypeAtt = chartType.toLowerCase();
            }


            // Verificamos a posicao do elemento na coluna
            result.headers.forEach((header, index) => {

                // if (columnDimensionsValue === 'pe' || columnDimensionsValue === 'dx' || columnDimensionsValue === 'pe') {
                if (header.name === columnDimensionsValue) {
                    columnNamePosition = index;
                }
            });

            // Verificamos a posicao do elemento na linha
            result.headers.forEach((header, index) => {

                // if (columnDimensionsValue === 'pe' || columnDimensionsValue === 'dx' || columnDimensionsValue === 'pe') {
                if (header.name === rowDimensionValue) {
                    rowNamePosition = index;
                }
            });

            const dataDIArray = [];
            const xcategories = [];

            // procuramos saber o index do elemnto que esta na rowDimensions

            // Pegamos cada dimensao para preenchermos o array
            // console.log(columnDimensions)
            // console.log(result.metaData.dimensions[columnDimensions[0]])
            // console.log( result.metaData.dimensions[rowDimensions[0]])


            result.metaData.dimensions[columnDimensions[0]].forEach((columnDimension, i) => {
                const rowsArrayToChart = [];
                let rowName;
                let category;
                let series;
                // console.log(columnDimension)
                // Pegamos valor por valor de cada linha e formamos o nosso array para graficos tipo PIE
                result.metaData.dimensions[rowDimensions[0]].forEach((rowDimension, i) => {

                    // console.log(rowDimension)
                    result.rows.forEach((row,j) => {
                        // percoremos o result.items para verificar o codigo do objceto de modo a ter o nome
                        // result.metaData.dimensions[rowDimensions[0]].forEach(metaDataItem => {
                        // console.log(rowDimensionValue);
                        // console.log(rowNamePosition);
                        let rowMetadata;
                        let columnMetadata;
                        // console.log(rowDimensionValue)
                        // Organizamos os dados que sao usados para comparacao de valores nas linhas
                        if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe' || rowDimensionValue === 'dx') {
                            category = result.metaData.items[rowDimension];
                            rowMetadata = result.metaData.items[row[rowNamePosition]];

                        } else {
                            // console.log(row[rowNamePosition])
                            if (result.metaData.items[rowDimension].code !== undefined) {
                                category = result.metaData.items[rowDimension].code;
                                rowMetadata = row[rowNamePosition];
                            } else {
                                category = result.metaData.items[rowDimension].name;
                                rowMetadata = result.metaData.items[row[rowNamePosition]].name;
                            }

                        }
                        // Organizamos os dados que sao usados para comparacao de valores nas colunas
                        // console.log(columnDimensionsValue)
                        if (columnDimensionsValue === 'ou' || columnDimensionsValue === 'pe' || columnDimensionsValue === 'dx') {
                            // console.log(result.metaData.items[columnDimension].name);
                            // console.log(result.metaData.items[row[columnNamePosition]].name);

                            columnMetadata = result.metaData.items[row[columnNamePosition]].name;
                            series = result.metaData.items[columnDimension].name;
                            // series =
                            // console.log(columnMetadata);
                            // console.log(columnMetadata)
                            // console.log(series)

                        } else {
                            // console.log(row[columnNamePosition]);
                            // console.log(result.metaData.items[row[columnNamePosition]])
                            if (result.metaData.items[row[columnNamePosition]] !== undefined) {
                                columnMetadata = result.metaData.items[row[columnNamePosition]].name;
                                series = result.metaData.items[columnDimension].name;
                                // }
                            } else {
                                series = result.metaData.items[columnDimension].code;
                                columnMetadata = row[columnNamePosition];

                                // console.log(series)
                            }
                            // console.log(series)
                            // console.log(columnMetadata)
                        }
                        // console.log(result.metaData.items[columnDimension])
                        // console.log(result.metaData.items[row[0]])
                        // console.log(rowDimension)
                        // console.log(result.metaData.items[rowDimension])
                        // console.log(result.metaData.items[row[0]])
                        // console.log(result.metaData.items[rowDimension].name)
                        // console.log(result.metaData.items[row[1]].name )
                        // if (result.metaData.items[rowDimension].hasOwnProperty('name')) {
                        // console.log(rowDimensionValue);
                        // console.log(result.metaData.items[row[1]]);
                        // console.log(category === result.metaData.items[row[1]]);
                        // console.log(category);
                        // console.log(rowMetadata);
                        // console.log(columnMetadata);

                        if (category === rowMetadata && series === columnMetadata) {
                            // console.log(result.metaData.items[rowDimension])
                            rowName = result.metaData.items[rowDimension].name;
                            xcategories.push(result.metaData.items[rowDimension].name)
                            if (chartType === 'PIE') {
                                rowsArrayToChart.push({
                                    name: rowName,
                                    y: parseFloat(row[row.length - 1]),
                                });
                            } else {
                                // Caso o objecto tenha valores comulativos
                                if (dashboardItem[dashboardItemType].cumulativeValues === true) {
                                    if (rowsArrayToChart.length === 0) {
                                        rowsArrayToChart.push(parseFloat(row[row.length - 1]));
                                    } else {
                                        const comulativeValue = rowsArrayToChart[rowsArrayToChart.length - 1] + parseFloat(row[row.length - 1]);
                                        rowsArrayToChart.push(parseFloat(comulativeValue));
                                    }
                                } else {
                                    rowsArrayToChart.push(parseFloat(row[row.length - 1]));

                                }
                            }
                        }

                    });
                });

                // dataDIArray.push({
                //     name: i,
                //     data: rowsArrayToChart
                // });
// console.log(chartType)
                if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'STACKED_BAR' || chartType === 'LINE' || chartType === 'PIE' || chartType === 'BAR' || chartType === 'AREA') {
                    if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
                        if (orgUnitId !== null && columnDimension.id === orgUnitId || orgUnitId === null) {
                            dataDIArray.push({
                                'name': result.metaData.items[columnDimension].name,
                                'data': rowsArrayToChart
                            });
                        }
                        // console.log(dataDIArray);

                    }
                    if (rowDimensionValue === 'dx') {
                        // console.log(result.metaData.items[columnDimension])
                        dataDIArray.push({
                            'name': result.metaData.items[columnDimension].name,
                            'data': rowsArrayToChart
                        });
                    }
                    if (rowDimensionValue !== 'dx' && rowDimensionValue !== 'pe' && rowDimensionValue !== 'ou') {
                        dataDIArray.push({
                            'name': result.metaData.items[columnDimension].name,
                            'data': rowsArrayToChart
                        });
                        // console.log(dataDIArray);

                    }
                    // } else if (element.chart.type === 'PIE') {
                    //     dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                    //
                }
            });

// console.log(stackedColumnOptions);
            // for (let i = 0; i < dataDIArray.length; i++){
            //     dataDIArray[i].data = dataDIArray[i].data.sort(function(a, b) {
            //         return a[0] - b[0] ;
            //     })
        // console.log(dataDIArray)
           this.chartOptions = {
                series: dataDIArray,
                chart: {
                    type: chartTypeAtt
                    // type: 'pie'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: xcategories,
                    crosshair: false
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y:.1f}',
                        }
                    },
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: stackedColumnOptions[0]
                }

            };
        this.isLoaded = true;

    }
    }

