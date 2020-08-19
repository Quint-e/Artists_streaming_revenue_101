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

  //////////// Pie Chart vars ////////////
  var data = {a: 9, b: 20, c:30, d:8, e:12}
  var data2 = {a: 9, b: 20, c:8, d:5, e:20}
   var data3 = {a: 9, b: 5, c:30, d:5, e:30}
   var data4 = {a: 9, b: 20, c:8, d:25, e:10}

  var margin = 20
  var radius = Math.min(width, height) / 2 - margin
  var innerRadius = 0.6*radius

  var color = d3.scaleOrdinal()
      .domain(data)
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

  var svg = d3.select(".container-1 #graph")
      .html('')
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // var pie = d3.pie()
  //     .value(function(d) {return d.value; })

  // var data_ready = pie(d3.entries(data))

  // var donut = svg
  //         .selectAll('whatever')
  //         .data(data_ready)
  //         .enter()
  //         .append('path')
  //         .attr('d', d3.arc()
  //           .innerRadius(0)
  //           .outerRadius(radius)
  //         )
  //         .attr('fill', function(d){ return(color(d.data.key)) })
  //         .attr("stroke", "black")
  //         .style("stroke-width", "2px")
  //         .style("opacity", 0.7)
  // Function to update chart
  function update(data) {

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.value; })
      .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(d3.entries(data))

    // map to data
    var u = svg.selectAll("path")
      .data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
      .enter()
      .append('path')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius)
      )
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)

    // remove the group that is not present anymore
    u
      .exit()
      .remove()

  }

  ////////////////////////////////////

  // var svg = d3.select('#graph').html('')
  //   .append('svg')
  //     .attrs({width: width, height: height})

  // var circle = svg.append('circle')
  //     .attrs({cx: 0, cy: 0, r: r})

  var colors = ['orange', 'purple', 'steelblue', 'pink', 'black']
  var gs = d3.graphScroll()
      .container(d3.select('.container-1'))
      .graph(d3.selectAll('container-1 #graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-1 #sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){

        console.log('graph change')
        var pos = [ data, data2, data3, data4 ][i]        
        update(pos)

      })


  var svg2 = d3.select('.container-2 #graph').html('')
    .append('svg')
      .attrs({width: width, height: height})

  var path = svg2.append('path')

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


        path.transition().duration(1000)
            .attr('d', dArray[i])
            .style('fill', colors[i])
      })

}
render()
d3.select(window).on('resize', render)
