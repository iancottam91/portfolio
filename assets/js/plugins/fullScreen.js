// Show handbook content in full screen - reuse code from glossary JS

FullScreen = {

	init: function() {

		// Set up the click handlers.
		this.bindUIActions();

	},

	bindUIActions: function(){
		$('body').on('click', '.full-screen-trigger' , function(e){
			e.preventDefault();
			FullScreen.displayFullScreen();

		});

		$('body').on('click', '.full-screen-view .close', function(){

			$(this).parent().dialog("destroy");

		});

	},

	displayFullScreen : function(){

		if($('.full-screen-view').length == 0){

			$("body").append('\
				<div class="full-screen-view">\
				</div>\
			');

			var title = $('.col_cx .handbook-content h1, .col_cx .glossary-content h1, .col_cx #publication-content h1');
			var t = title.clone();
			var titleStripped = $('.changed-by',t).remove().end().clone();


			var fullScreenDialog = $('.col_cx .handbook-content, .col_cx .glossary-content, .col_cx #publication-content').clone().appendTo("body .full-screen-view").attr('title',titleStripped.text());

			fullScreenDialog.dialog({
	            resizable: false,
	            width: '90%',
	            // left: '5%',
	            // height: screenHeight,
	            dialogClass:'full-screen-dialog',
	            modal: true,
	            open : function(event, ui) {
			    	$(this).scrollTop(0);
			    	$('.full-screen-dialog .handbook-content h1, .full-screen-dialog .glossary-content h1, .full-screen-dialog #publication-content h1').remove();
			    	$('.full-screen-dialog .full-screen-trigger').remove();

			    	$('.ui-widget-overlay').bind('click', function(){
						fullScreenDialog.dialog('close');
					});

					$('.ui-dialog-titlebar-close').focus();
			    }

	            // ,position : { my : "left bottom-28" , of : $(".full-screen")}	            
	        }).closest('.ui-dialog').css({
	        	'position' : 'fixed',
	        	'height' : '90%',
	        	'top' : '5%',
	        	'left' : '5%',
	        	'overflow-y' : 'auto'
	        });
		} else {
			$('.handbook-content.ui-dialog-content, .glossary-content.ui-dialog-content, #publication-content.ui-dialog-content').dialog('open').closest('.ui-dialog').css({
	        	'position' : 'fixed',
	        	'height' : '90%',
	        	'top' : '5%',
	        	'left' : '5%',
	        	'overflow-y' : 'auto'
	        });
		}
	},

	
}