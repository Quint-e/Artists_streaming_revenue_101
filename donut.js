var oldWidth = 0
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var width = height = d3.select('#graph').node().offsetWidth

  if (innerWidth <= 925){
    width = innerWidth
    height = innerHeight*.7
  }



///////////////// Middle men section /////////////////////

  var singer_params = {width:80, height:80,x:0,y:250}
  var distributor_params = {width:100, height:100,x:175,y:250}
  var spotify_params = {width:50, height:50,x:350,y:125}
  var apple_params = {width:50, height:50,x:350,y:250}
  var deezer_params = {width:50, height:50,x:350,y:375}

  var margin_diag = {top: 20, right: 20, bottom: 40, left: 60}; // Overall diagram area margins

    var svg_diag = d3.select(".container-0 #graph")
      // .html('')
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin_diag.left + "," + margin_diag.top + ")");

  var draw_diagram = function(){

    var image_singer = svg_diag.append('image')
      .attr('xlink:href', './images/singer.png')
      .attr('width', singer_params.width)
      .attr('height',singer_params.height)
      .attr('x',singer_params.x)
      .attr('y',singer_params.y - singer_params.height/2);

    var image_distributor = svg_diag.append('image')
      .attr('xlink:href', './images/home.png')
      .attr('width', distributor_params.width)
      .attr('height',distributor_params.height)
      .attr('x',distributor_params.x)
      .attr('y',distributor_params.y - distributor_params.height/2);

    var logo_spotify = svg_diag.append('image')
      .attr('xlink:href', './images/spotify-logo.png')
      .attr('width', spotify_params.width)
      .attr('height',spotify_params.height)
      .attr('x',spotify_params.x)
      .attr('y',spotify_params.y - spotify_params.height/2);

    var logo_apple = svg_diag.append('image')
      .attr('xlink:href', './images/apple-logo.png')
      .attr('width', apple_params.width)
      .attr('height',apple_params.height)
      .attr('x',apple_params.x)
      .attr('y',apple_params.y - apple_params.height/2);

    var logo_deezer = svg_diag.append('image')
      .attr('xlink:href', './images/deezer-logo.png')
      .attr('width', deezer_params.width)
      .attr('height',deezer_params.height)
      .attr('x',deezer_params.x)
      .attr('y',deezer_params.y  - deezer_params.height/2);
  }

  draw_diagram();

  var toggle_diag_animations = function(i){
    var pad = 7;
    var gap = 20;
    var duration = 300;
    var line_ends_distSinger = [{x: distributor_params.x, y: distributor_params.y}, 
                                {x: singer_params.x + singer_params.width, y: singer_params.y}];
    var line_ends_spotifyDist = [{x: spotify_params.x-pad, y: spotify_params.y},
                                {x: distributor_params.x + distributor_params.width/2 + pad, y: distributor_params.y}];
    var line_ends_appleDist = [{x: apple_params.x-pad, y: apple_params.y},
                                {x: distributor_params.x + distributor_params.width/2 + pad, y: distributor_params.y}];
    var line_ends_deezerDist = [{x: deezer_params.x-pad, y: deezer_params.y},
                                {x: distributor_params.x + distributor_params.width/2 + pad, y: distributor_params.y}];


    var line_ends_singerDist = [{x: singer_params.x + singer_params.width + pad, y: singer_params.y},
                                      {x: distributor_params.x, y: distributor_params.y}];
    var line_ends_distSpotify = [{x: distributor_params.x + distributor_params.width/2 + pad, y: distributor_params.y},
                                 {x: spotify_params.x-pad, y: spotify_params.y}];
    var line_ends_distApple = [{x: distributor_params.x + distributor_params.width/2 + pad, y: distributor_params.y},
                                {x: apple_params.x-pad, y: apple_params.y}];
    var line_ends_distDeezer = [{x: distributor_params.x + distributor_params.width/2 + pad, y: distributor_params.y},
                                {x: deezer_params.x-pad, y: deezer_params.y}];

    // animate_dollars(line_ends,gap,duration);
    switch(i){
      case 1:
        animate_music(line_ends_singerDist,gap,duration);
        animate_music(line_ends_distSpotify,gap,duration);
        animate_music(line_ends_distApple,gap,duration);
        animate_music(line_ends_distDeezer,gap,duration);
        break;
      case 2:
        animate_dollars(line_ends_distSinger,gap,duration);
        animate_dollars(line_ends_spotifyDist,gap,duration);
        animate_dollars(line_ends_appleDist,gap,duration);
        animate_dollars(line_ends_deezerDist,gap,duration);
        break;
    }

    function animate_dollars(line_ends,gap,duration){

      var line = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

      var line_len = Math.sqrt((line_ends[1].x - line_ends[0].x)**2 + (line_ends[1].y - line_ends[0].y)**2 );
      var line_slope = (line_ends[0].y - line_ends[1].y)/(line_ends[0].x - line_ends[1].x)

      var myPath = svg_diag.append("g")
        .append("path")
        .attr("d", line(line_ends))
        .attr("id", "dots");
      
      var numberOfDots = Math.floor(line_len/ gap);
      var gap_x = Math.sqrt(gap**2/(1+line_slope**2));
      
      var data = d3.range(numberOfDots).map(function(d, i) {
          // let length =line_len * (i/numberOfDots);
          let point = {x:line_ends[0].x - i*gap_x, y:line_ends[0].y - i*gap_x*line_slope};
          //return point.x; 
          return {x: point.x, y: point.y}; 
      });
      
      var dots = svg_diag.select("g").selectAll(".dot")
        .data(data)
        .enter()
        .append('text')
        .text('$')
        .attr("x",function(d, i){ return d.x; })
        .attr("y", function(d, i){ return d.y; })
        .attr("id","dots")
        .attr("opacity",0);

      var count = 0;
      
      var tid = setInterval(updateDots, duration);

      function updateDots() {
        dots.transition()
          .duration(200)
          .style("opacity", function(d,i){
          
            var opacity = 1
            
            ///////////////// Version with 3 dots active at all times /////////

            //if at the end or near the end of the path, start from the beginning
            // if (count == numberOfDots ) {
            //   if ( i == numberOfDots || i == 0 || i == 1 ) {
            //     opacity = 1;
            //   } else {
            //     opacity = 0;
            //   };
            // } else if (count == (numberOfDots - 1) ) {
            //   if ( i == numberOfDots || i == (numberOfDots - 1) || i == 0 ) {
            //     opacity = 1;
            //   } else {
            //     opacity = 0;
            //   };
            // //else shade the 3 dots from the count onwards
            // } else {
            //   if (i == count || i == (count + 1) || i == (count + 2) ) {
            //     opacity = 1;
            //   } else {
            //     opacity = 0;
            //   };
            // };   
            ///////////////////////////////////////////////////////

            ///////////////// Version with 3 dot trains /////////
              // if (i == count || i == (count + 1) || i == (count + 2)) {
              //   opacity = 1;
              // } else {
              //   opacity = 0;
              // };
            ///////////////////////////////////////////////////////

            ///////////////// Version with 2 dot trains /////////
              if (i == count || i == (count + 1) ) {
                opacity = 1;
              } else {
                opacity = 0;
              };
            ///////////////////////////////////////////////////////

            ///////////////// Version with 1 dot trains /////////
              // if (i == count ) {
              //   opacity = 1;
              // } else {
              //   opacity = 0;
              // };
            ///////////////////////////////////////////////////////

            return opacity
            
          });
        
        count = count == numberOfDots ? 0 : count + 1;
      };
    };

    function animate_music(line_ends,gap,duration){

      var line = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

      var line_len = Math.sqrt((line_ends[1].x - line_ends[0].x)**2 + (line_ends[1].y - line_ends[0].y)**2 );
      var line_slope = (line_ends[0].y - line_ends[1].y)/(line_ends[0].x - line_ends[1].x)

      var myPath = svg_diag.append("g")
        .append("path")
        .attr("d", line(line_ends))
        .attr("id", "dots");
      
      var numberOfDots = Math.floor(line_len/ gap);
      var gap_x = Math.sqrt(gap**2/(1+line_slope**2));
      
      var data = d3.range(numberOfDots).map(function(d, i) {
          // let length =line_len * (i/numberOfDots);
          let point = {x:line_ends[0].x + i*gap_x, y:line_ends[0].y + i*gap_x*line_slope};
          //return point.x; 
          return {x: point.x, y: point.y}; 
      });
      
      var dots = svg_diag.select("g").selectAll(".dot")
        .data(data)
        .enter()
        .append('image')
        .attr('xlink:href', './images/music.png')
        .attr('width', 20)
        .attr('height',20)
        .attr("x",function(d, i){ return d.x; })
        .attr("y", function(d, i){ return d.y; })
        .attr("id", "dots")
        .attr("opacity",0);

      var count = 0;
      var tid = setInterval(updateDots, duration);

      function updateDots() {
        dots.transition()
          .duration(200)
          .style("opacity", function(d,i){
          
            var opacity = 1

            ///////////////// Version with 3 dot trains /////////
              // if (i == count || i == (count + 1) || i == (count + 2)) {
              //   opacity = 1;
              // } else {
              //   opacity = 0;
              // };
            ///////////////////////////////////////////////////////

            ///////////////// Version with 2 dot trains /////////
              if (i == count || i == (count + 1) ) {
                opacity = 1;
              } else {
                opacity = 0;
              };
            ///////////////////////////////////////////////////////

            ///////////////// Version with 1 dot trains /////////
              // if (i == count ) {
              //   opacity = 1;
              // } else {
              //   opacity = 0;
              // };
            ///////////////////////////////////////////////////////

            return opacity
          });
        
        count = count == numberOfDots ? 0 : count + 1;
      };
    };
  }

  var diag_delete_dots = function(){
    svg_diag.selectAll("#dots").remove()
  };

  var gs1 = d3.graphScroll()
      .container(d3.select('.container-0'))
      .graph(d3.selectAll('container-0 #graph'))
      .eventId('uniqueId0')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-0 #sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){
        console.log('graph 0 change', i)
        diag_delete_dots();
        toggle_diag_animations(i);
      });



  ///////////// Rectangle chart section ////////////////
  var data_rect = {"freemium":{"label":"Freemium",
                          "n_users":55,
                          "rev_per_user":0.33,
                          "rev":"$10%",
                          "color":"#000000",
                          "color_highlight":'#363636',
                          "opacity":0.5},
              "premium":{"label":"Premium",
                          "n_users":45,
                          "rev_per_user":0.33,
                          "rev":"$90%",
                          "color":"#1dc500",
                          "color_highlight":'#6bff53',
                          "opacity":0.5}
              }

  var data_rect_2 = {"freemium":{"label":"Freemium",
                          "n_users":55,
                          "rev_per_user":0.33,
                          "rev":"$10%",
                          "color":"#131313",
                          "color_highlight":'#363636',
                          "opacity":0.5},
              "premium":{"label":"Premium",
                          "n_users":45,
                          "rev_per_user":4.19,
                          "rev":"$90%",
                          "color":"#1dc500",
                          "color_highlight":'#6bff53',
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

  var svg_rect = d3.select(".container-1 #graph")
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
    // console.log("data",data);
    // console.log("data_rect_values",data_rect_values)
    // Set scales
    var x = d3.scaleLinear()
              .domain([0, 100])
              .range([0, width - margin_rect.right - margin_rect.left]);

    var y = d3.scaleLinear()
              .domain([0, 5])
              .range([height - margin_rect.top - margin_rect.bottom, 0]);

    // Set dimensions of legend
    var legendRectSize = 18; 
    var legendSpacing = 4;
    var legend_x = x(75);
    var legend_y = y(4.5);

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
        .attr("height", y(5-data.freemium.rev_per_user)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
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
        .attr("height", y(5-data.premium.rev_per_user))
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
              .domain([0, 5])
              .range([height - margin_rect.top - margin_rect.bottom, 0]);

    // Modify size of premium rectangle
    var premium_rect = svg_rect.selectAll("#premium")

    premium_rect
                .transition()
                .duration(1000)
                .attr("x", x(0) )
                .attr("y",y(data.premium.rev_per_user))
                .attr("height", y(5-data.premium.rev_per_user))
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
          .text("Average Revenue Per User (€/month)")

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


  var gs1 = d3.graphScroll()
      .container(d3.select('.container-1'))
      .graph(d3.selectAll('container-1 #graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-1 #sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){

        console.log('graph 1 change')
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


  ///////////////// Revenue Share section ////////////////////

  ///////////////////// Initial Data ////////////////////////
  var shares_default = {"track1":{"artist":0.5,
                          "distr_label":0.5}
              };

  var streams_default = {"track1":600000,
                  "other_tracks":2000000,
              };

  var dsp_revenue_default = 70;
  var artist_shareOfStreams_default = 30;
  var artist_share_default = 0.7;

  var margin_revshare = {top: 80, right: 20, bottom: 40, left: 60};
  var revshare_scale_ends = {x_min:0, x_max:100, y_min:0, y_max:100};
  var width_revshare = width;
  var height_revshare = height + margin_revshare.top - 50;

  var data_revshare = {"other_tracks":{"label":"other_tracks",
                          "share_of_streams":55,
                          "dsp_revenue":dsp_revenue_default,
                          "annotation":"Other Tracks",
                          "color":"#000000",
                          "color_highlight":'#363636',
                          "opacity":0.6,
                          "opacity_highlight":0.3},
                "artist_share":{"label":"artist_share",
                          "share_of_streams":45,
                          "share":0.8,
                          "dsp_revenue":dsp_revenue_default,
                          "annotation":"Artist",
                          "color":"#00ba0e",
                          "color_highlight":'#6bff53',
                          "opacity":1.0,
                          "opacity_highlight":0.4},
                "dist_share":{"label":"distributor_share",
                          "share_of_streams":45,
                          "share":0.2,
                          "dsp_revenue":dsp_revenue_default,
                          "annotation":"Dist/Label",
                          "color":"#3683ff",
                          "color_highlight":'#6bff53',
                          "opacity":1.0,
                          "opacity_highlight":0.4}
              }

  var revshare_rendering_options = {"y_axis":false,
                              "y_axis_ticks":false,
                              "x_axis_ticks":false,
                              "x_axis_label":false,
                              "annotations":false}

  var shares = shares_default;
  var streams = streams_default;
  var dsp_revenue = dsp_revenue_default;  
  var revshare_drawn = false;
  var revshare_x_ticks_drawn = false;
  var revshare_x_label_drawn = false;

  var svg_revshare = d3.select(".container-2 #graph")
                      .append("svg")
                     .html('')
                     .attr("width", width_revshare)
                     .attr("height", height_revshare)
                     .append("g")
                     .attr("id", "rev_share")
                     .attr("transform", "translate(" + margin_revshare.left + "," + margin_revshare.top + ")");

  var revshare_data_modifier = function(i){
    switch(i){
      case 0:
        dsp_revenue = 30;
        artist_shareOfStreams = 0;
        artist_share = 1;
        revshare_rendering_options.x_axis_ticks = false;
        revshare_rendering_options.x_axis_label = false;
        break;
      case 1:
        dsp_revenue = 100;
        artist_shareOfStreams = 0;
        artist_share = 1;
        revshare_rendering_options.x_axis_ticks = false;
        revshare_rendering_options.x_axis_label = false;
        break;
      case 2:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = 0;
        artist_share = 1;
        revshare_rendering_options.x_axis_ticks = false;
        revshare_rendering_options.x_axis_label = false;
        break;
      case 3:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = artist_shareOfStreams_default;
        artist_share = 1;
        revshare_rendering_options.x_axis_ticks = false;
        revshare_rendering_options.x_axis_label = false;
        break;
      case 4:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = 50;
        artist_share = 1;
        revshare_rendering_options.x_axis_ticks = false;
        revshare_rendering_options.x_axis_label = false;
        break;
      case 5:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = artist_shareOfStreams_default;
        artist_share = 1;
        break;
      case 6:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = artist_shareOfStreams_default;
        artist_share = 1;
        break;
      case 7:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = 5;
        artist_share = 1;
        break;
      case 8:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = artist_shareOfStreams_default;
        artist_share = 1;
        break;
      case 9:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = artist_shareOfStreams_default;
        artist_share = artist_share_default;
        break;
      case 10:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = artist_shareOfStreams_default;
        artist_share = 0.15;
        break;
      case 11:
        dsp_revenue = dsp_revenue_default;
        artist_shareOfStreams = artist_shareOfStreams_default;
        artist_share = 0.85;
        break;
    }
  }

  function revshare_data_update(){
    data_revshare.other_tracks.dsp_revenue = dsp_revenue;
    data_revshare.other_tracks.share_of_streams = 100 - artist_shareOfStreams;

    data_revshare.artist_share.dsp_revenue = dsp_revenue;
    data_revshare.artist_share.share_of_streams = artist_shareOfStreams;
    data_revshare.artist_share.share = artist_share;

    data_revshare.dist_share.dsp_revenue = dsp_revenue;
    data_revshare.dist_share.share_of_streams = artist_shareOfStreams;
    data_revshare.dist_share.share = 1 - artist_share;
  }

  function drawChart(data, rect_rendering_options){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });
    // Set scales
    var x = d3.scaleLinear()
              .domain([revshare_scale_ends.x_min, revshare_scale_ends.x_max])
              .range([0, width_revshare - margin_revshare.right - margin_revshare.left]);

    var y = d3.scaleLinear()
              .domain([revshare_scale_ends.y_min, revshare_scale_ends.y_max])
              .range([height_revshare - margin_revshare.top - margin_revshare.bottom, 0]);


    // Add X axis
    if (revshare_rendering_options.x_axis_ticks==true){
      if (revshare_x_ticks_drawn==false){
        svg_revshare
          .append("g")
          .attr("transform", "translate(0," + (height_revshare - margin_revshare.top - margin_revshare.bottom) + ")")
          .call(d3.axisBottom(x));
      }
    }
    else {
      svg_revshare
        .append("g")
        .attr("transform", "translate(0," + (height_revshare - margin_revshare.top - margin_revshare.bottom) + ")")
        .attr("id","xticks")
        .call(d3.axisBottom(x).tickValues([]));
    }

    // Add X axis label:
    if (revshare_rendering_options.x_axis_label==true){
      svg_revshare.append("text")
          .attr("text-anchor", "middle")
          .attr("x", (width_revshare - margin_revshare.left - margin_revshare.right)/2 )
          .attr("y", height_revshare - margin_revshare.top - 0.1*margin_revshare.bottom)
          .text("Share of streams (%)");
    }

    // Add Y axis
    if (revshare_rendering_options.y_axis==true){
      svg_revshare
        .append("g")
        .call(d3.axisLeft(y).tickValues([]));
      
      // Y axis label:
      svg_revshare.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin_revshare.left + 40)
          .attr("x", -margin_revshare.top )
          .text("DSP Revenue")
    }


    // Draw other tracks rectangle
    svg_revshare
      .append("rect")
        .attr("x", x(revshare_scale_ends.x_min) )
        .attr("y",y(data.other_tracks.dsp_revenue))
        .attr("width", x(data.other_tracks.share_of_streams) )
        .attr("height", y(revshare_scale_ends.y_max-data.other_tracks.dsp_revenue)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
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
    svg_revshare
      .append("rect")
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.dist_share.dsp_revenue * (1 - data.artist_share.share)))
        .attr("width", x(data.dist_share.share_of_streams) )
        .attr("height", y(revshare_scale_ends.y_max-data.dist_share.dsp_revenue*data.dist_share.share))
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
    svg_revshare
      .append("rect")
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.artist_share.dsp_revenue))
        .attr("width", x(data.artist_share.share_of_streams) )
        .attr("height", y(revshare_scale_ends.y_max-data.artist_share.dsp_revenue*data.artist_share.share))
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
  }

  function revshare_draw_dollars(N=20){
    // N specifies how many dollar icons to put per dimension (so N**2 in total)

    // Set scales
    var x = d3.scaleLinear()
              .domain([revshare_scale_ends.x_min, revshare_scale_ends.x_max])
              .range([0, width_revshare - margin_revshare.right - margin_revshare.left]);

    var y = d3.scaleLinear()
              .domain([revshare_scale_ends.y_min, revshare_scale_ends.y_max])
              .range([height_revshare - margin_revshare.top - margin_revshare.bottom, 0]);

    var g_dollars = svg_revshare
        .append("g")
        .attr("class","dollars");

    var i;
    var j;
    for (i=0; i<N;  i++){
      for (j=N; j>0;  j--){
        var idx = i+j*N;
        g_dollars
          .append("image")
          .attr('xlink:href', './images/round_dollar_negative_with_edges_white.png')
          .attr("x", x(i*revshare_scale_ends.x_max/N))
          .attr("y",y(j*revshare_scale_ends.x_max/N))
          .attr("width", x(revshare_scale_ends.x_max/N) )
          .attr("height", x(revshare_scale_ends.x_max/N)) 
          .attr("id","dollar_"+idx)
      }
    }
  }

  function revshare_draw_legend(data, N){
    var data_rect_values = Object.keys(data).map(function(key){  
          return data[key];
          });
    // Set scales
    var x = d3.scaleLinear()
              .domain([revshare_scale_ends.x_min, revshare_scale_ends.x_max])
              .range([0, width_revshare - margin_revshare.right - margin_revshare.left]);
    var y = d3.scaleLinear()
              .domain([revshare_scale_ends.y_min, revshare_scale_ends.y_max])
              .range([height_revshare - margin_revshare.top - margin_revshare.bottom, 0]);
    // Set dimensions of legend
    var legendRectSize = Math.floor(x(revshare_scale_ends.x_max/N)); 
    var legendSpacing = 4;
    var legendPadLeft = 20;
    var legend_x = x(50);
    var legend_y = margin_revshare.top - 35;
    var width_legend = x(revshare_scale_ends.x_max) - x(revshare_scale_ends.x_min);
    // Set Legend
    var legend = d3.select(".container-2 #graph").select('svg')
              .selectAll('.legend')                     
              .data(data_rect_values)                                   
              .enter()                                                
              .append('g')                                            
              .attr('class', 'legend')                                
              .attr('transform', function(d, i) {  
                var horz = i*width_legend/data_rect_values.length + margin_revshare.left + legendPadLeft;                       
                var vert = legend_y;                       
                return 'translate(' + horz + ',' + vert + ')';       
              });                                                    

            legend.append('rect')                                  
              .attr('width', legendRectSize)                        
              .attr('height', legendRectSize)                         
              .style('fill', function(d){return d.color;})
              .style('opacity',function(d){return d.opacity;});                
              // .style('stroke', color);   

            legend.append("image")  
                  .attr('xlink:href', './images/round_dollar_negative_with_edges_white.png')
                  .attr("width", legendRectSize )
                  .attr("height", legendRectSize );                       
              
            legend.append('text')                                     
              .attr('x', legendRectSize + legendSpacing)            
              .attr('y', legendRectSize - legendSpacing)
              .style('fill', function(d) {return d.color})
              .style('opacity', function(d) {return d.opacity})             
              .text(function(d) { return d.annotation; });
  }

  function updateChart(data, revshare_rendering_options, transition_duration=500){
    // List of dictionaries version of data dict, used for iterating through data in plotting routines.
    var data_rect_values = Object.keys(data).map(function(key){  
        return data[key];
        });
    // Set scales
    var x = d3.scaleLinear()
              .domain([revshare_scale_ends.x_min, revshare_scale_ends.x_max])
              .range([0, width_revshare - margin_revshare.right - margin_revshare.left]);

    var y = d3.scaleLinear()
              .domain([revshare_scale_ends.y_min, revshare_scale_ends.y_max])
              .range([height_revshare - margin_revshare.top - margin_revshare.bottom, 0]);

    // Update other tracks rectangle
    var other_rect = svg_revshare.selectAll("#other_tracks");
    other_rect
        .transition()
        .duration(transition_duration)
        .attr("x", x(revshare_scale_ends.x_min) )
        .attr("y",y(data.other_tracks.dsp_revenue))
        .attr("width", x(data.other_tracks.share_of_streams) )
        .attr("height", y(revshare_scale_ends.y_max-data.other_tracks.dsp_revenue)) //Needs to be y_axis_range - coordinate because vertical coordinates go from top to bottom
        .style("fill", data.other_tracks.color)
        .style("fill-opacity", data.other_tracks.opacity)
        // .style("stroke", "#5c5b5b")

    other_rect
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
    var dist_rect = svg_revshare.selectAll("#distributor_share");
    dist_rect
        .transition()
        .duration(transition_duration)
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.dist_share.dsp_revenue * (1 - data.artist_share.share)))
        .attr("width", x(data.dist_share.share_of_streams) )
        .attr("height", y(revshare_scale_ends.y_max-data.dist_share.dsp_revenue*data.dist_share.share))
        .style("fill", data.dist_share.color)
        .style("fill-opacity", data.dist_share.opacity)
        // .style("stroke", "#b8211c")

    dist_rect
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
    var artist_rect = svg_revshare.selectAll("#artist_share");
    artist_rect
        .transition()
        .duration(transition_duration)
        .attr("x", x(data.other_tracks.share_of_streams) )
        .attr("y",y(data.artist_share.dsp_revenue))
        .attr("width", x(data.artist_share.share_of_streams) )
        .attr("height", y(revshare_scale_ends.y_max-data.artist_share.dsp_revenue*data.artist_share.share))
        .attr("id","artist_share")
        .style("fill", data.artist_share.color)
        .style("fill-opacity", data.artist_share.opacity)
        // .style("stroke", "#b8211c")

    artist_rect
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


    // Add X axis
    if (revshare_rendering_options.x_axis_ticks==true){
      if (revshare_x_ticks_drawn==false){
        svg_revshare
          .append("g")
          .attr("transform", "translate(0," + (height_revshare - margin_revshare.top - margin_revshare.bottom) + ")")
          .attr("id","xticks")
          .call(d3.axisBottom(x));
        revshare_x_ticks_drawn = true;
      }
    }
    else {
      svg_revshare.selectAll("#xticks").remove();
      revshare_x_ticks_drawn = false;
    }

    // Add X axis label:
    if (revshare_rendering_options.x_axis_label==true){
      if (revshare_x_label_drawn==false){
        svg_revshare.append("text")
            .attr("text-anchor", "middle")
            .attr("x", (width_revshare - margin_revshare.left - margin_revshare.right)/2 )
            .attr("y", height_revshare - margin_revshare.top - 0.1*margin_revshare.bottom)
            .attr("id","xlabel")
            .text("Share of streams (%)");
        revshare_x_label_drawn = true;
      }
    }
    else {
      svg_revshare.selectAll("#xlabel").remove();
      revshare_x_label_drawn = false;
    }

    // Update annotations
    if (rect_rendering_options.annotations==true){
      //Add text
      var annotations = svg_revshare.selectAll('.annotations')
          .data(data_rect_values)
          .attr('transform', function(d){
            var centroid = get_rect_centroid("#"+d.label);
            return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
          });
    }   

    if (rect_rendering_options.annotations==false){
      svg_revshare.selectAll(".annotations").remove()
    }

  }


  var gs2 = d3.graphScroll()
      .container(d3.select('.container-2'))
      .graph(d3.selectAll('container-2 #graph'))
      .eventId('uniqueId2')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-2 #sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){

        console.log('graph change')
        console.log("i",i)
        // var pos = [ data, data2, data3, data4 ][i]        
        // update(pos)
        revshare_data_modifier(i)
        // data_sunburst = generate_data_dict()
        console.log('data_revshare',data_revshare)
        if (i==0){
          if (revshare_drawn==false){
            revshare_data_update();
            drawChart(data_revshare,revshare_rendering_options);
            revshare_draw_dollars(N=20);
            revshare_draw_legend(data_revshare, N=20);
            revshare_drawn = true;
          }
          else {
            revshare_data_update();
            updateChart(data_revshare,revshare_rendering_options);
          }
        }
        else {
          revshare_data_update();
          updateChart(data_revshare,revshare_rendering_options);
        }
      })


  // var color_sunburst = d3.scaleOrdinal(["#848484","#7c95bd","#848484","#848484","#848484","#ffd92f","#e5c494","#b3b3b3"]);

  // var generate_data_dict = function(){
  //   // Generate a hierarchical data dict from user inputs, to be used to plot pie chart.
  //   var data = {"name":"Royalties",
  //               "children":[]}
  //   //Calculate total streams
  //   var total_streams = Object.values(streams).reduce((a, b) => a + b, 0)
  //   // Construct data object
  //   for (const property in streams){
  //       var track_popupation = 100*streams[property]/total_streams
  //       if (property=="track1"){
  //         var track_data = {"name":property,
  //                           "children":[{"name":"Artist",
  //                                         "value":shares[property]["artist"]*track_popupation},
  //                                         {"name":"Distr/Label",
  //                                         "value":shares[property]["distr_label"]*track_popupation}
  //                                     ]
  //                         }
  //       }
  //       else {
  //         track_data = {"name":property,
  //                       "value":track_popupation}
  //       }
  //       data["children"].push(track_data)
  //   }
  //   return data
  // }

  // var data_sunburst = generate_data_dict()

  // var drawChart = function(data) {
  //   var radius = (dsp_revenue/100) * Math.min(width, height) / 2 ;
  //   // Create primary <g> element
  //   var g = d3.select(".container-2 #graph")
  //       .html('')
  //       .append('svg')
  //       .attr('width', width)
  //       .attr('height', height)
  //       .append('g')
  //       .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  //   // Data strucure
  //   var partition = d3.partition()
  //       .size([2 * Math.PI, radius]);
  //   // Find data root
  //   var root = d3.hierarchy(data)
  //       .sum(function (d) { return d.value});

  //   // Size arcs
  //   partition(root);
  //   var arc = d3.arc()
  //       .startAngle(function (d) { return d.x0 })
  //       .endAngle(function (d) { return d.x1 })
  //       .innerRadius(function (d) { return d.y0 })
  //       .outerRadius(function (d) { return d.y1 });

  //   // Add a <g> element for each node; create the slice variable since we'll refer to this selection many times
  //   var slice = g.selectAll('g')
  //       .data(root.descendants())
  //       .enter()
  //       .append('g')
  //       .attr("class", "node")
  //       .attr("id","slice");

  //   // Put it all together
  //   slice.append('path')
  //       .attr("display", function (d) { if (hidden_levels.includes(d.depth)) return "none";  })
  //       .attr("d", arc)
  //       .style('stroke', '#fff')
  //       .style("fill",  function (d) { 
  //           if (d.children){
  //             return color_sunburst(d.data.name)
  //           }
  //           else {
  //             // console.log("ELSE",d)
  //             var parent_color = d3.hsl(color_sunburst(d.parent.data.name))
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

  //   slice.append("text")
  //           .attr("display", function (d) { if (hidden_levels.includes(d.depth)) return "none";  })
  //           // .attr("transform", function(d) {
  //           //     return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
  //           .attr("transform", function(d) {
  //               return "translate(" + arc.centroid(d) + ")"; })
  //           .attr("dx", "-20")
  //           .attr("dy", ".5em")
  //           .text(function(d) { return d.parent ? d.data.name : "" });


  //   console.log("DRAW")
  // }

  // var updateChart = function(data) {

  //   var radius = (dsp_revenue/100) * Math.min(width, height) / 2 ;
    
  //   // Data strucure
  //   var partition = d3.partition()
  //       .size([2 * Math.PI, radius]);

  //   // Find data root
  //   var root = d3.hierarchy(data)
  //       .sum(function (d) { return d.value});

  //   // Size arcs
  //   partition(root);
  //   arc = d3.arc()
  //       .startAngle(function (d) {d.x0s = d.x0; return d.x0 })
  //       .endAngle(function (d) { d.x1s = d.x1; return d.x1 })
  //       .innerRadius(function (d) { return d.y0 })
  //       .outerRadius(function (d) { return d.y1 });

  //   // Put it all together
  //   var slice = d3.selectAll(".container-2 #graph").selectAll("#slice").data(root.descendants());

  //   var path = slice.select('path');
  //   // path.transition().attrTween("d", arcTweenPath);
  //   // path.transition().duration(500);
  //   // console.log("transition",path)


  //   path.transition().duration(500)
  //       .attr("display", function (d) { if (hidden_levels.includes(d.depth)) return "none";  })
  //       // .attrTween("d", arcTween)
  //       .attr("d", arc)
  //       .style('stroke', '#fff')
  //       .style("fill", function (d) { 
  //         if (d.children){
  //           return color_sunburst(d.data.name)
  //         }
  //         else {
  //           // console.log("ELSE",d)
  //           var parent_color = d3.hsl(color_sunburst(d.parent.data.name))
  //           if (d.data.name=="Artist") {
  //             // console.log("Artist parent color", parent_color)
  //             var artist_colour = parent_color
  //             // artist_colour['h'] = artist_colour['h'] + 10;
  //             // artist_colour['s'] += 0.2
  //             // artist_colour['l'] += 0.1
  //             return artist_colour;
  //           }
  //           else { 
  //             // console.log("Not Artist")
  //             var distrib_colour = parent_color
  //             // dsp_colour['h'] = dsp_colour['h'] + 5;
  //             // dsp_colour['s'] += 0.3
  //             distrib_colour['l'] += 0.15
  //             return distrib_colour;
  //           }
  //         }
  //       });

  //   text = slice.select("text");
  //   text.attr("display", function (d) { if (hidden_levels.includes(d.depth)) return "none";  })
  //       .attr("transform", function(d) {
  //           return "translate(" + arc.centroid(d) + ")"; })
  //       .attr("dx", "-20")
  //       .attr("dy", ".5em")
  //       .text(function(d) { return d.parent ? d.data.name : "" });

  //   // console.log('Pie Widht',pieWidth)
  // }
  
  
  
  ////////////////////////////////////

}
render()
d3.select(window).on('resize', render)
