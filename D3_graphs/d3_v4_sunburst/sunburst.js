///////////////////// Initial Data ////////////////////////
var shares = {"track1":{"artist":0.5,
                        "distr_label":0.5},
                "track2":{"artist":0.6,
                        "distr_label":0.4},
                "track3":{"artist":0.75,
                        "distr_label":0.25},
                "track4":{"artist":0.6,
                        "distr_label":0.4}
            };

var streams = {"track1":600000,
                "track2":300000,
                "track3":1000000,
                "track4":60000,
            };
//////////////////////////////////////////////////////////

/////// Helper HTML to data functions ////////////

//Work out distribution of streams across all 3 "other" tracks. 
var total_streams_to_streams = function(total_other_streams){
  var total_other_streams_before = streams['track2'] + streams['track3'] + streams['track4']
  for (const property in streams){
    if (property!='track1'){
        var other_streams_ratio = streams[property]/total_other_streams_before;
        streams[property] = total_other_streams*other_streams_ratio;
    }
  }
}
///////////////////// Initialise HTML interaction elements ////////////////////////

var log_slider = function(position,minv=1000,maxv=100000000){
    //The HTML slider position is 0 to 100
    var minp = 0;
    var maxp = 100;

    // The result should be between 100 an 10000000
    var minv_log = Math.log(minv);
    var maxv_log = Math.log(maxv);

    // calculate adjustment factor
    var scale = (maxv_log-minv_log) / (maxp-minp);

    return Math.round(Math.exp(minv_log + scale*(position-minp)));
}

// Get Initial values from the HTML slider. 
var dsp_revenue = d3.select("#DSPrevenue").property("value"); 
    total_other_streams = log_slider(d3.select("#TotalOtherStreams").property("value"), minv=1000,maxv=100000000);
    track_streams = log_slider(d3.select("#Trackstreams").property("value"), minv=1000,maxv=100000000);
    artist_share = d3.select("#Artistshare").property("value")/100;
    // Set pie Width (and therefore diameter) based on DSP revenue
    // pieWidth = dsp_revenue/100 * maxRadius/3;

var init_html_values = function() {
    //Initialise the values to be displayed next to the HTML sliders. 
    d3.select("#DSPrevenue-value").text(dsp_revenue);
    d3.select("#TotalOtherStreams-value").text(total_other_streams);
    d3.select("#Trackstreams-value").text(track_streams);
    d3.select("#Artistshare-value").text(artist_share);
}

init_html_values()

// update default values with default from HTML sliders
streams['track1'] = track_streams;
shares['track1']['artist'] = artist_share;
shares['track1']['distr_label'] = 1 - artist_share;
total_streams_to_streams(total_other_streams)
console.log("initial streams",streams)
console.log("initial shares", shares)

//////////////////////////////////////////////////////////////////////////////////////////

var generate_data_dict = function(){
    // Generate a hierarchical data dict from user inputs, to be used to plot pie chart.
    var data = {"name":"Royalties",
                "children":[]}
    //Calculate total streams
    var total_streams = Object.values(streams).reduce((a, b) => a + b, 0)
    console.log("total streams",total_streams)
    // Construct data object
    for (const property in streams){
        var track_popupation = 100*streams[property]/total_streams
        var track_data = {"name":property,
                          "children":[{"name":"Artist",
                                        "value":shares[property]["artist"]*track_popupation},
                                        {"name":"Distr/Label",
                                        "value":shares[property]["distr_label"]*track_popupation}
                                    ]
                        }
        data["children"].push(track_data)
    }
    return data
}

var data = generate_data_dict()

console.log("sunburst data",data)

var width = 500;
var height = 500;
var radius = (dsp_revenue/100) * Math.min(width, height) / 2 ;
// var color = d3.scaleOrdinal(d3.schemeSet2);
var color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]);

// var color = d3.scaleOrdinal(d3.schemeCategory20b);

var drawChart = function(data) {
    // Create primary <g> element
    var g = d3.select("#interactive_sunburst")
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Data strucure
    var partition = d3.partition()
        .size([2 * Math.PI, radius]);
    // Find data root
    var root = d3.hierarchy(data)
        .sum(function (d) { return d.value});

    // Size arcs
    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    // Put it all together
    g.selectAll('path')
        .data(root.descendants())
        .enter().append('path')
        .attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill",  function (d) { 
            if (d.children){
              return color(d.data.name)
            }
            else {
              console.log("ELSE",d)
              var parent_color = d3.hsl(color(d.parent.data.name))
              if (d.data.name=="Artist") {
                console.log("Artist parent color", parent_color)
                var artist_colour = parent_color
                // artist_colour['h'] = artist_colour['h'] + 10;
                // artist_colour['s'] += 0.2
                // artist_colour['l'] += 0.1
                return artist_colour;
              }
              else { 
                console.log("Not Artist")
                var distrib_colour = parent_color
                // dsp_colour['h'] = dsp_colour['h'] + 5;
                // dsp_colour['s'] += 0.3
                distrib_colour['l'] += 0.15
                return distrib_colour;
              }
            }
          });

    console.log("DRAW")
}

var updateChart = function(data) {

    var g = d3.selectAll("#interactive_sunburst")
              .select("g")
    // Data strucure
    var partition = d3.partition()
        .size([2 * Math.PI, radius]);

    // Find data root
    var root = d3.hierarchy(data)
        .sum(function (d) { return d.value});

    // Size arcs
    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    // Put it all together
    path = g.selectAll('path').data(root.descendants())
    // paths.selectAll('path')
    path.attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill", function (d) { 
          if (d.children){
            return color(d.data.name)
          }
          else {
            console.log("ELSE",d)
            var parent_color = d3.hsl(color(d.parent.data.name))
            if (d.data.name=="Artist") {
              console.log("Artist parent color", parent_color)
              var artist_colour = parent_color
              // artist_colour['h'] = artist_colour['h'] + 10;
              // artist_colour['s'] += 0.2
              // artist_colour['l'] += 0.1
              return artist_colour;
            }
            else { 
              console.log("Not Artist")
              var distrib_colour = parent_color
              // dsp_colour['h'] = dsp_colour['h'] + 5;
              // dsp_colour['s'] += 0.3
              distrib_colour['l'] += 0.15
              return distrib_colour;
            }
          }
        });

    console.log('DRAW UPDATE')
    // console.log('Pie Widht',pieWidth)
}


/////////////////////// Initialise Chart /////////////////////////////

drawChart(data);

/////////////////////////////////////////////////////////////////////


///////////////////// Update Page based on user input //////////////

// DSP revenue update
d3.select("#DSPrevenue").on("input", function() {
    // adjust the text on the range slider
    dsp_revenue = +this.value;
  d3.select("#DSPrevenue-value").text(dsp_revenue);
  d3.select("#DSPrevenue").property("value", dsp_revenue);
  radius = (dsp_revenue/100) * Math.min(width, height) / 2;
  // console.log("radius", radius)
  updateChart(data);
  
});


// Total other streams update
d3.select("#TotalOtherStreams").on("input", function() {
    // adjust the text on the range slider
    total_other_streams = log_slider(+this.value, minv=1000,maxv=100000000);
  d3.select("#TotalOtherStreams-value").text(total_other_streams);
  d3.select("#TotalOtherStreams").property("value", +this.value);

  total_streams_to_streams(total_other_streams)

  // console.log("total other streams",total_other_streams)
  // console.log("streams",streams)
  // console.log("data",data)
  data = generate_data_dict();
  updateChart(data);
});


// Track streams update
d3.select("#Trackstreams").on("input", function() {
    // adjust the text on the range slider
    track_streams = log_slider(+this.value, minv=1000,maxv=100000000);
  d3.select("#Trackstreams-value").text(track_streams);
  d3.select("#Trackstreams").property("value", +this.value);
  streams['track1'] = track_streams;
  // console.log("track streams",track_streams)
  // console.log("streams",streams)
  // console.log("data",data)
  data = generate_data_dict();
  updateChart(data);
});

// Artist share update
d3.select("#Artistshare").on("input", function() {
    // adjust the text on the range slider
    artist_share = +this.value/100;
  d3.select("#Artistshare-value").text(+this.value);
  d3.select("#Artistshare").property("value", +this.value);
  shares['track1']['artist'] = artist_share;
  shares['track1']['distr_label'] = 1 - artist_share;
  // console.log("artist share",artist_share)
  // console.log("data",data)
  data = generate_data_dict();
  updateChart(data);
});

















