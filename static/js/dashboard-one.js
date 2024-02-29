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



document.addEventListener('DOMContentLoaded', function() {
  fetch('/sales_by_state/')
    .then(response => response.json())
    .then(data => {
      var ctx = document.getElementById('chartBarX').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.states, // States names from the backend
          datasets: [{
            label: 'Total Sales',
            data: data.sales, // Sales data from the backend
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
              display: true, // Changed to true to display state names
              barPercentage: 0.7,
              gridLines: {
                display: false // Hide vertical gridlines
              },
            }],
            yAxes: [{
              gridLines: {
                color: '#ebeef3'
              },
              ticks: {
                fontColor: '#8392a5',
                fontSize: 10,
                beginAtZero: true // Ensure y-axis starts at 0
              }
            }]
          }
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
      });
    })
    .catch(error => console.error('Error fetching sales by state data:', error));
});






$(function(){

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

        $.get('/sales_trends/', function(data) {
          $.plot('#flotCrosshair', [{
              data: data.total_sales_data,
              color: '#00275e' // black line for total sales
          }, {
              data: data.operating_profit_data,
              color: '#0168fa' // blue line for operating profit
          }], {
            series: {
              lines: {
                show: true,
                lineWidth: 2
              },
              shadowSize: 0
            },
            crosshair: {
              mode: 'xy'
            },
            grid: {
              hoverable: true,
              clickable: true,
              borderColor: '#ddd',
              borderWidth: 0,
              labelMargin: 5
            },
            // yaxis: {
            //   max: 120,
            //   tickColor: '#edeff6',
            //   ticks: 6,
            //   font: {
            //     color: '#001737',
            //     size: 10
            //   }
            // },
            xaxis: {
              // min: 0,
              // max: 100,
              // tickColor: '#edeff6',
              // font: {
              //   color: '#001737',
              //   size: 10
              // }
              ticks: data.ticks,
            }
          });
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
})
