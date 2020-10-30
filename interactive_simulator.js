///////////////////// Initial Data ////////////////////////
var width = 700;
var height = 500;
var margin_rect = {top: 20, right: 200, bottom: 40, left: 60};
var rect_scale_ends = {x_min:0, x_max:100, y_min:0, y_max:100};

var margin_pile = {top: 20, right: 20, bottom: 40, left: 600};


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

var data_pile = {"label":"cash_pile",
                "annotation":"Artist $$",
                "color":"#39792f",
                "color_highlight":'#363636',
                "opacity":0.5,
                "opacity_highlight":0.3}

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

function get_artist_cash(){
  return dsp_revenue*data_rect.artist_share.share_of_streams*data_rect.artist_share.share/100
}

//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////// Make Rect chart //////////////////////////////////////////////
var svg_rect = d3.select("#interactive_sunburst")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("id", "rev_share")
        .attr("transform", "translate(" + margin_rect.left + "," + margin_rect.top + ")");


var svg_pile = d3.select("#interactive_sunburst").select("svg")
      .append("g")
        .attr("id", "cash_pile")
        .attr("transform", "translate(" + margin_pile.left + "," + margin_pile.top + ")");

draw_rect(data_rect,rect_rendering_options)

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
  }


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



//////////////////////////////////// Make Artist Cash Pile //////////////////////////////

function draw_pile(data){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });

    // Set scales
    var x = d3.scaleLinear()
              .domain([rect_scale_ends.x_min, rect_scale_ends.x_max])
              .range([0, width - margin_pile.right - margin_pile.left]);

    var y = d3.scaleLinear()
              .domain([rect_scale_ends.y_min, rect_scale_ends.y_max])
              .range([height - margin_pile.top - margin_pile.bottom, 0]);

    var artist_cash = get_artist_cash();


    // Add X axis
    svg_pile
      .append("g")
      .attr("transform", "translate(0," + (height - margin_pile.top - margin_pile.bottom) + ")")
      .call(d3.axisBottom(x).tickValues([]));

    // Add X axis label:
    svg_pile.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width - margin_pile.left - margin_pile.right)/2 )
        .attr("y", height - margin_pile.top - 0.1*margin_pile.bottom)
        .text("Artist $$");

    // Add Y axis left
      svg_pile
        .append("g")
        .call(d3.axisRight(y).tickValues([])); // Putting an axisRight here for aestethics: the top tick faces inwards, for a gauge effect.

    // Add Y axis right
      svg_pile
        .append("g")
        .attr("transform", "translate(" + x(rect_scale_ends.x_max) + ",0)")
        .call(d3.axisLeft(y).tickValues([]));
      
      // Y axis label:
      svg_pile.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -20)
          .attr("x", -margin_pile.top - 150)
          // .text("Artist $$")

    // Draw artist cash pile
    svg_pile
      .append("rect")
        .attr("x", x(rect_scale_ends.x_min) )
        .attr("y",y(artist_cash))
        .attr("width", x(rect_scale_ends.x_max) )
        .attr("height", y(rect_scale_ends.y_max - artist_cash)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
        .attr("id","cash_pile")
        .style("fill", data.color)
        .style("fill-opacity", data.opacity)
        // .style("stroke", "#5c5b5b")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.opacity);
        })
  }

function update_pile(data){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });

    // Set scales
    var x = d3.scaleLinear()
              .domain([rect_scale_ends.x_min, rect_scale_ends.x_max])
              .range([0, width - margin_pile.right - margin_pile.left]);

    var y = d3.scaleLinear()
              .domain([rect_scale_ends.y_min, rect_scale_ends.y_max])
              .range([height - margin_pile.top - margin_pile.bottom, 0]);

    var artist_cash = get_artist_cash();

    // Draw artist cash pile
    svg_pile.select("#cash_pile")
        .attr("x", x(rect_scale_ends.x_min) )
        .attr("y",y(artist_cash))
        .attr("width", x(rect_scale_ends.x_max) )
        .attr("height", y(rect_scale_ends.y_max - artist_cash)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
        .style("fill", data.color)
        .style("fill-opacity", data.opacity)
        // .style("stroke", "#5c5b5b")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.opacity_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill-opacity', data.opacity);
        })
  }

draw_pile(data_pile);

///////////////////////////////////////////////////////////////////////////////////////////


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
  update_pile(data_pile);
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
  update_pile(data_pile);
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
  update_pile(data_pile);
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
  update_pile(data_pile);
});

















