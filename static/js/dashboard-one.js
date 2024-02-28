'use strict'

document.addEventListener('DOMContentLoaded', function() {
  fetch('/sales-by-retailer/')
      .then(response => response.json())
      .then(data => {
          var ctx1 = document.getElementById('retailersBar').getContext('2d');
          new Chart(ctx1, {
              type: 'bar',
              data: {
                  labels: data.retailers, // Dynamically sets the labels from the backend data
                  datasets: [{
                      label: 'Total Sales',
                      data: data.sales, // Dynamically sets the dataset from the backend data
                      backgroundColor: '#66a4fb'
                  }]
              },
              options: {
                  maintainAspectRatio: false,
                  legend: {
                      display: false
                  },
                  scales: {
                      xAxes: [{
                          display: true, // Ensures the x-axis labels are displayed
                          barPercentage: 0.5
                      }],
                      yAxes: [{
                          gridLines: {
                              color: '#ebeef3'
                          },
                          ticks: {
                              fontColor: '#8392a5',
                              fontSize: 10,
                              // Auto-adjust the scale based on the dataset
                              beginAtZero: true // Ensures the scale starts at 0
                          }
                      }]
                  },
                  tooltips: {
                      enabled: true,
                      mode: 'index',
                      intersect: false,
                      callbacks: {
                          label: function(tooltipItems, data) {
                              return data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel.toLocaleString();
                          }
                      }
                  }
              }
          });
      })
      .catch(error => console.error('Error fetching sales data:', error));
});


document.addEventListener('DOMContentLoaded', function() {
  // Horizontal bar chart Sales Distribution by product category
  fetch('/sales_by_product/')
  .then(response => response.json())
  .then(data => {
    var ctx = document.getElementById('salesByProduct').getContext('2d');
    var chartBar = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Total Sales',
          data: data.data,
          backgroundColor: ['#65e0e0', '#69b2f8', '#6fd39b', '#f77eb9', '#fdb16d', '#b4bdce', '#c693f9']
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            display: false
          }
        },
        layout: {
          padding: {
            left: 5
          }
        },
        scales: {
          yAxes: [{
            gridLines: {
              display: false
            },
            barPercentage: 0.5,
            ticks: {
              beginAtZero:true,
              fontSize: 13,
              fontColor: '#182b49',
              fontFamily: 'IBM Plex Sans'
            }
          }],
          // xAxes: [{
          //   gridLines: {
          //     color: '#e5e9f2'
          //   },
          //   ticks: {
          //     beginAtZero: true,
          //     fontSize: 10,
          //     fontColor: '#182b49',
          //     max: 100
          //   }
          // }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              // let label = data.labels[tooltipItem.index] || '';
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += Number(tooltipItem.xLabel).toLocaleString();
              return label;
              // return data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel.toLocaleString();
            }
          }
        },
      }
    });
  })
  .catch(error => console.error('Error fetching sales by product data:', error));


});


$(function(){
  
// backgroundColor: '#65e0e0' green

        var optionpie = {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: false,
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        };


        fetch('/sales-by-method/')
        .then(response => response.json())
        .then(data => {
          var ctx2 = document.getElementById('salesDistribution');
          var myDonutChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
              labels: data.methods, // Use the methods from the backend
              datasets: [{
                data: data.sales, // Use the sales data from the backend
                backgroundColor: ['#f77eb9', '#7ebcff','#7ee5e5','#fdbd88']
              }]
            },
            options: optionpie
          });
        })
        .catch(error => console.error('Error loading the chart data: ', error));



        // Choropleth map
        var regionColors = {
          'Midwest': ['il', 'in', 'ia', 'ks', 'mi', 'mn', 'mo', 'ne', 'nd', 'oh', 'sd', 'wi'],
          'Northeast': ['ct', 'me', 'ma', 'nh', 'nj', 'ny', 'pa', 'ri', 'vt'],
          'South': ['de', 'fl', 'ga', 'md', 'nc', 'sc', 'va', 'dc', 'wv', 'al', 'ky', 'ms', 'tn', 'ar', 'la', 'ok', 'tx'],
          'Southeast': ['fl', 'ga', 'sc', 'nc', 'va'], // Note: States like FL are part of the broader South but can be specifically highlighted for Southeast if desired.
          'West': ['az', 'co', 'id', 'mt', 'nv', 'nm', 'ut', 'wy', 'ak', 'ca', 'hi', 'or', 'wa']
        };

        var colorsByRegion = {
          'West': '#f0ad4e', // Orange
          'Northeast': '#69b2f8', // Light Blue
          'South': '#b4bdce', // gray
          'Midwest': '#4caf50', // Green
          'Southeast': '#f10075' // Pink
        };

        var stateColors = {};
        for (var region in regionColors) {
          var states = regionColors[region];
          var color = colorsByRegion[region];
          states.forEach(function(state) {
            stateColors[state] = color;
          });
        }

        var stateToRegion = {};
        for (var region in regionColors) {
          regionColors[region].forEach(function(state) {
            stateToRegion[state.toUpperCase()] = region; // Ensure state codes are uppercase to match jqvmap's format
          });
        }
        
        $('#vmap').vectorMap({
          map: 'usa_en',
          showTooltip: true,
          backgroundColor: '#fff',
          color: '#d1e6fa',
          colors: stateColors,
          selectedColor: '#00cccc',
          enableZoom: true,
          borderWidth: 1,
          borderColor: '#fff',
          hoverOpacity: .85,
          onLabelShow: function(event, label, code) {
            // Find the region for this state
            var region = stateToRegion[code.toUpperCase()] || 'Unknown Region';
            // Modify the label to include the region
            label.html(label.html() + '<br>Region: ' + region);
          }
        });












  var flot1 = $.plot('#flotChart', [{
    data: df3,
    color: '#69b2f8'
  },{
    data: df1,
    color: '#d1e6fa'
  },{
    data: df2,
    color: '#d1e6fa',
    lines: {
      fill: false,
      lineWidth: 1.5
    }
  }], {
    series: {
      stack: 0,
      shadowSize: 0,
      lines: {
        show: true,
        lineWidth: 0,
        fill: 1
      }
    },
    grid: {
      borderWidth: 0,
      aboveData: true
    },
    yaxis: {
      show: false,
      min: 0,
      max: 350
    },
    xaxis: {
      show: true,
      ticks: [[0,''],[8,'Jan'],[20,'Feb'],[32,'Mar'],[44,'Apr'],[56,'May'],[68,'Jun'],[80,'Jul'],[92,'Aug'],[104,'Sep'],[116,'Oct'],[128,'Nov'],[140,'Dec']],
      color: 'rgba(255,255,255,.2)'
    }
  });


  var flot2 = $.plot('#flotChart2', [{
    data: [[0,55],[1,38],[2,20],[3,70],[4,50],[5,15],[6,30],[7,50],[8,40],[9,55],[10,60],[11,40],[12,32],[13,17],[14,28],[15,36],[16,53],[17,66],[18,58],[19,46]],
    color: '#69b2f8'
  },{
    data: [[0,80],[1,80],[2,80],[3,80],[4,80],[5,80],[6,80],[7,80],[8,80],[9,80],[10,80],[11,80],[12,80],[13,80],[14,80],[15,80],[16,80],[17,80],[18,80],[19,80]],
    color: '#f0f1f5'
  }], {
    series: {
      stack: 0,
      bars: {
        show: true,
        lineWidth: 0,
        barWidth: .5,
        fill: 1
      }
    },
    grid: {
      borderWidth: 0,
      borderColor: '#edeff6'
    },
    yaxis: {
      show: false,
      max: 80
    },
    xaxis: {
      ticks:[[0,'Jan'],[4,'Feb'],[8,'Mar'],[12,'Apr'],[16,'May'],[19,'Jun']],
      color: 'rgba(255,255,255,0)',
    }
  });

  $.plot('#flotChart3', [{
      data: df4,
      color: '#9db2c6'
    }], {
    series: {
      shadowSize: 0,
      lines: {
        show: true,
        lineWidth: 2,
        fill: true,
        fillColor: { colors: [ { opacity: 0 }, { opacity: .5 } ] }
      }
    },
    grid: {
      borderWidth: 0,
      labelMargin: 0
    },
    yaxis: {
      show: false,
      min: 0,
      max: 60
    },
    xaxis: { show: false }
  });

  $.plot('#flotChart4', [{
      data: df5,
      color: '#9db2c6'
    }], {
    series: {
      shadowSize: 0,
      lines: {
        show: true,
        lineWidth: 2,
        fill: true,
        fillColor: { colors: [ { opacity: 0 }, { opacity: .5 } ] }
      }
    },
    grid: {
      borderWidth: 0,
      labelMargin: 0
    },
    yaxis: {
      show: false,
      min: 0,
      max: 80
    },
    xaxis: { show: false }
  });

  $.plot('#flotChart5', [{
      data: df6,
      color: '#9db2c6'
    }], {
    series: {
      shadowSize: 0,
      lines: {
        show: true,
        lineWidth: 2,
        fill: true,
        fillColor: { colors: [ { opacity: 0 }, { opacity: .5 } ] }
      }
    },
    grid: {
      borderWidth: 0,
      labelMargin: 0
    },
    yaxis: {
      show: false,
      min: 0,
      max: 80
    },
    xaxis: { show: false }
  });

  // $.plot('#flotChart6', [{
  //     data: df4,
  //     color: '#9db2c6'
  //   }], {
  //   series: {
  //     shadowSize: 0,
  //     lines: {
  //       show: true,
  //       lineWidth: 2,
  //       fill: true,
  //       fillColor: { colors: [ { opacity: 0 }, { opacity: .5 } ] }
  //     }
  //   },
  //   grid: {
  //     borderWidth: 0,
  //     labelMargin: 0
  //   },
  //   yaxis: {
  //     show: false,
  //     min: 0,
  //     max: 60
  //   },
  //   xaxis: { show: false }
  // });




  var ctxLabel = ['6am', '10am', '1pm', '4pm', '7pm', '10pm'];
  var ctxData1 = [20, 60, 50, 45, 50, 60];
  var ctxData2 = [10, 40, 30, 40, 55, 25];

  // Bar chart
  var ctx1 = document.getElementById('chartBar1').getContext('2d');
  var chartBar = new Chart(ctx1, {
    type: 'horizontalBar',
    data: {
      labels: ctxLabel,
      datasets: [{
        data: ctxData1,
        backgroundColor: '#69b2f8'
      }, {
        data: ctxData2,
        backgroundColor: '#d1e6fa'
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
        labels: {
          display: false
        }
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            display: false,
            beginAtZero: true,
            fontSize: 10,
            fontColor: '#182b49'
          }
        }],
        xAxes: [{
          gridLines: {
            display: true,
            color: '#eceef4'
          },
          barPercentage: 0.6,
          ticks: {
            beginAtZero: true,
            fontSize: 10,
            fontColor: '#8392a5',
            max: 80
          }
        }]
      }
    }
  });

  window.darkMode = function(){
    var s1 = flot1.getOptions();
    s1.xaxes[0].tickColor = 'rgba(255,255,255,.05)';
    flot1.setupGrid();
    flot1.draw();

    var s2 = flot2.getData();
    s2[1].color = '#141c2b';
    flot2.setData(s2);
    flot2.draw();

    chartBar.options.scales.xAxes[0].gridLines.color = 'rgba(255,255,255,.06)';
    chartBar.update();

    $('.btn-white').addClass('btn-dark').removeClass('btn-white');
    $('#vmap').vectorMap('set', 'backgroundColor', '#1c273c');
  }

  window.lightMode = function() {
    var s1 = flot1.getOptions();
    s1.xaxes[0].tickColor = 'rgba(255,255,255,.2)';
    flot1.setupGrid();
    flot1.draw();

    var s2 = flot2.getData();
    s2[1].color = '#f0f1f5';
    flot2.setData(s2);
    flot2.draw();

    chartBar.options.scales.xAxes[0].gridLines.color = '#eceef4';
    chartBar.update();

    $('.btn-dark').addClass('btn-white').removeClass('btn-dark');
    $('#vmap').vectorMap('set', 'backgroundColor', '#fff');
  }

  // var hasMode = Cookies.get('df-mode');
  // if(hasMode === 'dark') {
  //   darkMode();
  // } else {
  //   lightMode();
  // }
})
