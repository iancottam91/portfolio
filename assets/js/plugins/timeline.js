/* Legislation style timeline */

/*
*
*	This is currently required on all FCA content pages - soon to be added to all BP content pages
*
*/

/*
Timeline Slider

One-liner: Adds custom slider and optional fisheye to timeline
Usage: .addSlider(options);
timerValue - the speed of the slider (time in milliseconds between each move)
sliderStep - the amount to move the slider when arrow button clicked
keyNavigation - enable global arrow key handler

Required structure:

Fisheye enabled if #resultsTimeline has class "fisheye"

#resultsTimeline #timeline-wrapper #timelineData
#resultsTimeline #decades

JS Requirements: jQuery 1.4, jQuery UI 1.8, jQuery UI slider plugin


/* 
* Version 2.0 - Modified for TSO Publication Platform
*/



		
$.fn.addSlider = function(values){
	
	var timer;
	var down = false;
	var timerValue = values["timerValue"];
	var sliderStep = values["sliderStep"];	
	var keyNavigation = values["keyNavigation"];
	var timelineViewPos = values["viewPos"]; // default: to the left
	
	var timeline = $(this);
	var timelineData = $("#timeline-wrapper #timelineData");

	setWidths();
		
	// include padding in width. timelineDataWidth.outerWidth() won't be right for padded children
	var timelineDataWidth = 0;	
	timelineData.children("ol").each(function () {
		timelineDataWidth += $(this).outerWidth();
	});
	
	var decades = $(".decades");
	var fisheye = $("");
	
	if (decades.length > 0)
		var decadesMarginLeft = parseInt(decades.css("margin-left").replace("px", "")); // forcetype as integer
	var scrollPos,sliderPos;	
		
	if (timelineDataWidth >= timeline.width())
	{		
		// Set vars for default position of histogram view
		sliderPos = 100;
		scrollPos = timelineDataWidth - timeline.width();

		// if you can't see the point with the defaults, change them
		if($('.version-selected').length > 0){

			var timelineWidth = timeline.width(),
				versionPosition = $('.version-selected').position().left,
				listWidth = $('.version-selected').parent().outerWidth();

			var leftAsPercent = (versionPosition / listWidth) * 100;


			if(((listWidth - timelineWidth) > versionPosition)){
				sliderPos = leftAsPercent;
				scrollPos = leftAsPercent / 100 * (timelineDataWidth - timeline.width());
			}

		}
		
		// hide existing scrollbar
		timeline.css("overflow", "hidden");
		
		// Position the scrollbar depending on whether there is a decades list
		timeline.parent().append('<div id="scrollbar" class="timeline-scrollbar"></div>'); // Default at the end of block
		if (decades.length){
			timeline.parent().append(decades); // Move the decades block after the slider if it exists
		}
		
		var scrollbar = $("#scrollbar");	
		scrollbar.append('<div id="handle" class="ui-slider-handle"></div>');		
		scrollbar.append('<a id="arrowLeft" class="arrow timeline-arrow-left-disabled" href=""></a><span class="sliderEnd"></span><div id="slider"></div><span class="sliderEnd"></span><a id="arrowRight" class="arrow timeline-arrow-right-enabled" href=""></a>');
		
		var slider = $("#slider");
		var arrowLeft = $("#arrowLeft");
		var arrowRight = $("#arrowRight");
		slider.slider({animate:false, change: update, slide: update, step: sliderStep,value:sliderPos}).find('.ui-slider-handle').addClass('timeline-ui-slider-handle');
		
		// Set initial view of timeline
		timeline.scrollLeft(scrollPos);
		
		// add fisheye if parent has fisheye class
		if (timeline.parent().hasClass("fisheye"))
		{		
			timeline.parent().append('<div id="fisheye"></div>');		
			fisheye =	$("#fisheye");
			
			// account for absolute positioning offset
			var fisheyeOffset = $("#fisheye").position()["left"] + decadesMarginLeft;
			fisheye.width(timeline.width() / timelineDataWidth * decades.width());
			
			// Set default pos to right if required
			if (timelineViewPos==="right"){
				fisheye.css("left", (timeline.scrollLeft() * decades.width() / 

					timelineDataWidth) + fisheyeOffset);
			
			}
		}
		
		// move slider on mousedown or keydown. When held down, mousedown fires only once, keydown repeatedly.
		arrowLeft
		.mousedown(moveLeft)
		.keydown(function(e) {
			// ignore all but initial keydown event. ignore all but enter key
			if (!down && e.keyCode == 13) 
			{
				down = true;
				moveLeft();
			}
		})
		.mouseup(function() {clearTimeout(timer)})
		.mouseleave(function() {clearTimeout(timer)})
		.keyup(function() {down = false; clearTimeout(timer)});
		
		arrowRight
		.mousedown(moveRight)
		.keydown(function(e) {
			if (!down && e.keyCode == 13) 
			{
				down = true;
				moveRight();
			}
		})
		.mouseup(function() {clearTimeout(timer)})
		.mouseleave(function() {clearTimeout(timer)})
		.keyup(function() {down = false; clearTimeout(timer)});
		
		// hook arrow keys
		if (keyNavigation)
		{		
			$(document).keydown(function(e) {
					
					if (!down && e.keyCode == 37)
					{
						down = true;
						moveLeft();
					}			
					else if (!down && e.keyCode == 39)
					{
						down = true;
						moveRight();
					}
			})
			.keyup(function() {down = false; clearTimeout(timer)});
		}
		
		//prevent default link action
		$(".arrow").click(function () {
			return false;
		});
		
		// disable arrow if slider right		
		if (timelineViewPos === "right") {
			var temp = new Object();
			temp.value = 100;
			checkArrows(temp);
		}
		
		/*
		// save clicked link to cookie using href, centre in timeline when page next visited
		if (values["cookie"]) {			
			var cookieArray = new Object();
			var key = location.pathname;
			readCookie("sliderPos", cookieArray);
			
			if (cookieArray[key])
			{
				var link = $("a[href$=\"" + cookieArray[key] + "\"]", timeline);
				var linkPosition = link.offset().left - timelineData.offset().left - (timeline.width() / 2);
				timeline.scrollLeft(linkPosition);
			
				var ui = new Object();
				ui["value"] = linkPosition * 100 / (timelineDataWidth - timeline.width());
				update(null, ui);	
			
				slider.slider("option", "value", ui["value"]);
			}			
			
			// save link's href attribute to cookie
			$("a", timeline).click(function(event) {								
				updateid("sliderPos", cookieArray, key, $(this).attr("href"), cookieExpire);
			});			
		}*/
		
		// timeline
		// match /ukpga/1977 etc
		var path = location.pathname;
		var regex = /\/[^\/]*\/\d*-?\d*$/;
		
		var year = path.match(regex);
		
		if (year)
			year = year[0];
		
		var link = $("a[href$='" + year + "']", timeline);
		
		// point in time
		if (link.length != 1) {
			var link = $("#timeline-wrapper #timelineData .timeline-current-version");
		}
		
		if (link.length == 1)
		{			
			var linkPosition = link.offset().left - timelineData.offset().left - (timeline.width() / 2);
			timeline.scrollLeft(linkPosition);
			
			var ui = new Object();
			
			// (divided by maxscroll)
			ui["value"] = linkPosition * 100 / (timelineDataWidth - timeline.width());
			update(null, ui);
			
			slider.slider("option", "value", ui["value"]);
		}
	}

	function setWidths(listItemWidth)
	{

	var timeline = $('#timeline-wrapper');

		// ensure we don't go into an infinite loop
		if(timeline.length !== 0){
			
			var incremenet = 10;

			
			var	timelineContent = $('#timelineData'),
				timelineList = timelineContent.find('> ol'),
				timelineDateElements = timelineContent.find('> ol > li:not(.point-in-time)'),
			 	numberOfDates = timelineDateElements.length;

			var timelineListPadding = (timelineList.outerWidth() - timelineList.width());

			// if no list item width value is passed, just set the content width to listItemWidth * numberOfItems
			if(listItemWidth === undefined){

				var listItemWidth = timelineDateElements.width();
				var timelineContentWidth = (listItemWidth * numberOfDates);
				
				// set the timeline content width
				timelineContent.width(timelineContentWidth);

				// handle the special case of the point in time at the end of the list
				// timelineList.find('.point-in-time:last-child').css({'width' : listItemWidth / 3, 'margin-left' : -listItemWidth / 3});
				
				// ensure we don't go into an infinite loop
				if(timelineContentWidth < timeline.width() && timelineContentWidth !== 0){
					setWidths(listItemWidth + incremenet);
				}

			//	if a value is passed and the width of the content is less that the container, try to increase it
			} else if(listItemWidth * numberOfDates < (timeline.width() - timelineListPadding * 2)) {

				// increase the point in time when it's above a pin to the same width
				timelineContent.find('.above .point-in-time').css({'width' : listItemWidth});

				// increase the widths of the list items
				timelineDateElements.width(listItemWidth);

				// handle the special case of the point in time at the end of the list
				// timelineList.find('.point-in-time:last-child').css({'width' : listItemWidth / 3, 'margin-left' : -listItemWidth / 3});

				// set the timeline content with to be the new, bigger value
				var timelineContentWidth = listItemWidth * numberOfDates;
				// call this method to try and increase the width again
				timelineContent.width(timelineContentWidth);

				setWidths(listItemWidth + incremenet);


			}
		}	
		
	}


	
	// move slider one step
	function moveLeft()
	{
		var value = slider.slider("option", "value");
		slider.slider("option", "value", value - sliderStep);
		
		checkSliderWithinBounds();
		timer = setTimeout(moveLeft, timerValue);
	}
	
	function moveRight()
	{
		var value = slider.slider("option", "value");		
		slider.slider("option", "value", value + sliderStep);	
		
		checkSliderWithinBounds();		
		timer = setTimeout(moveRight, timerValue);		
	}
	
	// update timeline and fisheye position
	function update(e, ui)
	{	
		// account for part of timeline within view				
		var maxScroll = timelineDataWidth - timeline.width();
		
		timeline.scrollLeft(maxScroll * ui.value / 100);
				
		fisheye.css("left", (timeline.scrollLeft() * decades.width() / timelineDataWidth) + 

		fisheyeOffset);	
		
		checkArrows(ui);		
	}
	
	//disable arrows at limits
	function checkArrows(ui)
	{
		if (ui.value == 0) {
			arrowLeft.addClass("timeline-arrow-left-disabled").removeClass("timeline-arrow-left-enabled");
			arrowRight.addClass("timeline-arrow-left-enabled").removeClass("timeline-arrow-left-disabled");
		}
		else if (ui.value == 100) {
			arrowLeft.addClass("timeline-arrow-left-enabled").removeClass("timeline-arrow-left-disabled");
			arrowRight.addClass("timeline-arrow-right-disabled").removeClass("timeline-arrow-right-enabled");				
		}
		else {
			arrowLeft.addClass("timeline-arrow-left-enabled").removeClass("timeline-arrow-left-disabled");
			arrowRight.addClass("timeline-arrow-right-enabled").removeClass("timeline-arrow-right-disabled");
		}			
	}
	
	// slider plugin allows out of range values, breaking arrow buttons
	function checkSliderWithinBounds()
	{		
		if (slider.slider("option", "value") <= 0)
			slider.slider("option", "value", 0);			
		else if (slider.slider("option", "value") >= 100)		
			slider.slider("option", "value", 100);
	}

	return $(this);

};