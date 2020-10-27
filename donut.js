var oldWidth = 0
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var width = height = d3.select('#graph').node().offsetWidth

  if (innerWidth <= 925){
    width = innerWidth
    height = innerHeight*.7
  }

  // return console.log(width, height)


  ///////////// Rectangle chart section ////////////////
  var data_rect = {"freemium":{"label":"Freemium",
                          "n_users":55,
                          "rev_per_user":1.2,
                          "rev":"$10%",
                          "color":"#5c5b5b",
                          "color_highlight":'#919090',
                          "opacity":0.5},
              "premium":{"label":"Premium",
                          "n_users":45,
                          "rev_per_user":1.2,
                          "rev":"$90%",
                          "color":"#b8211c",
                          "color_highlight":'#ff0000',
                          "opacity":0.5}
              }

  var data_rect_2 = {"freemium":{"label":"Freemium",
                          "n_users":55,
                          "rev_per_user":1.2,
                          "rev":"$10%",
                          "color":"#5c5b5b",
                          "color_highlight":'#919090',
                          "opacity":0.5},
              "premium":{"label":"Premium",
                          "n_users":45,
                          "rev_per_user":14.15,
                          "rev":"$90%",
                          "color":"#b8211c",
                          "color_highlight":'#ff0000',
                          "opacity":0.5}
              }

  var rect_rendering_options = {"y_axis":false,
                                "rev_text":false}
  var rect_rendering_options_2 = {"y_axis":true,
                                "rev_text":false}
  var rect_rendering_options_3 = {"y_axis":true,
                                "rev_text":true}

  var rect_drawn = false

  var margin_rect = {top: 20, right: 20, bottom: 40, left: 60};

  var svg_rect = d3.select(".container-0 #graph")
      .html('')
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin_rect.left + "," + margin_rect.top + ")");

    // Function to draw/update rectangle chart
  function draw_rect(data, rect_rendering_options){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });

    // Set scales
    var x = d3.scaleLinear()
              .domain([0, 100])
              .range([0, width - margin_rect.right - margin_rect.left]);

    var y = d3.scaleLinear()
              .domain([0, 16])
              .range([height - margin_rect.top - margin_rect.bottom, 0]);

    // Set dimensions of legend
    var legendRectSize = 18; 
    var legendSpacing = 4;
    var legend_x = x(75);
    var legend_y = y(12);

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
        .text("% of users");

    // Add Y axis
    if (rect_rendering_options.y_axis==true){
      svg_rect
        .append("g")
        .call(d3.axisLeft(y));
      
      // Y axis label:
      svg_rect.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin_rect.left+20)
          .attr("x", -margin_rect.top)
          .text("Revenue per user")
    }

    // Draw Freemium rectangle
    svg_rect
      .append("rect")
        .attr("x", x(data.premium.n_users) )
        .attr("y",y(data.freemium.rev_per_user))
        .attr("height", y(16-data.freemium.rev_per_user)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
        .attr("width", x(data.freemium.n_users) )
        .attr("id",data.freemium.label)
        .style("fill", data.freemium.color)
        .style("fill-opacity", data.freemium.opacity)
        // .style("stroke", "#5c5b5b")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill', data.freemium.color_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill', data.freemium.color);
        })

    // Draw Premium rectangle
    svg_rect
      .append("rect")
        .attr("x", x(0) )
        .attr("y",y(data.premium.rev_per_user))
        .attr("height", y(16-data.premium.rev_per_user))
        .attr("width", x(data.premium.n_users) )
        .attr("id","premium")
        .style("fill", data.premium.color)
        .style("fill-opacity", data.premium.opacity)
        // .style("stroke", "#b8211c")
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill',data.premium.color_highlight);
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseover on", this);
          // transition the mouseover'd element
          // to having a red fill
          d3.select(this)
            .transition()
            .style('fill', data.premium.color);
        })

    svg_rect.transition()


    // Set Legend
    var legend = svg_rect.selectAll('.legend')                     
              .data(data_rect_values)                                   
              .enter()                                                
              .append('g')                                            
              .attr('class', 'legend')                                
              .attr('transform', function(d, i) {                   
                var height = legendRectSize + legendSpacing;       
                var offset =  height * data_rect_values.length / 2;   
                var horz = -2 * legendRectSize + legend_x;                       
                var vert = i * height - offset + legend_y;                       
                return 'translate(' + horz + ',' + vert + ')';       
              });                                                    

            legend.append('rect')                                  
              .attr('width', legendRectSize)                        
              .attr('height', legendRectSize)                         
              .style('fill', function(d){return d.color;})
              .style('opacity',function(d){return d.opacity;})                
              // .style('stroke', color);                              
              
            legend.append('text')                                     
              .attr('x', legendRectSize + legendSpacing)            
              .attr('y', legendRectSize - legendSpacing)             
              .text(function(d) { return d.label; });
  }

  function update_rect(data, rect_rendering_options){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });
    // Set scales
    // Set scales
    var x = d3.scaleLinear()
              .domain([0, 100])
              .range([0, width - margin_rect.right - margin_rect.left]);

    var y = d3.scaleLinear()
              .domain([0, 16])
              .range([height - margin_rect.top - margin_rect.bottom, 0]);

    // Modify size of premium rectangle
    var premium_rect = svg_rect.selectAll("#premium")

    premium_rect
                .transition()
                .duration(1000)
                .attr("x", x(0) )
                .attr("y",y(data.premium.rev_per_user))
                .attr("height", y(16-data.premium.rev_per_user))
                .attr("width", x(data.premium.n_users) )
                .attr("id","premium")
                .style("fill", data.premium.color)
                .style("fill-opacity", data.premium.opacity)
                
    premium_rect.on('mouseover', function(d, i) {
      // console.log("mouseover on", this);
      // transition the mouseover'd element
      // to having a red fill
      d3.select(this)
        .transition()
        .style('fill',data.premium.color_highlight);
    })
    premium_rect.on('mouseout', function(d, i) {
      // console.log("mouseover on", this);
      // transition the mouseover'd element
      // to having a red fill
      d3.select(this)
        .transition()
        .style('fill', data.premium.color);
    })

    // Add/Remove Y axis
    if (rect_rendering_options.y_axis==true){
      // Remove if already exist in order to avoid stacking many
      svg_rect.selectAll("#y-axis").remove()
      svg_rect.selectAll("#Y_axis_label").remove()
      // Add axis
      svg_rect
        .append("g")
        .attr("id","y-axis")
        .call(d3.axisLeft(y));
      // Y axis label:
      svg_rect.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin_rect.left+20)
          .attr("x", -margin_rect.top)
          .attr("id","Y_axis_label")
          .text("Revenue per user")

    }
    if (rect_rendering_options.y_axis==false){
      svg_rect.selectAll("#y-axis").remove()
      // Remove Y axis label:
      svg_rect.selectAll("#Y_axis_label").remove()


    }

    // Add text to the rectangles 
    if (rect_rendering_options.rev_text==true){
      //Remove the text if it already exists (so that it does not get added twice)
      svg_rect.selectAll(".rev_text").remove()
      //Add text
      var rev_text = svg_rect.selectAll('.rev_text')
          .data(data_rect_values)
          .enter()
          .append('g')
          .attr('class','rev_text')
          .attr('transform', function(d){
            if (d.label=="Freemium"){
              horz = x((100-(100-d.n_users))/2+ data.premium.n_users)
            }
            else if (d.label=="Premium"){
              horz = x((100-(100-d.n_users))/2)
            }
            vert = y( (d.rev_per_user)/2);
            // vert = (y(16 -d.rev_per_user) - y(d.rev_per_user))/2;
            return 'translate(' + horz + ',' + vert + ')';
          });

      rev_text.append('text')
              .text(function(d){return d.rev})
              .style('fill',"#ffffff")
              .attr('text-anchor','middle')
              .attr('dominant-baseline','central')
              // .attr('x',)
    }   

    if (rect_rendering_options.rev_text==false){
      svg_rect.selectAll(".rev_text").remove()
    }
  }


  var gs0 = d3.graphScroll()
      .container(d3.select('.container-0'))
      .graph(d3.selectAll('container-0 #graph'))
      .eventId('uniqueId0')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-0 #sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){

        console.log('graph 0 change')
        switch (i){
        case 0:
          if (rect_drawn==false){ 
            draw_rect(data_rect,rect_rendering_options)
            rect_drawn = true
          }
          else {update_rect(data_rect,rect_rendering_options)}
          break;
        case 1:
          update_rect(data_rect_2, rect_rendering_options_2)
          break;
        case 2:
          update_rect(data_rect_2, rect_rendering_options_3)
          break;
        }

      })


  ///////////////// Sunburst section ////////////////////

  ///////////////////// Initial Data ////////////////////////
  var shares_default = {"track1":{"artist":0.5,
                          "distr_label":0.5},
                  "track2":{"artist":0.6,
                          "distr_label":0.4},
                  "track3":{"artist":0.75,
                          "distr_label":0.25},
                  "track4":{"artist":0.6,
                          "distr_label":0.4}
              };

  var streams_default = {"track1":600000,
                  "track2":300000,
                  "track3":1000000,
                  "track4":60000,
              };

  var dsp_revenue_default = 80;
  var hidden_levels_default = [0,2]; //Sunburst levels to hide (0=center, 2= outer ring)

  var shares = shares_default;
  var streams = streams_default;
  var dsp_revenue = dsp_revenue_default;  
  var hidden_levels = hidden_levels_default;

  console.log("sunburst data",data_sunburst)

  var color_sunburst = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]);

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

  var data_sunburst = generate_data_dict()


  var sunburst_data_modifier = function(i){
    switch(i){
      case 0:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 1:
        dsp_revenue = 100;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 2:
        dsp_revenue = 30;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 3:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 4:
        dsp_revenue = dsp_revenue_default;
        streams = {"track1":1000000,
                    "track2":300000,
                    "track3":1000000,
                    "track4":60000,
                };
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 5:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 6:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 7:
        dsp_revenue = dsp_revenue_default;
        streams = {"track1":600000,
                    "track2":900000,
                    "track3":2000000,
                    "track4":90000,
                };
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 8:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = hidden_levels_default;
        break;
      case 9:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = shares_default;
        hidden_levels = [0];
        break;
      case 10:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = {"track1":{"artist":0.15,
                          "distr_label":0.85},
                  "track2":{"artist":0.6,
                          "distr_label":0.4},
                  "track3":{"artist":0.75,
                          "distr_label":0.25},
                  "track4":{"artist":0.6,
                          "distr_label":0.4}
              };
        hidden_levels = [0];
        break;
      case 11:
        dsp_revenue = dsp_revenue_default;
        streams = streams_default;
        shares = {"track1":{"artist":0.85,
                          "distr_label":0.15},
                  "track2":{"artist":0.6,
                          "distr_label":0.4},
                  "track3":{"artist":0.75,
                          "distr_label":0.25},
                  "track4":{"artist":0.6,
                          "distr_label":0.4}
              };
        hidden_levels = [0];
        break;
    }
  }

  var drawChart = function(data) {
    var radius = (dsp_revenue/100) * Math.min(width, height) / 2 ;
    // Create primary <g> element
    var g = d3.select(".container-1 #graph")
        .html('')
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
        // .attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("display", function (d) { if (hidden_levels.includes(d.depth)) return "none";  })
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill",  function (d) { 
            if (d.children){
              return color(d.data.name)
            }
            else {
              // console.log("ELSE",d)
              var parent_color = d3.hsl(color(d.parent.data.name))
              if (d.data.name=="Artist") {
                // console.log("Artist parent color", parent_color)
                var artist_colour = parent_color
                // artist_colour['h'] = artist_colour['h'] + 10;
                // artist_colour['s'] += 0.2
                // artist_colour['l'] += 0.1
                return artist_colour;
              }
              else { 
                // console.log("Not Artist")
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

    function arcTweenPath(a, i) {

        var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);

        function tween(t) {
            var b = oi(t);
            a.x0s = b.x0;
            a.x1s = b.x1;
            return arc(b);
        }

        return tween;
    }

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    var radius = (dsp_revenue/100) * Math.min(width, height) / 2 ;
    
    // Data strucure
    var partition = d3.partition()
        .size([2 * Math.PI, radius]);

    // Find data root
    var root = d3.hierarchy(data)
        .sum(function (d) { return d.value});

    // Size arcs
    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) {d.x0s = d.x0; return d.x0 })
        .endAngle(function (d) { d.x1s = d.x1; return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    // Put it all together
    // path = g.selectAll('path').data(root.descendants()).transition().duration(500).attrTween("d", arcTween)
    var g = d3.selectAll(".container-1 #graph")
              .select("g");
    path = g.selectAll('path').data(root.descendants())

        // path.transition().duration(500).attrTween("d", arcTween)
    // paths.selectAll('path')
    path.attr("display", function (d) { if (hidden_levels.includes(d.depth)) return "none";  })
        .attr("d", arc)
        .each(function(d) { this._current = d; }) // store the initial angles
        .style('stroke', '#fff')
        .style("fill", function (d) { 
          if (d.children){
            return color(d.data.name)
          }
          else {
            // console.log("ELSE",d)
            var parent_color = d3.hsl(color(d.parent.data.name))
            if (d.data.name=="Artist") {
              // console.log("Artist parent color", parent_color)
              var artist_colour = parent_color
              // artist_colour['h'] = artist_colour['h'] + 10;
              // artist_colour['s'] += 0.2
              // artist_colour['l'] += 0.1
              return artist_colour;
            }
            else { 
              // console.log("Not Artist")
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

  //////////// Pie Chart vars ////////////
  // var data = {a: 9, b: 20, c:30, d:8, e:12}
  // var data2 = {a: 9, b: 20, c:8, d:5, e:20}
  //  var data3 = {a: 9, b: 5, c:30, d:5, e:30}
  //  var data4 = {a: 9, b: 20, c:8, d:25, e:10}

  // var margin = 20
  // var radius = Math.min(width, height) / 2 - margin
  // var innerRadius = 0.6*radius

  // var color = d3.scaleOrdinal()
  //     .domain(data)
  //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

  // var svg = d3.select(".container-1 #graph")
  //     .html('')
  //     .append("svg")
  //       .attr("width", width)
  //       .attr("height", height)
  //     .append("g")
  //       .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // // Function to update chart
  // function update(data) {

  //   // Compute the position of each group on the pie:
  //   var pie = d3.pie()
  //     .value(function(d) {return d.value; })
  //     .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  //   var data_ready = pie(d3.entries(data))

  //   // map to data
  //   var u = svg.selectAll("path")
  //     .data(data_ready)

  //   // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  //   u
  //     .enter()
  //     .append('path')
  //     .merge(u)
  //     .transition()
  //     .duration(1000)
  //     .attr('d', d3.arc()
  //       .innerRadius(innerRadius)
  //       .outerRadius(radius)
  //     )
  //     .attr('fill', function(d){ return(color(d.data.key)) })
  //     .attr("stroke", "white")
  //     .style("stroke-width", "2px")
  //     .style("opacity", 1)

  //   // remove the group that is not present anymore
  //   u
  //     .exit()
  //     .remove()

  // }

  
  
  var gs = d3.graphScroll()
      .container(d3.select('.container-1'))
      .graph(d3.selectAll('container-1 #graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-1 #sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){

        console.log('graph change')
        console.log("i",i)
        // var pos = [ data, data2, data3, data4 ][i]        
        // update(pos)
        sunburst_data_modifier(i)
        data_sunburst = generate_data_dict()
        console.log('dsp_revenue',dsp_revenue)
        console.log('streams',streams)
        if (i==0){
          drawChart(data_sunburst)}
        else {
          updateChart(data_sunburst)}
        

      })

  ////////////////////////////////////

  var colors = ['orange', 'purple', 'steelblue', 'pink', 'black']

  var svg2 = d3.select('.container-2 #graph').html('')
               .append('svg')
               .attrs({width: width, height: height})
               .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  var path2 = svg2.append('path')

  var gs2 = d3.graphScroll()
      .container(d3.select('.container-2'))
      .graph(d3.selectAll('.container-2 #graph'))
      .eventId('uniqueId2')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-2 #sections > div'))
      .on('active', function(i){
        var h = height
        var w = width
        var dArray = [
          [[w/4, h/4], [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
          [[0, 0],     [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
          [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
          [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
          [[w/2, h/2], [w, h/2],      [0, 0],         [w/4, h/2]],
          [[w/2, h/2], [0, h/4],      [0, h/2],         [w/4, 0]],
        ].map(function(d){ return 'M' + d.join(' L ') })


        path2.transition().duration(1000)
            .attr('d', dArray[i])
            .style('fill', colors[i])
      })

}
render()
d3.select(window).on('resize', render)
