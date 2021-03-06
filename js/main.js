/* STATE VARIABLES */ 


var bars,svg,selected_place,selected_day,UV,startTime,endTime,loudness, loudness_index,whenLimits,preference,place_rec
preference = 'where'
selected_place = 'lev';
var DATE = new Date()
today = (['sun','mon','tue','wed','thu','fri','sat'])[DATE.getDay()]
selected_day = today;
loudness = [10,20,30,1000]
loudness_index = 1
whenLimits = [0,23]
var placeList = Object.keys(PLACES).map(function (key) { return PLACES[key].id; }); 

$(document).ready(function(){
    var loudSlider = document.getElementById('loud-select');
        loudSlider.style.height = '300px';
        loudSlider.style.margin = '0 auto 30px';
        noUiSlider.create(loudSlider, {
            behaviour: 'tap-drag',
            start: [0],
            tooltips: [true],
            connect: [true,false],
            range: {
                'min': [ 0 ],
                'max': [ 3 ]
            },
            step: 1,
            orientation: 'vertical',
            format: wNumb({
		    decimals: 0,
            })
            
        });
    loudSlider.noUiSlider.on('slide',updateLoud)
    $("#"+today).click();
    $(".choice").click(function(){
        $(this).siblings().removeClass("active")
        $(this).addClass("active");
    })
    $(".day-select").click(function(){
        $(this).siblings().removeClass("selected")
        $(this).addClass("selected");
        updateDay($(this).attr('id'),updateVisualization);
    })
    $(".day-select-alt").click(function(){
        $("#"+today).click();
    })
    $(".pref").click(function(){
        $("#choice-action").empty();
        if($(this).attr('id') == 'where'){
            preference = 'where'
            $('#preference').text(preference)
            whereInject();
        }
        else{
            preference = 'when'
            $('#preference').text(preference)
            whenInject(); 
        }
        moveToChoices()
    })
    $("#back").click(moveLeft);
    $('#place-rec').click(function(){ updateVisualization(place_id=place_rec)})
    $(".selection-arrow").click(function(){
        if($(this).hasClass('left'))
            updatePlace(placeList[(placeList.indexOf(selected_place)+placeList.length-1)%placeList.length],updateVisualization)
        else
            updatePlace(placeList[(placeList.indexOf(selected_place)+1)%placeList.length],updateVisualization)
    });

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
    $("#choice-action").append("<h1 class='text-upper'>Pick a place.</h1><h2>Choose from any of the following, then press <span class='text-green'>CONTINUE.</span></h2><input name='place-search' id='place-search' type='text' placeholder='Search a place here.'><br>");
    $("#choice-action").append('<div id="continue"><span class="text-white text-upper"><b>CONTINUE</b></span></div>');
    $("#continue").click(moveToResults);
    for(place in PLACES){
        $("#choice-action").append("<div class='place choice' id='"+PLACES[place].id+"'><p class='text-upper text-red'>"+PLACES[place].name+"</p><p>Capacity: "+PLACES[place].capacity+" People</p><p><span class='text-green text-upper'>OPEN</span> | "+PLACES[place].open+"</p></div>")
    }
    $(".choice").click(function(){
        $(this).siblings().removeClass("active")
        $(this).addClass("active");
        updateRec(preference);
    })
    $(".place").click(function(){
        updatePlace($(this).attr("id"),updateVisualization);
        updateRec(preference);
    })
    $("#place-search").keyup(function(){
        search($(this).val().toLowerCase())
    })
}
function whenInject(){
    var whenSlider;
    $("#choice-action").append("<h1 class='text-upper'>Pick a time.</h1><h2>Pick a time by adjusting the sliders below.</h2><br><div id='when-box'><div><div id='when-slider'></div></div><div><div class='when-preselect' id='morning'><img src='img/morning.png'><br><span>MORNING</span></div><br><div class='when-preselect' id='afternoon'><img src='img/afternoon.png'><br><span>AFTERNOON</span></div><br><div class='when-preselect' id='evening'><img src='img/evening.png'><br><span>EVENING</span></div></div></div>")
        whenSlider = document.getElementById('when-slider');
        whenSlider.style.height = '80%';
        whenSlider.style.margin = '0 auto';
        noUiSlider.create(whenSlider, {
            behaviour: 'tap-drag',
            start: [ 0, 12 ],
            tooltips: [true,true],
            connect: [false,true,false],
            range: {
                'min': [ 00 ],
                'max': [ 23 ]
            },
            format: wNumb({
		    decimals: 2,
            suffix: 'H',
            mark: ':'
	}),
            step: 1,
            orientation: 'vertical'
        });
    whenSlider.noUiSlider.on('slide',updateTime([10,20],updateVisualization))
    $("#choice-action").append('<div id="continue"><span class="text-white text-upper">CONTINUE</span></div>');
    $("#continue").click(moveToResults);
    $('.when-preselect').click(function(){
        switch($(this).attr('id')){
            case 'morning': whenLimits = [6,12];  whenSlider.noUiSlider.set([6,12]); selected_place = updateRec(preference); updateVisualization(); break;
            case 'afternoon': whenLimits = [12,18];  whenSlider.noUiSlider.set([12,18]); selected_place = updateRec(preference); updateVisualization(); break;
            case 'evening': whenLimits = [18,23];  whenSlider.noUiSlider.set([18,23]); selected_place = updateRec(preference); updateVisualization(); break;
        }
    })
}
function updatePlace(str,fn=null){
    selected_place = str;
    fn(place_id=str);
}
function updateDay(str,fn=null){
    selected_day = str;
    fn(place_id=selected_place,day_id=str);
}
function updateLoud(){
    loudness_index = parseInt(loudSlider.noUiSlider.get());
    updateVisualization(place_id=selected_place,day_id=selected_day,loud=loudness_index);
}
function updateTime(arr,fn=null){
    whenLimits = arr;
    fn(place_id=selected_place,day_id=selected_day,loud=loudness_index,when=whenLimits)
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
var margin = {top: 20, right: 30, bottom: 50, left: 30},
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
    .tickFormat(function(d){
        var suffix = d< 12 ? 'AM' : 'PM'
        return ((d%12)+1)+suffix
    })

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
        //.call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(0," + (height+10) + ")")
        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + width / 2 + "," + margin.bottom / 1.3 + ")")
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

function updateVisualization(place_id=selected_place,day_id=selected_day,loud=loudness_index,when=whenLimits,pref=preference){
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
            .attr("opacity",function(d){
                if(pref == 'when'){
                    if(d.time >= whenLimits[0] && d.time <= whenLimits[1]){
                        
                        if(d.value<loudness[loud]){
                            return 1;
                        }
                            
                        else
                            return 0.6;
                    }
                }
                else {
                        if(d.value<loudness[loud]){
                            return 1;
                        }
                            
                        else
                            return 0.6;
                }
                return 0.6
                
            })
        $('#selection-name').text(PLACES[place_id].name)
    })
};
    
// Define responsive behavior
function resize() {
  width = parseInt(d3.select("#graph").style("width")) - margin.left - margin.right,
  height = parseInt(d3.select("#graph").style("height")) - margin.top - margin.bottom;

  // Update the range of the scale with new width/height
  xScale.range([0, width]);
  yScale.range([0, height]);

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
    .attr("x", function(d) { return xScale(d.time); })
    .attr("width", barWidth)
    .attr("y", function(d){ return yScale(d.value)})
    .attr("rx", barRadius)
    .attr("ry", barRadius)
    .attr("opacity",function(d){
                if(d<loudness[loudness_index])
                    return 1;          
                else
                    return 0.6;
            })
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

function updateRec(pref){
    var placeLoud = {}
    placeList.forEach(function(x){ placeLoud[x] = 0 });
    if(pref == 'where'){
        place_rec = selected_place;
    }
    else{
        placeList.forEach(function(place){
            d3.csv("data/"+place+"_"+selected_day+".csv", format, function(error, data){
                data = data.filter(function(d){ return d.time >= whenLimits[0] && d.time <= whenLimits[1]})
                data.forEach(function(d){
                    placeLoud[place] += d.value;
                });
                placeLoud[place] = placeLoud[place]/data.length
            })
        })
        place_rec = placeList.reduce(function(prev, curr) {
            return placeLoud[prev] < placeLoud[curr] ? prev : curr;
        });
    }
    $('#place-rec').text(PLACES[place_rec].name);
    return place_rec
}
})

/*
<div class='place choice' id='lamont'><p class='text-upper text-red'>Lamont Library</p><p>Capacity: 80 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div><div class='place choice' id='md-lobby'><p class='text-upper text-red'>Maxwell Dworkin Lobby</p><p>Capacity: 30 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div><div class='place choice' id='lev'><p class='text-upper text-red'>Leverett Dining Hall</p><p>Capacity: 150 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div>
*/