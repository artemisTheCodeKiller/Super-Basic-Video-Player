// JavaScript Document
$(function(){
	"use strict";
	//create the variables
	
	
	var videoContainers = {
		$videoContainer : $('.super-basic-player'),
		$videoControls : $('.super-basic-controls'),
		$hovering : 0,	
	};
	
	var video = {
		$video : $('#SB-video'),
		$videoObj: $('#SB-video')[0],
		$current : $('.current-time'),
		$playPause : $('.play-pause'),
		$duration : $('.duration'),
		$bufferBar : $('.load-progress'),
		$timeBar : $('.progress-slider'),
		$timeBarHandle : $('.progress-slider > .ui-slider-handle'),
		$timeSlide : false,
		$volumeSlide : 1,
		$audioSlider : $('.volume-bar'),
		$muteUnmute : $('.mute-unmute'),
		$auHandle : $('.mute-unmute > .ui-slider-handle'),
		$BigPlay : $('.big-play-btn'),
		$completeLoaded : false,
	};
	
	/*var loading = {
		$loaded : $('.loading')
	};*/
	
	/*loading.$loaded.fadeIn(500);*/
	
	/*var full = {
			
	};*/
	
	//remove the controls
	
	video.$video.removeAttr('controls');
	
	video.$video.on('loadedmetadata', function(){
		setTimeout(updateLoadProgress, 500);
		
	});
	
	video.$video.on("timeupdate", function(){
		currentTime();
	});
	
	video.$video.on("durationchange", function(){
		DurationTime();
	});
	
	video.$video.on("canplay" , function(){
		/*loading.$loaded.fadeOut(200);*/	
	});
	
	video.$video.on('seeking', function() {
		//if video fully loaded, ignore loading screen
		/*if(!video.$completeLoaded) { 
			loading.$loaded.fadeIn(200);
		}*/	
	});
	
	video.$video.on("canplaythrough", function(){
		video.$completeLoaded = true;
		updateLoadProgress();
	});
	
	video.$video.on('waiting', function() {
		/*loading.$loaded.fadeIn(200);*/
	});
	seekBar();
	
	
	function updateLoadProgress(){
		var currentBuffer = video.$videoObj.buffered.end(0);
		var maxduration = video.$videoObj.duration;
		var perc = 100 * currentBuffer / maxduration;
		video.$bufferBar.css('width',perc+'%');
			
		if(currentBuffer < maxduration) {
			setTimeout(updateLoadProgress, 500);
		}
	}
	
	
	
	function playpause(){
		if (video.$videoObj.paused || video.$videoObj.ended) {
			video.$videoObj.play();
			video.$playPause.css('background-position', '0 -32px');
		} else {
			video.$videoObj.pause();
			video.$playPause.css('background-position', '0px 0px');
		}
	}
	
	function videoPlayPause(){
		if (video.$videoObj.paused || video.$videoObj.ended) {
			video.$videoObj.play();
			video.$playPause.css('background-position', '0 -32px');
			/*video.$BigPlay.fadeOut(200);*/
		} else {
			video.$videoObj.pause();
			video.$playPause.css('background-position', '0px 0px');
			/*video.$BigPlay.fadeIn(200);*/
		}	
	}
	
	/*video.$BigPlay.click(videoPlayPause);*/
	
	/*function hideShowControls(){
		if (video.$videoObj.paused || video.$videoObj.ended){
			videoContainers.$videoControls.fadeOut().stop().animate({'bottom': 0}, 500);
			videoContainers.$videoControls.fadeIn().stop().animate({'bottom': 55}, 500);	
		} else {
			
		}
	}*/
	
	//loading time.
	
	video.$playPause.click(playpause);
	video.$video.click(videoPlayPause);
	
	function currentTime(){
		video.$current.html(formatTime(video.$videoObj.currentTime));
	}
	
	function DurationTime(){
		video.$duration.html(formatTime(video.$videoObj.duration));
	}
	
	function formatTime(seconds) {
    		seconds = Math.round(seconds);
    		var minutes = Math.floor(seconds / 60);
    		// Remaining seconds
    		seconds = Math.floor(seconds % 60);
   	 		// Add leading Zeros
    		minutes = (minutes >= 10) ? minutes : "0" + minutes;
    		seconds = (seconds >= 10) ? seconds : "0" + seconds;
    		return minutes + ":" + seconds;
  	}
	
	//progress bar
	function seekBar(){
		
	video.$video.on({
        canplaythrough: function() {
            var vid = this;
			var $vidTimeBar = video.$timeBar;
           	$vidTimeBar.slider({
                range: "min",
                min: 0,
                max: parseInt(vid.duration, 10),
                value: 0,
                slide: function (event, ui) {
                    vid.currentTime = ui.value;
                }
            });
        },
        timeupdate: function() {
			var $vidTimeBar = video.$timeBar;
            $vidTimeBar.slider('value', this.currentTime);
        },
		ended : function(){
			var vid = this;
			vid.currentTime = 0;
			/*video.$Replay.click(Replay);*/
		}
    });
	/*function Replay(){
			
	}*/
}

//volume control

function volumeBar(){
	video.$audioSlider.slider({
		orientation : "horizontal",
		value : 1,
		min : 0,
		range : 'min',
		max : 1,
		step : 0.02,
		animate : true,
		slide: function(e,ui){
			video.$videoObj.muted = false;
			video.$videoObj.volume = ui.value;
			updateVolume();
		}	
	});
} volumeBar();	
	
	function updateVolume(x, vol){
		var volume = video.$audioSlider;
		var percentage;
		//if only volume have specificed
		//then direct update volume
		if(vol) {
			percentage = vol * 100;
		}
		else {
			var position = x - volume.offset().left;
			percentage = 100 * position / volume.width();
		}
		
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		
		//change volume icons
		
		if(video.$videoObj.volume === 0){
			video.$muteUnmute.css('background-position', '0 0');
		}
		else if(video.$videoObj.volume > 0.5){
			video.$muteUnmute.css('background-position','0 -96px');
		}
		
		else{
			video.$muteUnmute.css('background-position','0 -64px');
		}
	}
	
	//mute and unmute buttons
	
	function muteVideo() {
		var SBVolume = video.$volumeSlide;
	  if (video.$videoObj.volume > 0) {
		  video.$videoObj.volume = 0;
		video.$muteUnmute.css('background-position','0 0px');
		 video.$audioSlider.slider('value' , '0');
	  } else {
		  video.$videoObj.volume = 1;	
		  video.$muteUnmute.css('background-position','0 -96px');
		 
		 video.$audioSlider.slider('value' , SBVolume);
	  }
	  return false;
	}
	
	video.$muteUnmute.click(muteVideo);
	
	
		
});

