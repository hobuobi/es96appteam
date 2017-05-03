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
    $("#choice-action").append("<h1 class='text-upper'>Pick a place.</h1><h2>Choose from any of the following, then press CONTINUE.</h2><input name='place-search' id='place-search' type='text' placeholder='Search a place here.'><br><div class='place choice' id='lamont'><p class='text-upper text-red'>Lamont Library</p><p>Capacity: 80 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div><div class='place choice' id='md-lobby'><p class='text-upper text-red'>Maxwell Dworkin Lobby</p><p>Capacity: 30 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div><div class='place choice' id='lev'><p class='text-upper text-red'>Leverett Dining Hall</p><p>Capacity: 150 People</p><p><span class='text-green text-upper'>OPEN</span> | Open from 8AM to 12AM</p></div>");
    $("#choice-action").append('<div id="continue"><span class="text-white text-upper">CONTINUE</span></div>');
    $("#continue").click(moveToResults);
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
                'max': [ 23 ]
            },
            format: wNumb({
		    decimals: 2,
            mark: ':'
	}),
            step: 1,
            orientation: 'vertical'
        });
    $("#choice-action").append('<div id="continue"><span class="text-white text-upper">CONTINUE</span></div>');
    $("#continue").click(moveToResults);
}

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
})