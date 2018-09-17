///<reference path="../../node_modules/@types/node/index.d.ts"/>
import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighMaps from 'highcharts/highmaps';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_map from 'highcharts/modules/map';

HC_map(Highcharts);
HC_exporting(Highcharts);

require('../../js/world')(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'portalTests';
    Highcharts = Highcharts;
    chartOptions = {
        series: [{
            name: 'Tokyo',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        }, {
            name: 'New York',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
            name: 'London',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        }, {
            name: 'Berlin',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        }],
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        }
    };

    //----------------------------------------------------------------------
    // Demo #3
    chartMap = {
        chart: {
            map: 'myMapName'
        },
        title: {
            text: 'Highmaps basic demo'
        },
        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox'
            }
        },
        colorAxis: {
            min: 0
        },
        series: [{
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            allAreas: false,
            data: [
                ['fo', 0],
                ['um', 1],
                ['us', 2],
                ['jp', 3],
                ['sc', 4],
                ['in', 5],
                ['fr', 6],
                ['fm', 7],
                ['cn', 8],
                ['pt', 9],
                ['sw', 10],
                ['sh', 11],
                ['br', 12],
                ['ki', 13],
                ['ph', 14],
                ['mx', 15],
                ['es', 16],
                ['bu', 17],
                ['mv', 18],
                ['sp', 19],
                ['gb', 20],
                ['gr', 21],
                ['as', 22],
                ['dk', 23],
                ['gl', 24],
                ['gu', 25],
                ['mp', 26],
                ['pr', 27],
                ['vi', 28],
                ['ca', 29],
                ['st', 30],
                ['cv', 31],
                ['dm', 32],
                ['nl', 33],
                ['jm', 34],
                ['ws', 35],
                ['om', 36],
                ['vc', 37],
                ['tr', 38],
                ['bd', 39],
                ['lc', 40],
                ['nr', 41],
                ['no', 42],
                ['kn', 43],
                ['bh', 44],
                ['to', 45],
                ['fi', 46],
                ['id', 47],
                ['mu', 48],
                ['se', 49],
                ['tt', 50],
                ['my', 51],
                ['pa', 52],
                ['pw', 53],
                ['tv', 54],
                ['mh', 55],
                ['cl', 56],
                ['th', 57],
                ['gd', 58],
                ['ee', 59],
                ['ag', 60],
                ['tw', 61],
                ['bb', 62],
                ['it', 63],
                ['mt', 64],
                ['vu', 65],
                ['sg', 66],
                ['cy', 67],
                ['lk', 68],
                ['km', 69],
                ['fj', 70],
                ['ru', 71],
                ['va', 72],
                ['sm', 73],
                ['kz', 74],
                ['az', 75],
                ['tj', 76],
                ['ls', 77],
                ['uz', 78],
                ['ma', 79],
                ['co', 80],
                ['tl', 81],
                ['tz', 82],
                ['ar', 83],
                ['sa', 84],
                ['pk', 85],
                ['ye', 86],
                ['ae', 87],
                ['ke', 88],
                ['pe', 89],
                ['do', 90],
                ['ht', 91],
                ['pg', 92],
                ['ao', 93],
                ['kh', 94],
                ['vn', 95],
                ['mz', 96],
                ['cr', 97],
                ['bj', 98],
                ['ng', 99],
                ['ir', 100],
                ['sv', 101],
                ['sl', 102],
                ['gw', 103],
                ['hr', 104],
                ['bz', 105],
                ['za', 106],
                ['cf', 107],
                ['sd', 108],
                ['cd', 109],
                ['kw', 110],
                ['de', 111],
                ['be', 112],
                ['ie', 113],
                ['kp', 114],
                ['kr', 115],
                ['gy', 116],
                ['hn', 117],
                ['mm', 118],
                ['ga', 119],
                ['gq', 120],
                ['ni', 121],
                ['lv', 122],
                ['ug', 123],
                ['mw', 124],
                ['am', 125],
                ['sx', 126],
                ['tm', 127],
                ['zm', 128],
                ['nc', 129],
                ['mr', 130],
                ['dz', 131],
                ['lt', 132],
                ['et', 133],
                ['er', 134],
                ['gh', 135],
                ['si', 136],
                ['gt', 137],
                ['ba', 138],
                ['jo', 139],
                ['sy', 140],
                ['mc', 141],
                ['al', 142],
                ['uy', 143],
                ['cnm', 144],
                ['mn', 145],
                ['rw', 146],
                ['so', 147],
                ['bo', 148],
                ['cm', 149],
                ['cg', 150],
                ['eh', 151],
                ['rs', 152],
                ['me', 153],
                ['tg', 154],
                ['la', 155],
                ['af', 156],
                ['ua', 157],
                ['sk', 158],
                ['jk', 159],
                ['bg', 160],
                ['qa', 161],
                ['li', 162],
                ['at', 163],
                ['sz', 164],
                ['hu', 165],
                ['ro', 166],
                ['ne', 167],
                ['lu', 168],
                ['ad', 169],
                ['ci', 170],
                ['lr', 171],
                ['bn', 172],
                ['iq', 173],
                ['ge', 174],
                ['gm', 175],
                ['ch', 176],
                ['td', 177],
                ['kv', 178],
                ['lb', 179],
                ['dj', 180],
                ['bi', 181],
                ['sr', 182],
                ['il', 183],
                ['ml', 184],
                ['sn', 185],
                ['gn', 186],
                ['zw', 187],
                ['pl', 188],
                ['mk', 189],
                ['py', 190],
                ['by', 191],
                ['cz', 192],
                ['bf', 193],
                ['na', 194],
                ['ly', 195],
                ['tn', 196],
                ['bt', 197],
                ['md', 198],
                ['ss', 199],
                ['bw', 200],
                ['bs', 201],
                ['nz', 202],
                ['cu', 203],
                ['ec', 204],
                ['au', 205],
                ['ve', 206],
                ['sb', 207],
                ['mg', 208],
                ['is', 209],
                ['eg', 210],
                ['kg', 211],
                ['np', 212]
            ]
        }]
    };


}
