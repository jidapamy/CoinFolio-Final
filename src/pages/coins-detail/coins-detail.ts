import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatacoinProvider, tempStatisticsCoinsDetail, tempStatisticsCoins, tempbookorderBidItem, tempbookorderBid, tempbookorder, cryptoCurrency} from '../../providers/datacoin/datacoin';
import Highcharts from 'highcharts/highstock';
import * as HighCharts from 'highcharts';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Screenshot } from '@ionic-native/screenshot';
import { HomePage } from '../home/home';
/**
 * Generated class for the CoinsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-coins-detail',
  templateUrl: 'coins-detail.html',
})
export class CoinsDetailPage {
  crypto: any;
  priceperday: any;

  priceOfDay: any[] = [];
  nameCoin: any;
  dataInicial: Date = new Date();;
  test: any;
  asksDetail: any[] = [];
  orderbook:any;
  bids:any;
  asks:any;
  
  volumeBid:any;
  volumeAsk: any;
  hightBid:any;
  hightAsk: any;

  dateTimes: string;

  screen: any;
  state: boolean = false;


  itemBids: tempbookorderBidItem[] = [];
  tempbookorderBid: tempbookorderBid[]
  bookOrder: tempbookorder[];

  coins: tempStatisticsCoinsDetail[];


  constructor(private screenshot: Screenshot,public navCtrl: NavController, public navParams: NavParams, public provider: DatacoinProvider) {
    let paramType = this.navParams.get('type');
    
    if(paramType == 'home'){
      this.crypto = this.navParams.get('crypto')
    }else{
      this.crypto = this.navParams.get('crypto').cryptoCurrency
      this.crypto.primary_currency = this.navParams.get('crypto').myCoins.coin.primary_currency
    }

    // this.crypto = this.navParams.data
    console.dir(this.crypto)
    this.orderbook = this.crypto.orderbook;
    this.bids = this.orderbook.bids;
    this.asks = this.orderbook.asks;
    
    //date format Ex.2017-10-19
    this.dateTimes = this.dataInicial.getFullYear() + '-' + this.dataInicial.getMonth() + '-' + this.dataInicial.getDate()


    this.provider.loadStatistics().subscribe(data => {
      this.coins = Object.keys(data).map(key => data[key]);
      console.dir('AAAA: ' + this.coins)
    },
      error => { console.log("error: " + error); },
      () => {
        console.log('Lenght: ' + this.coins.length);
        this.priceOfDay = [];
        for (let i = 0; i < this.coins.length; i++) {

          if (this.coins[i].pairing_id == this.crypto.pairing_id) {
            let coinsbox = this.coins[i];
            // console.dir('this.crypto.pairing_id: ' + this.crypto.pairing_id);
            // console.dir('index in coins >>: ' + i);
            // console.dir('coinsbox >>> ' + coinsbox.priceofday[0].price)

            for (let j = 0; j < coinsbox.priceofday.length; j++) {
              console.dir(' coinsbox.priceofday: ' + coinsbox.priceofday[j].price);
              this.priceOfDay.push(+coinsbox.priceofday[j].price);
              this.nameCoin = coinsbox.secondary_currency;
              // console.dir('DDDD: ' + this.priceOfDay);
            }
          }

        }
        console.log('length ::: ' + this.priceOfDay.length);
        console.log('TYPE:' + typeof (this.priceOfDay[0]))
        this.showGraph(this.priceOfDay.reverse())
        let array = [1, 2, 3, 4, 5, 6, 7, 8];
        console.log(array.reverse());



        this.volumeBid = (+this.bids.volume)
        console.log(typeof this.volumeBid )
        this.volumeAsk = (+this.asks.volume)
        console.log(typeof this.volumeAsk)
        
        this.hightBid = (+this.bids.highbid)
        console.log(typeof this.hightBid)
        this.hightAsk = (+this.asks.highbid)


        // console.log('this.volumeBid:' + this.volumeBid + ' typeof:' + typeof this.volumeBid)

        this.volumeBid = this.decimalFormat(this.volumeBid);
        this.volumeAsk = this.decimalFormat(this.volumeAsk);
        this.hightBid = this.decimalFormat(this.hightBid);
        this.hightAsk = this.decimalFormat(this.hightAsk);

        // console.log('this.volumeBid:' + this.volumeBid + ' typeof:' + typeof this.volumeBid)


      })
  

  }
  

  goBack() {
    this.navCtrl.pop();
    // this.navCtrl.push(CoinsDetailPage,crypto);

  }


  reset() {
    var self = this;
    setTimeout(function () {
      self.state = false;
    }, 1000);
  }

  screenShot() {
    this.screenshot.save('jpg', 80).then(res => {
      this.screen = res.filePath;
      this.state = true;
      this.reset();
    });
  }


  ionViewDidLoad() {
    console.log("ionViewDidLoad")
  }

  decimalFormat(param){
    console.log('fecimal')
    if (param < 1) {
      param = param.toFixed(8);
      return param
    } else {
      param = param.toFixed(2);
      return param
    }
  }

  showGraph(data) {
    // ----


    Highcharts.createElement('link', {
      href: 'https://fonts.googleapis.com/css?family=Unica+One',
      rel: 'stylesheet',
      type: 'text/css'
    }, null, document.getElementsByTagName('head')[0]);

    Highcharts.theme = {
      colors: ['#F0B90B', '#F0B90B', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
          stops: [
            [0, '#151A1D'],
            [1, '#151A1D']
          ]
        },
        style: {
          fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#606063'
      },
      title: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '20px'
        }
      },
      subtitle: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase'
        }
      },
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3'

          }
        }
      },
      yAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#f4f4f4'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            color: '#B0B0B3'
          },
          marker: {
            lineColor: '#333'
          }
        },
        boxplot: {
          fillColor: '#505053'
        },
        candlestick: {
          lineColor: 'white'
        },
        errorbar: {
          color: 'white'
        }
      },
      legend: {
        itemStyle: {
          color: '#E0E0E3' //ชื่อด้านล่าง
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#606063'
        }


      },
      labels: {
        style: {
          color: '#707073'
        }
      },

      drilldown: {
        activeAxisLabelStyle: {
          color: '#F0F0F3'
        },
        activeDataLabelStyle: {
          color: '#F0F0F3'
        }
      },

      navigation: {
        buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
            fill: '#505053'
          }
        }
      },

      // scroll charts
      rangeSelector: {
        buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
            color: '#CCC'
          },
          states: {
            hover: {
              fill: '#707073',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#000003',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
        },
        labelStyle: {
          color: 'silver'
        }
      },

      navigator: {
        handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
        },
        xAxis: {
          gridLineColor: '#505053'
        }
      },

      scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
      },

      // special colors for some of the
      legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      background2: '#505053',
      dataLabelsColor: '#B0B0B3',
      textColor: '#C0C0C0',
      contrastTextColor: '#F0F0F3',
      maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);




    // -----
    var myChart = Highcharts.chart('container',
      {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: this.nameCoin + ' Bid to Asks rate over time'
        },
        style: {
          color: '#F0B90B',
          textTransform: 'uppercase',
          fontSize: '20px'

        },
        subtitle: {
          text: document.ontouchstart === undefined ?
            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: this.nameCoin + ' Exchange rate price'
          }
        },
        legend: {
          enabled: true
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, Highcharts.getOptions().colors[1]],
                [2, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
              ]
            },
            marker: {
              radius: 2
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },



        series: [{
          type: 'area',
          name: this.nameCoin + ' to USD',
          data: data

        }
        ]

      });

  }

}
