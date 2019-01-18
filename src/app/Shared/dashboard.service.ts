import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {ApiRequestsService} from './apiRequests.service';
import {MapService} from '../Map/map.service';


@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private title: string;
    public dashboardItems: any = [];
    chartMap = [];
    public trasformedDashboardItems: any = [];
    private dashboards: any = [];
    private selectedDashboard: any = [];
    private selectedOrgUnit: any = [];
    private series = [];
    public MapGeoJson;
    private chartOpt = {};
    private tableData = {};
    public Maplegends = [];
    public orgUnits: any = [];
    public periods: any = [];

    //  Variavel do mat-loader
    public waiting = true;

    constructor(
        public apiRequestsService: ApiRequestsService,
        public mapService: MapService,
    ) {
    }

    public getDashboardItems(dashboardPos, orgUnit, period) {
        // Limpamos as variaveis dos valores antigos

        if (orgUnit === null) {
            this.selectedDashboard = [];
        }
        //
        this.selectedOrgUnit = [];
        this.dashboardItems = [];
        this.dashboards = [];
        this.orgUnits = [];
        console.log(orgUnit)
        this.load(dashboardPos, orgUnit);


        return this.dashboardItems;
    }

    public getDashboards() {
        // console.log(this.dashboards)

        return this.dashboards;
    }

    public getOrgUnits() {
        return this.orgUnits;
    }

    public getPeriods() {
        return 0;
    }

    public getSelectedDashboard() {
        // console.log(this.selectedDashboard)
        return this.selectedDashboard;
    }

    public getSelectedOrgUnit() {
        // console.log(this.selectedDashboard)
        return this.selectedOrgUnit;
    }

    load(dashboardPos, orgUnitId) {

        this.waiting = true;

        this.apiRequestsService.getDashboards().subscribe(resultado => {

            // Verificamos se a lista das dashboards ja havia sido carregada previamente

            // Carregamos todas dashboards do sistema e atribuimos a variavel dashboards

            resultado.dashboards.forEach((item) => {
                this.dashboards.push(item);
            });
            // }
            if (orgUnitId === null) {
                // Percoremos os items da dashboard para formatação dos dados
                this.selectedDashboard.push(resultado.dashboards[dashboardPos]);
            }
            this.selectedDashboard[0].dashboardItems.forEach(async (element, intemIndex) => {
                // Limpamos todas variaveis
                this.chartOpt = {};
                this.tableData = {};
                // this.dashboards[0].dashboardItems.forEach(async (element, intemIndex) => {
                //     this.dashboards.push(this.selectedDashboard);
                //    Vamos la tratar dos graficos
                if (element.type === 'CHART') {
                    this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element), orgUnitId).subscribe(async (result) => {
                        this.trasformedDashboardItems.push(result);
                        const rowDimensions = [element.chart.category];
                        const columnDimensions = [element.chart.series];
                        const mapData = await this.buildMap(element, result, rowDimensions, columnDimensions, orgUnitId, 'chart');
                        const chartOpt = this.buildEventChart(element, result, rowDimensions, columnDimensions, orgUnitId, 'chart');
                        const tableData = this.builTable(element, result, rowDimensions, columnDimensions, orgUnitId, 'chart');
                        this.dashboardItems.push({
                            chartOpt: chartOpt,
                            tableData: tableData,
                            mapData: mapData,
                            type: element.type,
                            renderedType: element.type,
                            displayName: element.chart.displayName

                        });
                    });
                }

                //    Vamos la tratar das tabelas
                if (element.type === 'REPORT_TABLE') {
                    console.log(element);
                    await this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element), orgUnitId).subscribe(async (result) => {
                        const rowDimensions = element.reportTable.rowDimensions;
                        const columnDimensions = element.reportTable.columnDimensions;
                        // console.log(rowDimensions);
                        // console.log(columnDimensions);
                        const mapData = await this.buildMap(element, result, rowDimensions, columnDimensions, orgUnitId, 'reportTable');
                        const chartOpt = this.buildEventChart(element, result, rowDimensions, columnDimensions, orgUnitId, 'reportTable');
                        const tableData = await this.builTable(element, result, rowDimensions, columnDimensions, orgUnitId, 'reportTable');


                        this.dashboardItems.push({
                            chartOpt: chartOpt,
                            tableData: tableData,
                            mapData: mapData,
                            type: element.type,
                            renderedType: element.type,
                            displayName: element.reportTable.displayName

                        });
                    });
                }
                // Vamos la tratar os Mapas
                if (element.type === 'MAP') {
                    await this.mapService.getMapviews(element.map.id).subscribe((res) => {
                        // console.log(res);
                        const geoData = [];

                        res.mapViews.forEach((mapView) => {
                            // console.log(mapView)
                            if (mapView.layer !== 'boundary') {
                                const Maplegends1 = [];
                                // console.log(this.Maplegends)
                                const dashboardItem = {
                                    map: mapView,
                                    type: 'map'
                                };
                                this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(dashboardItem), orgUnitId).subscribe(async (result) => {
                                    const rowDimensions = [];
                                    const columnDimensions = [];

                                    mapView.rows.forEach((rw) => {
                                        rowDimensions.push(rw.id);
                                    });
                                    mapView.columns.forEach((cm) => {
                                        columnDimensions.push(cm.id);
                                    });
                                    const mapData = await this.buildMap(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, 'map');
                                    const chartOpt = this.buildEventChart(dashboardItem, result, columnDimensions, rowDimensions, orgUnitId, 'map');
                                    const tableData = this.builTable(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, 'map');
                                    this.dashboardItems.push({
                                        chartOpt: chartOpt,
                                        tableData: tableData,
                                        mapData: mapData,
                                        type: element.type,
                                        renderedType: element.type,
                                        displayName: element.map.displayName
                                    });

                                });
                                // geoData = [];
                            }
                        });
                    });
                }
                //    Vamos la tratar os Event charts
                if (element.type === 'EVENT_CHART') {
                    this.apiRequestsService.getItemData(this.apiRequestsService.prepareForRequest(element), orgUnitId).subscribe(async (result) => {
                        this.trasformedDashboardItems.push(result);
                        console.log('evento');
                        const rowDimensions = element.eventChart.rowDimensions;
                        const columnDimensions = element.eventChart.columnDimensions;
                        // const mapData = await this.buildMap(element, result, rowDimensions, columnDimensions, orgUnitId, 'eventChart');
                        const chartOpt = this.buildEventChart(element, result, rowDimensions, columnDimensions, orgUnitId, 'eventChart');
                        // const tableData = await this.builTable(element, result, rowDimensions, columnDimensions, orgUnitId, 'eventChart');
                        this.dashboardItems.push({
                            chartOpt: chartOpt,
                            tableData: [],
                            mapData: [],
                            type: element.type,
                            renderedType: element.type,
                            displayName: element.eventChart.displayName

                        });
                    });
                }
            });

            // });
            //     this.dashboards = resultado.dashboards;
        });

        this.apiRequestsService.getOrgUnits().subscribe(resultado => {
            resultado.organisationUnits.forEach((item) => {
                this.orgUnits.push(item);
            });
        });
        // console.log(this.chartOptions);

    }


    // Funcao para construir tabelas
    builTable(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {
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

        return {
            rowsValues: tableRows,
            rowDimensions: tableRowDimensions,
            columnDimensions: tableColumnDimensions
        };
    }

    buildChart(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {
        // Criamos tabela para o grafico
        let chartType = 'COLUMN';
        if (dashboardItem[dashboardItemType].type !== undefined) {
            chartType = dashboardItem[dashboardItemType].type;
        }
        // this.builTable(element, result, rowDimensions, columnDimensions, 'chart');


        let dataDItype = null;
        const xcategories = [];
        const dataDIArray = [];
        let series = null;
        const chartOptions = [];
        let columnNamePosition;
        const rowDimensionValue = rowDimensions[0];
        const columnDimensionsValue = columnDimensions[0];

        if (rowDimensionValue === 'ou') {
            series = 'organisationUnits';
        } else if (rowDimensionValue === 'pe') {
            series = 'periods';
        } else if (rowDimensionValue === 'dx') {
            series = 'dataDimensionItems';
        } else {
            series = 'dataElementDimensions';
        }
        // Verificamos a posicao do elemento na coluna
        result.headers.forEach((header, index) => {

            // if (columnDimensionsValue === 'pe' || columnDimensionsValue === 'dx' || columnDimensionsValue === 'pe') {
            if (header.name === columnDimensionsValue) {
                columnNamePosition = index;
            }
        });
        let teste = [orgUnitId];
// Carregamos os dados PAra cada Dimensao, Unidade organizacional ou periodo que se encontra nas series
        dashboardItem[dashboardItemType][series].forEach((dataDI) => {
            let serieID;
            const rowsArray = [];
            // Definimos o id da dimensao pois este pode variar consoante o tipo de serie
            //        console.log(rowDimensionValue)
            if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
                serieID = dataDI.id;
            }
            if (rowDimensionValue === 'dx') {
                dataDItype = this.apiRequestsService.convertUnderscoreToCamelCase(dataDI.dataDimensionItemType);
                serieID = dataDI[dataDItype].id;
            }
            if (rowDimensionValue !== 'dx' && rowDimensionValue !== 'ou' && rowDimensionValue !== 'pe') {
                if (dataDI.hasOwnProperty('dataElement')) {
                    dataDItype = 'DATA_ELEMENT';
                    serieID = dataDI.dataElement.id;
                }

            }
            // console.log(result.rows)
            result.rows.forEach((row, index) => {
                // console.log()
                // row.forEach((rowElment, index2) => {
                    let posicaoNaRow = 0;
                    if (dashboardItemType === 'eventChart') {
                        posicaoNaRow = 1;
                    }

                    // console.log(row[posicaoNaRow])
                    if (row[posicaoNaRow] === serieID) {
                        // console.log(rowElment.split('.')[0] )
                        // console.log(serieID)
                        let filterNameID;
                             filterNameID = row[columnNamePosition];
                        const filterName = result.metaData.items[filterNameID].name;
                        xcategories.push(filterName);
                        if (chartType === 'PIE') {
                            // console.log("E pie");
                            // console.log(result.metaData.items[filterName].name);
                            // console.log(row[row.length - 1]);
                            rowsArray.push({
                                'name': filterName,
                                'y': parseFloat(row[row.length - 1])
                            });
                        } else if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'LINE' || chartType === 'BAR') {
                            // console.log(dashboardItem)
                            // console.log(row[row.length - 1])
                            rowsArray.push(parseFloat(row[row.length - 1]));
                        }
                        }
                // });
            });
// console.log(rowDimensionValue)
            if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'LINE' || chartType === 'PIE' || chartType === 'BAR') {
                if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
                    if (orgUnitId !== null && dataDI.id === orgUnitId || orgUnitId===null ){
                    dataDIArray.push({'name': dataDI.displayName, 'data': rowsArray});
                    }
                    // console.log(dataDIArray);

                }
                if (rowDimensionValue === 'dx') {
                    dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                }
                if (rowDimensionValue !== 'dx' && rowDimensionValue !== 'pe' && rowDimensionValue !== 'ou') {
                    dataDIArray.push({'name': 'teste', 'data': rowsArray});
                    // console.log(dataDIArray);

                }
                // } else if (element.chart.type === 'PIE') {
                //     dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                //
            }
        });
// Atribuimos os valores trabalhados de acordo com o tipo de grafico
//        console.log(dataDIArray);
        this.series = dataDIArray;

//
        let stackedColumnOptions = null;
        let chartTypeAtt = chartType;
        if (chartTypeAtt === 'STACKED_COLUMN') {
            chartTypeAtt = 'bar';
            stackedColumnOptions = {
                stacking: 'normal'
            };
        } else {
            chartTypeAtt = chartType.toLowerCase();
        }
// console.log(element);
// console.log([49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]);
// console.log(this.series)
// this.title = ;

        return this.waiting = false, {
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
            legend: {
                reversed: true
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                },
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                },
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                },
                column: {
                    dataLabels: {
                        enabled: true
                    }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{name}</b>: {point.y:.1f}',
                    }
                },
                series: {
                    stacking: 'normal'
                }

            }

        };

    }

    buildChart2(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {

        console.log(dashboardItem);
        console.log(result);
        console.log(rowDimensions);

        console.log(columnDimensions);
        console.log(orgUnitId);
        console.log(dashboardItemType);
        // Criamos tabela para o grafico
        let chartType = 'COLUMN';
        if (dashboardItem[dashboardItemType].type !== undefined) {
            chartType = dashboardItem[dashboardItemType].type;
        }
        // this.builTable(element, result, rowDimensions, columnDimensions, 'chart');


        let dataDItype = null;
        const xcategories = [];
        const dataDIArray = [];
        let series = null;
        const chartOptions = [];
        let columnNamePosition;
        const rowDimensionValue = rowDimensions[0];
        const columnDimensionsValue = columnDimensions[0];

        if (rowDimensionValue === 'ou') {
            series = 'organisationUnits';
        } else if (rowDimensionValue === 'pe') {
            series = 'periods';
        } else if (rowDimensionValue === 'dx') {
            series = 'dataDimensionItems';
        } else {
            series = 'dataElementDimensions';
        }

        console.log(series)
        // Verificamos a posicao do elemento na coluna
        result.headers.forEach((header, index) => {

            // if (columnDimensionsValue === 'pe' || columnDimensionsValue === 'dx' || columnDimensionsValue === 'pe') {
            if (header.name === columnDimensionsValue) {
                columnNamePosition = index;
            }
        });
        let teste = [orgUnitId];
// Carregamos os dados PAra cada Dimensao, Unidade organizacional ou periodo que se encontra nas series
        dashboardItem[dashboardItemType][series].forEach((dataDI) => {
            console.log(dataDI);
            let serieID;
            const rowsArray = [];
            // Definimos o id da dimensao pois este pode variar consoante o tipo de serie
            //        console.log(rowDimensionValue)
            if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
                serieID = dataDI.id;
            }
            if (rowDimensionValue === 'dx') {
                dataDItype = this.apiRequestsService.convertUnderscoreToCamelCase(dataDI.dataDimensionItemType);
                serieID = dataDI[dataDItype].id;
            }
            if (rowDimensionValue !== 'dx' && rowDimensionValue !== 'ou' && rowDimensionValue !== 'pe') {
                if (dataDI.hasOwnProperty('dataElement')) {
                    dataDItype = 'DATA_ELEMENT';
                    serieID = dataDI.dataElement.id;
                }

            }
            // console.log(result.rows)
            result.rows.forEach((row, index) => {
                // console.log()
                // row.forEach((rowElment, index2) => {
                let posicaoNaRow = 0;
                if (dashboardItemType === 'eventChart') {
                    posicaoNaRow = 0;
                }

                // console.log(row[posicaoNaRow])
                if (row[posicaoNaRow] === serieID) {
                    // console.log(rowElment.split('.')[0] )
                    // console.log(serieID)
                    let filterNameID;
                    filterNameID = row[columnNamePosition];
                    console.log(columnNamePosition)
                    console.log(filterNameID)
                   console.log( result.metaData.items[filterNameID]);
                    const filterName = result.metaData.items[filterNameID].name;
                    xcategories.push(filterName);
                    if (chartType === 'PIE') {
                        // console.log("E pie");
                        // console.log(result.metaData.items[filterName].name);
                        // console.log(row[row.length - 1]);
                        rowsArray.push({
                            'name': filterName,
                            'y': parseFloat(row[row.length - 1])
                        });
                    } else if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'LINE' || chartType === 'BAR') {
                        // console.log(dashboardItem)
                        // console.log(row[row.length - 1])
                        rowsArray.push(parseFloat(row[row.length - 1]));
                    }
                }
                // });
            });
// console.log(rowDimensionValue)
            if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'LINE' || chartType === 'PIE' || chartType === 'BAR') {
                if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
                    if (orgUnitId !== null && dataDI.id === orgUnitId || orgUnitId===null ){
                        dataDIArray.push({'name': dataDI.displayName, 'data': rowsArray});
                    }
                    // console.log(dataDIArray);

                }
                if (rowDimensionValue === 'dx') {
                    dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                }
                if (rowDimensionValue !== 'dx' && rowDimensionValue !== 'pe' && rowDimensionValue !== 'ou') {
                    dataDIArray.push({'name': 'teste', 'data': rowsArray});
                    // console.log(dataDIArray);

                }
                // } else if (element.chart.type === 'PIE') {
                //     dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                //
            }
        });
// Atribuimos os valores trabalhados de acordo com o tipo de grafico
//        console.log(dataDIArray);
        this.series = dataDIArray;

//
        let stackedColumnOptions = null;
        let chartTypeAtt = chartType;
        if (chartTypeAtt === 'STACKED_COLUMN') {
            chartTypeAtt = 'bar';
            stackedColumnOptions = {
                stacking: 'normal'
            };
        } else {
            chartTypeAtt = chartType.toLowerCase();
        }
// console.log(element);
// console.log([49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]);
// console.log(this.series)
// this.title = ;

        return this.waiting = false, {
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
            legend: {
                reversed: true
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
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
                    },
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{name}</b>: {point.y:.1f}',
                        }
                    }
                },
                series: {
                    stackedColumnOptions
                }

            }

        };

    }

    buildEventChart(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {
        console.log(dashboardItem);
        console.log(result);
        console.log(rowDimensions);

        console.log(columnDimensions);
        console.log(orgUnitId);
        console.log(dashboardItemType);


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
       // console.log(rowDimensions)
       // console.log( result.metaData.dimensions[rowDimensions[0]])


        result.metaData.dimensions[columnDimensions[0]].forEach((columnDimension, i) => {
            const rowsArrayToChart = [];
           let rowName;
           let category;
           let series;
            // console.log(columnDimension)
            // Pegamos valor por valor de cada linha e formamos o nosso array para graficos tipo PIE
            result.metaData.dimensions[rowDimensions[0]].forEach((rowDimension, i) => {


                result.rows.forEach(row => {
                    // percoremos o result.items para verificar o codigo do objceto de modo a ter o nome
                    // result.metaData.dimensions[rowDimensions[0]].forEach(metaDataItem => {
                    // console.log(rowDimensionValue);
                    // console.log(rowNamePosition);
                    let rowMetadata;
                    let columnMetadata;
                    // Organizamos os dados que sao usados para comparacao de valores nas linhas
                    if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe' || rowDimensionValue === 'dx') {
                        category = result.metaData.items[rowDimension];
                        rowMetadata = result.metaData.items[row[rowNamePosition]];

                    }  else {
                        category = result.metaData.items[rowDimension].code;
                        rowMetadata = row[rowNamePosition];
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

                    } else {
                        // console.log(row[columnNamePosition]);
                        series = result.metaData.items[columnDimension].code;
                        columnMetadata = row[columnNamePosition];
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
                            rowsArrayToChart.push(parseFloat(row[row.length - 1]));
                        }
                    }
                    // }
                    // else if (result.metaData.items[rowDimension].hasOwnProperty('name') && result.metaData.items[rowDimension].hasOwnProperty('code')) {
                    //     if (result.metaData.items[rowDimension].code === row[0]) {
                    //         rowName = result.metaData.items[rowDimension].name;
                    //         if (chartType === 'PIE') {
                    //             rowsArrayToChart.push({
                    //                 name: rowName,
                    //                 y: parseFloat(row[row.length - 1]),
                    //             });
                    //         } else {
                    //             rowsArrayToChart.push(parseFloat(row[row.length - 1]));
                    //         }
                    //     }
                    // }
                    // })
                    // console.log(rowDimension)
                    // console.log(row[1] +'humm')


                });
            });

        // dataDIArray.push({
        //     name: i,
        //     data: rowsArrayToChart
        // });
            if (chartType === 'COLUMN' || chartType === 'STACKED_COLUMN' || chartType === 'LINE' || chartType === 'PIE' || chartType === 'BAR' || chartType === 'AREA') {
                if (rowDimensionValue === 'ou' || rowDimensionValue === 'pe') {
                    if (orgUnitId !== null && columnDimension.id === orgUnitId || orgUnitId === null ){
                        dataDIArray.push({'name': result.metaData.items[columnDimension].name, 'data': rowsArrayToChart});
                    }
                    // console.log(dataDIArray);

                }
                if (rowDimensionValue === 'dx') {
                    // console.log(result.metaData.items[columnDimension])
                    dataDIArray.push({'name': result.metaData.items[columnDimension].name, 'data': rowsArrayToChart});
                }
                if (rowDimensionValue !== 'dx' && rowDimensionValue !== 'pe' && rowDimensionValue !== 'ou') {
                    dataDIArray.push({'name': result.metaData.items[columnDimension].name, 'data': rowsArrayToChart});
                    // console.log(dataDIArray);

                }
                // } else if (element.chart.type === 'PIE') {
                //     dataDIArray.push({'name': dataDI[dataDItype].displayName, 'data': rowsArray});
                //
            }
        });

console.log(stackedColumnOptions);
        return this.waiting = false, {
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
    }

    buildMap(dashboardItem, result, rowDimensions, columnDimensions, orgUnitId, dashboardItemType) {
        const prom = new Promise((resolve, reject) => {
            const targetDashboardItem = dashboardItem[dashboardItemType];
            const geoData = [];
            let Maplegends1 = [];
            let mapData = {};
            this.mapService.criarGeoJson(targetDashboardItem, orgUnitId).subscribe((obj) => {

                let coordenadas = [];
                obj.forEach((el, index) => {
                    let type = null;
                    let value = null;
                    let color = null;
                    const rowsValues: Array<number> = [];
                    // Aqui é onde criamos o nosso GeoJson

                    if (el.ty === 2) {
                        const valCoordenadas = el.co;
                        type = 'MultiPolygon';
                        // coordenadas  = el.co;

                        // coordenadas = JSON.parse('[' + el.coordinates + ']');
                        // if (valCoordenadas !== undefined) {
                        coordenadas = JSON.parse(el.co);
                        // }

                    } else if (el.ty === 1 || el.ty === 0) {
                        type = 'Point';
                        coordenadas = el.co;
                        // if (valCoordenadas !== undefined) {
                        coordenadas = JSON.parse(el.co);
                        // console.log([coordenadas])
                        //     coordenadas = coordenadas[0];
                        // }
                        //
                    }
                    result.rows.forEach((row) => {

                        if (el.id === row[1]) {
                            value = row[row.length - 1];
                        }
                        rowsValues.push(row[row.length - 1]);
                    });
                    // console.log(result.rows)
                    // console.log(coordenadas);

                    // this.mapService.legendSet = this.Maplegends;
                    if (targetDashboardItem.hasOwnProperty('legendSet')) {
                        // console.log(targetDashboardItem);
                        targetDashboardItem.legendSet.legends.forEach((legend) => {
                            Maplegends1.push(legend);
                        });
                    } else {
                        // console.log(mapView.colorScale.split(','))
                        let legendClasses;
                        if (targetDashboardItem.hasOwnProperty('legendSet')) {
                            legendClasses = targetDashboardItem.classes;
                        } else {
                            legendClasses = 5;
                        }
                        let colorScale;
                        if (!targetDashboardItem.hasOwnProperty('colorscale')) {
                            colorScale = '#ffffd4,#fed98e,#fe9929,#d95f0e,#993404';
                        } else {
                            colorScale = targetDashboardItem.colorScale;
                        }
                        Maplegends1 = this.mapService.createLegendSet(Math.min(...rowsValues), Math.max(...rowsValues), legendClasses, colorScale);
                    }
                    Maplegends1.forEach((legend) => {
                        if (value >= legend.startValue && value <= legend.endValue) {
                            color = legend.color;
                            // console.log(color);
                        }
                    });


                    // console.log(value);
                    // let a = this.mapService.getColor(value);
                    // console.log(a);
                    // console.log(color);

                    geoData.push({
                        'type': 'Feature',
                        'properties': {
                            'orgUnit': el.na,
                            'value': value,
                            'color': color
                        },
                        'geometry': {
                            'type': type,
                            'coordinates': coordenadas
                        }
                    });

                    // this.mapService.getColor(2);

                    // console.log(geoData);
                    // i++;
                    // console.log(element)
                    if (index === obj.length - 1) {
                        this.MapGeoJson = L.geoJSON(geoData as any, {
                            style: function (feature) {
                                return {
                                    weight: 1,
                                    opacity: 1,
                                    color: 'black',
                                    dashArray: '',
                                    fillOpacity: 0.7,
                                    fillColor: feature.properties.color
                                };
                            },
                            onEachFeature: this.mapService.onEachFeature
                        });

                        mapData = {
                            mapOptions: {
                                center: L.latLng(0, 0),
                                scrollWheelZoom: false,
                                layers: [
                                    this.MapGeoJson,
                                    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                                        '&copy; <a href="https://dhis2.org">DHIS2</a>',
                                    })
                                ],
                            }
                        };
                        resolve(mapData);
                    }
                });
            });
        });
        return prom;
    }
}

