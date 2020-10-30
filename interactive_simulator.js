///////////////////// Initial Data ////////////////////////
var width = 500;
var height = 500;
var margin_rect = {top: 20, right: 20, bottom: 40, left: 60};
var rect_scale_ends = {x_min:0, x_max:100, y_min:0, y_max:100};

var shares = {"track1":{"artist":0.5,
                        "distr_label":0.5}
            };

var streams = {"track1":600000,
               "other_tracks":2000000,
            };

var dsp_revenue = 70;

var data_rect = {"other_tracks":{"label":"other_tracks",
                          "share_of_streams":55,
                          "dsp_revenue":dsp_revenue,
                          "annotation":"Other Tracks",
                          "color":"#000000",
                          "color_highlight":'#363636',
                          "opacity":0.5,
                          "opacity_highlight":0.3},
                "artist_share":{"label":"artist_share",
                          "share_of_streams":45,
                          "share":0.8,
                          "dsp_revenue":dsp_revenue,
                          "annotation":"Artist",
                          "color":"#38588c",
                          "color_highlight":'#6bff53',
                          "opacity":0.7,
                          "opacity_highlight":0.4},
                "dist_share":{"label":"distributor_share",
                          "share_of_streams":45,
                          "share":0.2,
                          "dsp_revenue":dsp_revenue,
                          "annotation":"Dist/Label",
                          "color":"#7c95bd",
                          "color_highlight":'#6bff53',
                          "opacity":0.7,
                          "opacity_highlight":0.4}
              }

var rect_rendering_options = {"y_axis":true,
                              "y_axis_ticks":false,
                              "annotations":true}
//////////////////////////////////////////////////////////


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
    total_other_streams = log_slider(d3.select("#TotalOtherStreams").property("value"), minv=1000,maxv=10000000000);
    track_streams = log_slider(d3.select("#Trackstreams").property("value"), minv=1000,maxv=10000000000);
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
streams['other_tracks'] = total_other_streams;
shares['track1']['artist'] = artist_share;
shares['track1']['distr_label'] = 1 - artist_share;
// total_streams_to_streams(total_other_streams)
console.log("initial streams",streams)
console.log("initial shares", shares)
console.log("initial other streams",total_other_streams)
///////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////// Drawing helper functions //////////////////////////////////////////////////////

function get_rect_centroid(rect_id){
  // Get centroid from an existing rectangle. Done by directly looking up the svg object.
  var rect = svg_rect.select(rect_id)
  var rect_x = parseFloat(rect.attr("x"));
  var rect_y = parseFloat(rect.attr("y"));
  var rect_width = parseFloat(rect.attr("width"));
  var rect_height = parseFloat(rect.attr("height"));
  return [rect_x+rect_width/2, rect_y+rect_height/2]
}
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////// Make Rect chart //////////////////////////////////////////////
var svg_rect = d3.select("#interactive_sunburst")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin_rect.left + "," + margin_rect.top + ")");

function draw_rect(data, rect_rendering_options){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });
    console.log("data",data);
    console.log("data_rect_values",data_rect_values)
    // Set scales
    var x = d3.scaleLinear()
              .domain([rect_scale_ends.x_min, rect_scale_ends.x_max])
              .range([0, width - margin_rect.right - margin_rect.left]);

    var y = d3.scaleLinear()
              .domain([rect_scale_ends.y_min, rect_scale_ends.y_max])
              .range([height - margin_rect.top - margin_rect.bottom, 0]);

    // Set dimensions of legend
    var legendRectSize = 18; 
    var legendSpacing = 4;
    var legend_x = x(75);
    var legend_y = y(85);

    // Add X axis
    svg_rect
      .append("g")
      .attr("transform", "translate(0," + (height - margin_rect.top - margin_rect.bottom) + ")")
      .call(d3.axisBottom(x));

    // Add X axis label:
    svg_rect.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width - margin_rect.left - margin_rect.right)/2 )
        .attr("y", height - margin_rect.top - 0.1*margin_rect.bottom)
        .text("Share of streams (%)");

    // Add Y axis
    if (rect_rendering_options.y_axis==true){
      svg_rect
        .append("g")
        .call(d3.axisLeft(y).tickValues([]));
      
      // Y axis label:
      svg_rect.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin_rect.left + 40)
          .attr("x", -margin_rect.top - 150)
          .text("DSP Revenue")
    }

    // Draw other tracks rectangle
    svg_rect
      .append("rect")
        .attr("x", x(rect_scale_ends.x_min) )
        .attr("y",y(data.other_tracks.dsp_revenue))
        .attr("width", x(data.other_tracks.share_of_streams) )
        .attr("height", y(rect_scale_ends.y_max-data.other_tracks.dsp_revenue)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
        .attr("id",data.other_tracks.label)
        .style("fill", data.other_tracks.color)
        .style("fill-opacity", data.other_tracks.opacity)
        // .style("stroke", "#5c5b5b")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.other_tracks.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.other_tracks.opacity);
        })

    // Draw Distributor share rectangle
    svg_rect
      .append("rect")
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.dist_share.dsp_revenue * (1 - data.artist_share.share)))
        .attr("width", x(data.dist_share.share_of_streams) )
        .attr("height", y(rect_scale_ends.y_max-data.dist_share.dsp_revenue*data.dist_share.share))
        .attr("id","distributor_share")
        .style("fill", data.dist_share.color)
        .style("fill-opacity", data.dist_share.opacity)
        // .style("stroke", "#b8211c")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity',data.dist_share.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.dist_share.opacity);
        })

    // Draw Artist share rectangle
    svg_rect
      .append("rect")
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.artist_share.dsp_revenue))
        .attr("width", x(data.artist_share.share_of_streams) )
        .attr("height", y(rect_scale_ends.y_max-data.artist_share.dsp_revenue*data.artist_share.share))
        .attr("id","artist_share")
        .style("fill", data.artist_share.color)
        .style("fill-opacity", data.artist_share.opacity)
        // .style("stroke", "#b8211c")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity',data.artist_share.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.artist_share.opacity);
        })

    // Add text to the rectangles 
    if (rect_rendering_options.annotations==true){
      //Remove the text if it already exists (so that it does not get added twice)
      svg_rect.selectAll(".annotations").remove()
      //Add text
      var annotations = svg_rect.selectAll('.annotations')
          .data(data_rect_values)
          .enter()
          .append('g')
          .attr('class','annotations')
          .attr('transform', function(d){
            var centroid = get_rect_centroid("#"+d.label);
            return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
          });

      annotations.append('text')
              .text(function(d){return d.annotation})
              .style('fill',"#ffffff")
              .attr('text-anchor','middle')
              .attr('dominant-baseline','central')
              .attr('x',)
    }   

    if (rect_rendering_options.annotations==false){
      svg_rect.selectAll(".annotations").remove()
    }

    // // Set Legend
    // var legend = svg_rect.selectAll('.legend')                     
    //           .data(data_rect_values)                                   
    //           .enter()                                                
    //           .append('g')                                            
    //           .attr('class', 'legend')                                
    //           .attr('transform', function(d, i) {                   
    //             var height = legendRectSize + legendSpacing;       
    //             var offset =  height * data_rect_values.length / 2;   
    //             var horz = -2 * legendRectSize + legend_x;                       
    //             var vert = i * height - offset + legend_y;                       
    //             return 'translate(' + horz + ',' + vert + ')';       
    //           });                                                    

    //         legend.append('rect')                                  
    //           .attr('width', legendRectSize)                        
    //           .attr('height', legendRectSize)                         
    //           .style('fill', function(d){return d.color;})
    //           .style('opacity',function(d){return d.opacity;})                
    //           // .style('stroke', color);                              
              
    //         legend.append('text')                                     
    //           .attr('x', legendRectSize + legendSpacing)            
    //           .attr('y', legendRectSize - legendSpacing)             
    //           .text(function(d) { return d.label; });
  }



draw_rect(data_rect,rect_rendering_options)

function update_rect(data){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });
    // Set scales
    var x = d3.scaleLinear()
              .domain([rect_scale_ends.x_min, rect_scale_ends.x_max])
              .range([0, width - margin_rect.right - margin_rect.left]);

    var y = d3.scaleLinear()
              .domain([rect_scale_ends.y_min, rect_scale_ends.y_max])
              .range([height - margin_rect.top - margin_rect.bottom, 0]);

    // Update other tracks rectangle
    var other_rect = svg_rect.selectAll("#other_tracks");
    other_rect
        .attr("x", x(rect_scale_ends.x_min) )
        .attr("y",y(data.other_tracks.dsp_revenue))
        .attr("width", x(data.other_tracks.share_of_streams) )
        .attr("height", y(rect_scale_ends.y_max-data.other_tracks.dsp_revenue)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
        .attr("id",data.other_tracks.label)
        .style("fill", data.other_tracks.color)
        .style("fill-opacity", data.other_tracks.opacity)
        // .style("stroke", "#5c5b5b")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.other_tracks.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.other_tracks.opacity);
        })

    // Update Distributor share rectangle
    var dist_rect = svg_rect.selectAll("#distributor_share");
    dist_rect
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.dist_share.dsp_revenue * (1 - data.artist_share.share)))
        .attr("width", x(data.dist_share.share_of_streams) )
        .attr("height", y(rect_scale_ends.y_max-data.dist_share.dsp_revenue*data.dist_share.share))
        .attr("id","distributor_share")
        .style("fill", data.dist_share.color)
        .style("fill-opacity", data.dist_share.opacity)
        // .style("stroke", "#b8211c")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity',data.dist_share.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.dist_share.opacity);
        })

    // Update Artist share rectangle
    var artist_rect = svg_rect.selectAll("#artist_share");
    artist_rect
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.artist_share.dsp_revenue))
        .attr("width", x(data.artist_share.share_of_streams) )
        .attr("height", y(rect_scale_ends.y_max-data.artist_share.dsp_revenue*data.artist_share.share))
        .attr("id","artist_share")
        .style("fill", data.artist_share.color)
        .style("fill-opacity", data.artist_share.opacity)
        // .style("stroke", "#b8211c")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity',data.artist_share.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.artist_share.opacity);
        })

    // Update annotations
    if (rect_rendering_options.annotations==true){
      //Add text
      var annotations = svg_rect.selectAll('.annotations')
          .data(data_rect_values)
          .attr('transform', function(d){
            var centroid = get_rect_centroid("#"+d.label);
            return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
          });
    }   

    if (rect_rendering_options.annotations==false){
      svg_rect.selectAll(".annotations").remove()
    }

  }


//////////////////////////////////////////////////////////////////////////////////////////

// var generate_data_dict = function(){
//     // Generate a hierarchical data dict from user inputs, to be used to plot pie chart.
//     var data = {"name":"Royalties",
//                 "children":[]}
//     //Calculate total streams
//     var total_streams = Object.values(streams).reduce((a, b) => a + b, 0)
//     console.log("total streams",total_streams)
//     // Construct data object
//     for (const property in streams){
//         var track_popupation = 100*streams[property]/total_streams
//         if (property=="track1"){
//           var track_data = {"name":property,
//                             "children":[{"name":"Artist",
//                                           "value":shares[property]["artist"]*track_popupation},
//                                           {"name":"Distr/Label",
//                                           "value":shares[property]["distr_label"]*track_popupation}
//                                       ]
//                           }
//         }
//         else {
//           track_data = {"name":property,
//                         "value":track_popupation}
//         }
//         data["children"].push(track_data)
//     }
//     return data
//   }

// var data = generate_data_dict()

// console.log("sunburst data",data)

// var width = 500;
// var height = 500;
// var radius = (dsp_revenue/100) * Math.min(width, height) / 2 ;
// // var color = d3.scaleOrdinal(d3.schemeSet2);
// var color = d3.scaleOrdinal(["#848484","#7c95bd","#848484","#848484","#848484","#ffd92f","#e5c494","#b3b3b3"]);

// // var color = d3.scaleOrdinal(d3.schemeCategory20b);

// var drawChart = function(data) {
//     // Create primary <g> element
//     var g = d3.select("#interactive_sunburst")
//         .append('svg')
//         .attr('width', width)
//         .attr('height', height)
//         .append('g')
//         .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

//     // Data strucure
//     var partition = d3.partition()
//         .size([2 * Math.PI, radius]);
//     // Find data root
//     var root = d3.hierarchy(data)
//         .sum(function (d) { return d.value});

//     // Size arcs
//     partition(root);
//     var arc = d3.arc()
//         .startAngle(function (d) { return d.x0 })
//         .endAngle(function (d) { return d.x1 })
//         .innerRadius(function (d) { return d.y0 })
//         .outerRadius(function (d) { return d.y1 });

//     // Put it all together
//     g.selectAll('path')
//         .data(root.descendants())
//         .enter().append('path')
//         .attr("display", function (d) { return d.depth ? null : "none"; })
//         .attr("d", arc)
//         .style('stroke', '#fff')
//         .style("fill",  function (d) { 
//             if (d.children){
//               return color(d.data.name)
//             }
//             else {
//               console.log("ELSE",d)
//               var parent_color = d3.hsl(color(d.parent.data.name))
//               if (d.data.name=="Artist") {
//                 console.log("Artist parent color", parent_color)
//                 var artist_colour = parent_color
//                 // artist_colour['h'] = artist_colour['h'] + 10;
//                 // artist_colour['s'] += 0.2
//                 // artist_colour['l'] += 0.1
//                 return artist_colour;
//               }
//               else { 
//                 console.log("Not Artist")
//                 var distrib_colour = parent_color
//                 // dsp_colour['h'] = dsp_colour['h'] + 5;
//                 // dsp_colour['s'] += 0.3
//                 distrib_colour['l'] += 0.15
//                 return distrib_colour;
//               }
//             }
//           });

//     console.log("DRAW")
// }

// var updateChart = function(data) {

//     var g = d3.selectAll("#interactive_sunburst")
//               .select("g")
//     // Data strucure
//     var partition = d3.partition()
//         .size([2 * Math.PI, radius]);

//     // Find data root
//     var root = d3.hierarchy(data)
//         .sum(function (d) { return d.value});

//     // Size arcs
//     partition(root);
//     var arc = d3.arc()
//         .startAngle(function (d) { return d.x0 })
//         .endAngle(function (d) { return d.x1 })
//         .innerRadius(function (d) { return d.y0 })
//         .outerRadius(function (d) { return d.y1 });

//     // Put it all together
//     path = g.selectAll('path').data(root.descendants())
//     // paths.selectAll('path')
//     path.attr("display", function (d) { return d.depth ? null : "none"; })
//         .attr("d", arc)
//         .style('stroke', '#fff')
//         .style("fill", function (d) { 
//           if (d.children){
//             return color(d.data.name)
//           }
//           else {
//             // console.log("ELSE",d)
//             var parent_color = d3.hsl(color(d.parent.data.name))
//             if (d.data.name=="Artist") {
//               // console.log("Artist parent color", parent_color)
//               var artist_colour = parent_color
//               // artist_colour['h'] = artist_colour['h'] + 10;
//               // artist_colour['s'] += 0.2
//               // artist_colour['l'] += 0.1
//               return artist_colour;
//             }
//             else { 
//               // console.log("Not Artist")
//               var distrib_colour = parent_color
//               // dsp_colour['h'] = dsp_colour['h'] + 5;
//               // dsp_colour['s'] += 0.3
//               distrib_colour['l'] += 0.15
//               return distrib_colour;
//             }
//           }
//         });

//     console.log('DRAW UPDATE')
//     // console.log('Pie Widht',pieWidth)
// }


// /////////////////////// Initialise Chart /////////////////////////////

// // drawChart(data);

// /////////////////////////////////////////////////////////////////////


///////////////////// Update Page based on user input //////////////

// DSP revenue update
d3.select("#DSPrevenue").on("input", function() {
    // adjust the text on the range slider
    dsp_revenue = +this.value;
  d3.select("#DSPrevenue-value").text(dsp_revenue);
  d3.select("#DSPrevenue").property("value", dsp_revenue);
  // console.log("radius", radius)
  data_rect.other_tracks.dsp_revenue = dsp_revenue;
  data_rect.dist_share.dsp_revenue = dsp_revenue;
  data_rect.artist_share.dsp_revenue = dsp_revenue;
  update_rect(data_rect);
  
});


// Total other streams update
d3.select("#TotalOtherStreams").on("input", function() {
    // adjust the text on the range slider
    total_other_streams = log_slider(+this.value, minv=1000,maxv=100000000);
  d3.select("#TotalOtherStreams-value").text(total_other_streams);
  d3.select("#TotalOtherStreams").property("value", +this.value);

  var total_streams = total_other_streams + track_streams;
  var track_share_of_streams = 100*track_streams/total_streams;
  var other_share_of_streams = 100*total_other_streams/total_streams;
  
  data_rect.other_tracks.share_of_streams = other_share_of_streams;
  data_rect.dist_share.share_of_streams = track_share_of_streams;
  data_rect.artist_share.share_of_streams = track_share_of_streams;
  
  update_rect(data_rect);
});


// Track streams update
d3.select("#Trackstreams").on("input", function() {
    // adjust the text on the range slider
    track_streams = log_slider(+this.value, minv=1000,maxv=100000000);
  d3.select("#Trackstreams-value").text(track_streams);
  d3.select("#Trackstreams").property("value", +this.value);
  
  var total_streams = total_other_streams + track_streams;
  var track_share_of_streams = 100*track_streams/total_streams;
  var other_share_of_streams = 100*total_other_streams/total_streams;
  
  data_rect.other_tracks.share_of_streams = other_share_of_streams;
  data_rect.dist_share.share_of_streams = track_share_of_streams;
  data_rect.artist_share.share_of_streams = track_share_of_streams;

  update_rect(data_rect);
});

// Artist share update
d3.select("#Artistshare").on("input", function() {
    // adjust the text on the range slider
    artist_share = +this.value/100;
  d3.select("#Artistshare-value").text(+this.value);
  d3.select("#Artistshare").property("value", +this.value);
  
  data_rect.artist_share.share = artist_share;
  data_rect.dist_share.share = 1 - artist_share;
  
  update_rect(data_rect);
});

















