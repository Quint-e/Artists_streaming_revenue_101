var oldWidth = 0
console.log('RECT and Axes')
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var width = height = d3.select('#graph').node().offsetWidth
  var r = 40


  if (innerWidth <= 925){
    width = innerWidth
    height = innerHeight*.7
  }


  var data = {"freemium":{"label":"Freemium",
                          "n_users":55,
                          "rev_per_user":1.2,
                          "rev":"$8%",
                          "color":"#5c5b5b",
                          "color_highlight":'#919090',
                          "opacity":0.5},
              "premium":{"label":"Premium",
                          "n_users":45,
                          "rev_per_user":13.8,
                          "rev":"$92%",
                          "color":"#b8211c",
                          "color_highlight":'#ff0000',
                          "opacity":0.5}
              }

  // List of dictionaries version of data dict, used for iterating through data in plotting routines.
  var data_values = Object.keys(data).map(function(key){  
      return data[key];
      });

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 40, left: 60},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  // Set scales
  var x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

  var y = d3.scaleLinear()
            .domain([0, 16])
            .range([height, 0]);

  // Set dimensions of legend
  var legendRectSize = 18; 
  var legendSpacing = 4;
  var legend_x = x(75);
  var legend_y = y(12);

  // create svg element, respecting margins
  var svg_0 = d3.select("#graph")
    .html('')
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


  function update_rect(data){

    // Add X axis
    svg_0
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    svg_0
      .append("g")
      .call(d3.axisLeft(y));

    // Add X axis label:
    svg_0.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("% of users");

    // Y axis label:
    svg_0.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Revenue per user")

    // Draw Freemium rectangle
    svg_0
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
    svg_0
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


    // Add text to the rectangles
    var rev_text = svg_0.selectAll('.rev_text')
        .data(data_values)
        .enter()
        .append('g')
        .attr('class','rev_text')
        .attr('transform', function(d){
          // var horz
          // switch (d){
          //   case d.label=="Premium":
          //     horz = x((100-(100-d.n_users))/2);
          //     break;
          //   case d.label=="Freemium":
          //     horz = x((100-(100-d.n_users))/2)+ d.premium.n_users;
          //     break;
          // }
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

    // Set Legend
    var legend = svg_0.selectAll('.legend')                     
              .data(data_values)                                   
              .enter()                                                
              .append('g')                                            
              .attr('class', 'legend')                                
              .attr('transform', function(d, i) {                   
                var height = legendRectSize + legendSpacing;       
                var offset =  height * data_values.length / 2;   
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


  ////////////////////// Update chart based on scrolling events /////////////////////


  var gs0 = d3.graphScroll()
        .container(d3.select('.container-0'))
        .graph(d3.selectAll('container-0 #graph'))
        .eventId('uniqueId0')  // namespace for scroll and resize events
        .sections(d3.selectAll('.container-0 #sections > div'))
        .on('active', function(i){

          console.log('graph 0 change')
          update_rect(data)
          // var pos = [ data, data2, data3, data4 ][i]
          // update(pos)
        })

  d3.select('#source')
      .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
}

render()
d3.select(window).on('resize', render)






