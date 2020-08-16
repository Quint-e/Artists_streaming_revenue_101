var oldWidth = 0
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var width = height = d3.select('#graph').node().offsetWidth
  var r = 40


  if (innerWidth <= 925){
    width = innerWidth
    height = innerHeight*.7
  }

  // return console.log(width, height)


  ///////////// Rectangle chart section ////////////////






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

        // data_ready = pie(d3.entries(pos))
        // donut = svg
        //   .selectAll('whatever')
        //   .data(data_ready)
        //   .enter()
        //   .append('path')
        //   .attr('d', d3.arc()
        //     .innerRadius(0)
        //     .outerRadius(radius)
        //   )
        //   .attr('fill', function(d){ return(color(d.data.key)) })
        //   .attr("stroke", "black")
        //   .style("stroke-width", "2px")
        //   .style("opacity", 0.7)


        // donut.transition().duration(1000)
        //     .attrs(pos)
          // .transition()
            // .style('fill', function(d){ return(color(d.data.key)) })
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
