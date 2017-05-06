var bars,svg,selected_place,selected_day,UV
var placeList = Object.keys(PLACES).map(function (key) { return PLACES[key].id; }); 
$(document).ready(function(){
    $(".choice").click(function(){
        $(this).siblings().removeClass("active")
        $(this).addClass("active");
    })
    $(".pref").click(function(){
        $("#choice-action").empty();
        if($(this).attr('id') == 'where'){
            whereInject();
        }
        else{
            whenInject();
        }
        moveToChoices()
    })
    $("#back").click(moveLeft);
    $(".selection-arrow").click(function(){
        if($(this).hasClass('left'))
            updatePlace(placeList[(placeList.indexOf(selected_place)+placeList.length-1)%placeList.length],updateVisualization)
        else
            updatePlace(placeList[(placeList.indexOf(selected_place)+1)%placeList.length],updateVisualization)
    });
/* STATE VARIABLES */ 

selected_place = 'lev';
selected_day = 'mon'

/* FUNCTIONS */
function moveToChoices(){

    $("#main").animate({
        left: '-50%'
    },300)
}
function moveToResults(){
    $("#main").animate({
        left: '-150%'
    },300)
}
function moveLeft(){
    var left = +(($('#main').css('left')).substring(0,($('#main').css('left')).indexOf('px')))
    if(left <= -($(window).width())){
        $("#main").animate({
            left: left+$(window).width()
        },300)
    }
    else
        if(left <= -($(window).width()/2)){
            $("#main").animate({
                left: left+$(window).width()/2
            },300)
        }
}
function whereInject(){
    $("#choice-action").append("<h1 class='text-upper'>Pick a place.</h1><h2>Choose from any of the following, then press CONTINUE.</h2><input name='place-search' id='place-search' type='text' placeholder='Search a place here.'><br>");
    $("#choice-action").append('<div id="continue"><span class="text-white text-upper">CONTINUE</span></div>');
    $("#continue").click(moveToResults);
    for(place in PLACES){
        $("#choice-action").append("<div class='place choice' id='"+PLACES[place].id+"'><p class='text-upper text-red'>"+PLACES[place].name+"</p><p>Capacity: "+PLACES[place].capacity+" People</p><p><span class='text-green text-upper'>OPEN</span> | "+PLACES[place].open+"</p></div>")
    }
    $(".choice").click(function(){
        $(this).siblings().removeClass("active")
        $(this).addClass("active");
    })
    $(".place").click(function(){
        updatePlace($(this).attr("id"),updateVisualization);
//        updateVisualization();
    })
    $("#place-search").keyup(function(){
        search($(this).val().toLowerCase())
    })
}
function whenInject(){
    $("#choice-action").append("<h1 class='text-upper'>Pick a time.</h1><h2>Pick a time by adjusting the sliders below.</h2><br><div id='when-box'><div class='half'><div id='when-slider'></div></div><div class='half'><div class='when-preselect' id='morning'><img src='img/morning.png'></div><div class='when-preselect' id='afternoon'><img src='img/afternoon.png'></div><div class='when-preselect' id='evening'><img src='img/evening.png'></div></div></div>")
    var whenSlider = document.getElementById('when-slider');
        whenSlider.style.height = '400px';
        whenSlider.style.margin = '0 auto 30px';
        noUiSlider.create(whenSlider, {
            behaviour: 'tap-drag',
            start: [ 0, 12 ],
            tooltips: [true,true],
            connect: [false,true,false],
            range: {
                'min': [ 00 ],
                'max': [ 24 ]
            },
            format: wNumb({
		    decimals: 2,
            suffix: 'H',
            mark: ':'
	}),
            step: 1,
            orientation: 'vertical'
        });
    $("#choice-action").append('<div id="continue"><span class="text-white text-upper">CONTINUE</span></div>');
    $("#continue").click(moveToResults);
}
function updatePlace(str,fn=null){
    selected_place = str;
    fn(place_id=str);
}
function search(str){
    for(place in PLACES){
        if((PLACES[place].name).toLowerCase().includes(str)){
            $("#"+PLACES[place].id).show();
        }
        else
            $("#"+PLACES[place].id).hide();
    }
}
    /* GRAPH FUNCTIONS */
var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = parseInt(d3.select("#graph").style("width")) - margin.left - margin.right,
    height = parseInt(d3.select("#graph").style("height")) - margin.top - margin.bottom;

var yScale = d3.scale.linear()
    .range([0,height]);

var xScale = d3.scale.linear()
    .range([0, width]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")

svg = d3.select("#graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/"+selected_place+"_"+selected_day+".csv", format, function(error, data){
    if (error) throw error;

    yScale.domain([d3.max(data, function(d) { return d["value"]; }),0]);
    xScale.domain([0, d3.max(data, function(d) { return d["time"]; })]);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(0," + (height+10) + ")")
        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + width / 2 + "," + margin.bottom / 1.5 + ")")
        .style("text-anchor", "middle")
        .text("Time");
    barRadius = width/400;
    barWidth = width/30
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("height", function(d) { return height-yScale(d.value); })
        .attr("x", function(d) { return xScale(d.time)-barWidth/2; })
        .attr("width", barWidth)
        .attr("y", function(d){ return yScale(d.value)})
        .attr("rx", barRadius)
        .attr("ry", barRadius)

})

function loudInject(){
    $("#choice-select").append("<div id='loud-select'></div>")
    var loudSlider = document.getElementById('loud-select');
        loudSlider.style.height = '400px';
        loudSlider.style.margin = '0 auto 30px';
        noUiSlider.create(loudSlider, {
            behaviour: 'tap-drag',
            start: [ 0, 12 ],
            tooltips: [true,true],
            connect: [false,true,false],
            range: {
                'min': [ 00 ],
                'max': [ 24 ]
            },
            format: wNumb({
		    decimals: 2,
            suffix: 'H',
            mark: ':'
	}),
            step: 1,
            orientation: 'vertical'
        });
}
function updateVisualization(place_id=selected_place,day_id=selected_day){
    console.log("data/"+place_id+"_"+day_id+".csv")
    d3.csv("data/"+place_id+"_"+day_id+".csv", format, function(error, data){
        console.log(data)
        if (error) throw error;

        barRadius = width/400;
        barWidth = width/30;
        bars = svg.selectAll(".bar").data(data);
        bars.exit().remove();
        bars
            .enter().append("rect")
        bars
            .transition()
            .duration(500)
            .attr("class", "bar")
            .attr("height", function(d) { return height-yScale(d.value); })
            .attr("x", function(d) { return xScale(d.time)-barWidth/2; })
            .attr("width", barWidth)
            .attr("y", function(d){ return yScale(d.value)})
            .attr("rx", barRadius)
            .attr("ry", barRadius)
        $('#selection-name').text(PLACES[place_id].name)
    })
};
    
// Define responsive behavior
function resize() {
  width = parseInt(d3.select("#graph").style("width")) - margin.left - margin.right,
  height = parseInt(d3.select("#graph").style("height")) - margin.top - margin.bottom;

  // Update the range of the scale with new width/height
  xScale.range([0, width]);
  yScale.range([height, 0]);

  // Update the axis and text with the new scale
  svg.select(".x.axis")
    .call(xAxis)
    .attr("transform", "translate(0," + (height+10) + ")")
    .select(".label")
      .attr("transform", "translate(" + width / 2 + "," + margin.bottom / 1.5 + ")");

  svg.select(".y.axis")
    .call(yAxis);


  // Force D3 to recalculate and update the line
  barRadius = width/400;
  barWidth = width/30;
  svg.selectAll(".bar")
    .attr("height", function(d) { return height-yScale(d.value); })
    .attr("x", function(d) { return xScale(d.time)-barWidth/2; })
    .attr("width", barWidth)
    .attr("y", function(d){ return yScale(d.value)})
    .attr("rx", barRadius)
    .attr("ry", barRadius)
};

// Call the resize function whenever a resize event occurs
d3.select(window).on('resize', resize);

// Call the resize function
//resize();

// Define the format function
function format(d) {
  d.value = +d.value;
  d.time = +d.time;
  return d;
}
UV = updateVisualization;
})

/*
<div class='place choice' id='lamont'><p class='text-upper text-red'>Lamont Library</p><p>Capacity: 80 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div><div class='place choice' id='md-lobby'><p class='text-upper text-red'>Maxwell Dworkin Lobby</p><p>Capacity: 30 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div><div class='place choice' id='lev'><p class='text-upper text-red'>Leverett Dining Hall</p><p>Capacity: 150 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div>
*/