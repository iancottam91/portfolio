/* Glossary Module Code */
/* This is the new code for the proposed experience */

Glossary = {

  // Empty Arrays
  clickedTerms: [], // clickedTerms empty array so we need to limit this to 4 (0 to 4)

  // reference to which glossary term in Local Storage is actually showing
  currentIndex: 0,

  // Maximum load time for ajaxing a glossary term.
  maxLoadTime: 16000,

  boxState: 'default',

  // Settings
  settings: {
    link : '.autodeftext',
    contentBox: '.glossary-term-content',
    closeButton: '.close',
    maximumHistorySize: 2
  },

  // initialise the settings and actions for the glossary.
  init: function() {

    // Set up the click handlers.
    this.bindUIActions();

  },

  // bind functions to dom elements
  bindUIActions: function(){

    // open the dialog box & display the content
    $('body').on('click', Glossary.settings.link,  function(e){
      // don't perform the default behaviour when a link is clicked - the link is set up to link to the full article, incase JavaScript is disabled.
      e.preventDefault();
      var position = $(this).position();
      var linkClicked = $(this);

      Glossary.loadContent(linkClicked);

    });

    // close the dialog box & display the content
    $('body').on('click', Glossary.settings.closeButton , function(e){
      Glossary.destroyDialog($(this));
    });

    // Navigative the terms in the box.
    $('body').on('click', '.glossary-header .navigate', function(e){
      Glossary.navigateTermsNew($(this));
    });

    // Minimise the terms box.
    $('body').on('click', '.glossary-header .minimise', function(e){
      if(Glossary.boxState == 'default'){
        Glossary.minimiseTermBox($(this));
      } else if(Glossary.boxState == 'maximised'){
        Glossary.defaultBoxPosition($(this));
      }
    });

    // Maximise the terms box.
    $('body').on('click', '.glossary-header .maximise', function(e){
       if(Glossary.boxState == 'default'){
        Glossary.maximiseTermBox($(this));
      } else if(Glossary.boxState == 'minimised'){
        Glossary.defaultBoxPosition($(this));
      }
    });

    // Default position box.
    $('body').on('click', '.glossary-header .default', function(e){
      Glossary.defaultBoxPosition($(this));
    });

    // close glossary box on esc:
    $(document).keyup(function(e) {
      if (e.which == 27) {
        $(".glossary-term-content").hide(); 
      }
    });

    // Move the glossary box with the window resize

    $(window).on('resize', function(){
      Glossary.calculatePosition();
      Glossary.calculateHeight();
    });

  },

  // Scroll down to glossary term content box (.glossary-term-content) after clicking on anchors
  // Depricated.
  scrollToContent : function(linkClicked){

      var offset = linkClicked.offset();
      offset.top -= 20;
      offset.left -= 20;

      $('html, body').animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
      });
  },

  // Load the content in the box from remote file or local storage (cache)
  loadContent: function(linkClicked, dialogLink){

    var path = linkClicked.attr('href');

    // temporary code to enable the links in a glossary dialog to show another
    if(dialogLink){
      path = '/handbook/glossary/' + path;
    }

    var term;


    // if it is not already in local storage, load it into local storage
    if( !Glossary.isCachedTerm( path ) ){

      // console.log('ajax the file');

      // load the glossary term from a remote file
      Glossary.loadRemoteFile( path, dialogLink, linkClicked );

    } else {

      // add the path of the term clicked to an array. If it's already in the array remove it. Do this before the loading
      if($.inArray(path , Glossary.clickedTerms) !== -1){
        var index = $.inArray(path , Glossary.clickedTerms);
        Glossary.clickedTerms.splice(index,1);
      }
      Glossary.clickedTerms.push(path);

      // load it from the cache
      term = Glossary.loadCachedTerm( path );

      Glossary.showDialog( term, linkClicked, dialogLink );


    }

    $('.navigation-control-box .close').focus();


  },

  // returns true if a glossary term is in local storage or not, based on the path
  isCachedTerm: function(path){

    // console.log(path);

    // check if there is a value at the respective local storage term
    if (localStorage.getItem( path ) === null ) {
      return false;
    } else {
      return true;
    }

  },

  // Load a glossary term from cache
  loadCachedTerm: function(path){

    // get the STRING value from local storage
    var termAsAString = localStorage.getItem( path );

    // convert the STRING value to an actual JavaScript object....
    var termAsAnObject = JSON.parse( termAsAString );

    // return the javascript object
    return termAsAnObject;

  },

  addLoadingGif: function(){

    var windowWidth = $(window).width();
    var windowMarginLeft = (windowWidth - 960) / 2;
    var col_cxWidth = $('.col_cx').width();
    var col_cxMarginLeft = parseInt($('.col_cx').css('margin-left'));

    var gifLeft = windowMarginLeft + col_cxMarginLeft + col_cxWidth / 2;


    $('.col_cx').append("\
      <div class='loading-gif-overlay'></div>\
      <span class='loading-gif gif'></span>\
    ");

    $('.loading-gif').css({left : gifLeft});

  },

  // Loads the Glossary Term from an HTML file, and parses it
  loadRemoteFile: function( path, dialogLink, linkClicked ){

    // Use AJAX to get the URL + dataType to parse.
    $.ajax({
      url: path,
      type: 'get',
      dataType: "html",
      timeout: Glossary.maxLoadTime,
      beforeSend : function(){
        // console.log('show gif');
        // grey out content only. position in middle of content (append it there)
        Glossary.addLoadingGif();
      }
    }).done(function(data){

      // add the path of the term clicked to an array. If it's already in the array remove it. Do this before the loading
      if($.inArray(path , Glossary.clickedTerms) !== -1){
        var index = $.inArray(path , Glossary.clickedTerms);
        Glossary.clickedTerms.splice(index,1);
      }
      Glossary.clickedTerms.push(path);

      // hide loading gif
      $('.col_cx').find('.loading-gif, .loading-gif-overlay').remove();

      var term = Glossary.parseTermFile( data, path );

      // cache it in the local storage
      Glossary.cacheTerm( term );

      // display term.
      Glossary.showDialog( term, linkClicked, dialogLink );

      // console.log('ajaxing');

    }).fail(function(data){

      // hide loading gif
      $('.col_cx').find('.loading-gif, .loading-gif-overlay').remove();

      // display error message
      $("<div class='error-dialog' title='File not found...'><p>Unfortunately the glossary term <strong class='term-name'>'" + linkClicked.text() + "'</strong> could not be found at this moment, please try again later.</p></div>").dialog({
          resizable: false,
          width: 600,
          modal: true
      });

      // increase the loading time too perhaps if a timeout occurs.
      Glossary.maxLoadTime = Glossary.maxLoadTime+1000;
      // console.log(Glossary.maxLoadTime);

    });

  },

  // Cache a glossary term in the cache
  cacheTerm: function(term){

    // put it into the cache attribute
    localStorage.setItem(term.path, JSON.stringify( term ) );

  },

  // Takes a parameter of all the data, and extracts the necessary GlossaryTerm
  parseTermFile: function( data, path ){

    // get the relevant pieces of content
    var d = $(data);

    var content = $('.section', d).html();
    var title = $('h1', d).text();

    return new GlossaryTerm ( title, content, path );

  },


  // display a glossary term
  showDialog : function( term, linkClicked, dialogLink ){

    // if a link inside a glossary term box was clicked, just load the content for the new term
    if(dialogLink) {

      Glossary.showNewTerm(term);

    } else {

      // remove other glossary term boxes in case the user has scrolled to a different part of the page
      $(Glossary.settings.contentBox).remove();

      Glossary.boxState = "default";

      // build the dialog box
      $('.content .wrapper').append("\
        <div class='glossary-term-content ux-improvement' data-term='" + term.path + "'> \
          <div class='glossary-header'> \
            <div class='navigation-box'> \
            <button class='fa fa-chevron-left disabled navigate previous'><span class='accessibility-text'>Previous term</span></button> \
            <button class='fa fa-chevron-right disabled navigate next'><span class='accessibility-text'>Next term</span></button> \
            </div> \
            <h3>" + term.title + "</h3> \
            <div class='navigation-control-box'> \
                <button class='fa fa-angle-down minimise'><span class='accessibility-text'>Minimise</span></button> \
                <button class='fa fa-expand maximise'><span class='accessibility-text'>Maximise</span></button> \
                <button class='fa fa-times close'><span class='accessibility-text'>Close dialog</span></button> \
            </div> \
          </div>\
          <div class='glossary-content'>" + term.content + "</div>\
        </div>\
      ");


      // enable the back button when more that one term has been clicked
      var showingTermsIndex = parseInt($.inArray(term.path , Glossary.clickedTerms) );
      if(Glossary.clickedTerms.length > 1 && showingTermsIndex != 0){
        $('.navigate.previous').removeClass('disabled');
      }
      if(Glossary.clickedTerms.length == 1)
      {
        $('.navigation-box').hide();
      }

      // make draggable and resizable
      $(Glossary.settings.contentBox).resizable({}).draggable({ handle: ".glossary-header" });

      Glossary.calculatePosition();
      Glossary.calculateHeight();

    }

    // console.log('show dialog')

    // show legal instruments if necessary
    if($('#content-legal-instruments').prop( "checked" )){
      $('.glossary-content .changed-by').css({'display' : 'inline-block'});
    }

    // ensure the glossary container has a unique class
    Glossary.index++;

  },

  // show a new glossary term in the existing box
  showNewTerm : function(term){

    $(Glossary.settings.contentBox + ' .glossary-header h3').text(term.title);
    $(Glossary.settings.contentBox + ' .glossary-content').html(term.content);
    $(Glossary.settings.contentBox).attr('data-term', term.path);

    // enable the back button when more that one term has been clicked
    var showingTermsIndex = parseInt($.inArray(term.path , Glossary.clickedTerms) );
    if(Glossary.clickedTerms.length > 1 && showingTermsIndex != 0){
      $('.navigate.previous').removeClass('disabled');
    }
    // disable next button when last term click is showing
    if(Glossary.clickedTerms.length - 1 == showingTermsIndex){
      $('.navigate.next').addClass('disabled');
    }
    $('.navigation-box').show();

  },

  // allow the previous and next buttons to navigate through the clicked glossary terms
  navigateTermsNew : function(linkClicked){

    var currentFile = linkClicked.closest(Glossary.settings.contentBox).attr('data-term');

    Glossary.currentIndex = parseInt($.inArray(currentFile , Glossary.clickedTerms));

    // show previous term: load the term (from LS) corresponding to Glossary.currentIndex - 1
    if(linkClicked.hasClass('previous')){

      // do nothing if on first term
      if (Glossary.currentIndex == 0) {

        return false;

      } else {

        // get the previous file from local storage
        var termToShow = Glossary.loadCachedTerm(Glossary.clickedTerms[(Glossary.currentIndex - 1)]);

        // replace the content in the term box with new content
        Glossary.showNewTerm(termToShow);

        // adjust the reference to which clicked file is showing
        Glossary.currentIndex -= 1;

        // disable previous button on the first term
        if(Glossary.currentIndex == 0){
          $('.navigate.previous').addClass('disabled');
        }
        // enable next button when not the last term
        if($('.navigate.next').hasClass('disabled')){
          $('.navigate.next').removeClass('disabled');
        }


			}
		}

    // show next term: load the term (from LS) corresponding to Glossary.currentIndex + 1
    if(linkClicked.hasClass('next')){

      // do nothing if on last term
      if (Glossary.currentIndex == Glossary.clickedTerms.length - 1 ) {

					return false;

      } else {

        // get the next file from local storage
        var termToShow = Glossary.loadCachedTerm(Glossary.clickedTerms[(Glossary.currentIndex + 1)]);

        // replace the content in the term box with new content
        Glossary.showNewTerm(termToShow);

        // adjust the reference to which clicked file is showing
        Glossary.currentIndex += 1;

        // disable previous button on the first term
        if(Glossary.clickedTerms.length - 1 == Glossary.currentIndex){
          $('.navigate.next').addClass('disabled');
        }
        // enable next button when not the last term
        if($('.navigate.previous').hasClass('disabled')){
          $('.navigate.previous').removeClass('disabled');
        }

      }
    }

    // show legal instruments if necessary
    if($('#content-legal-instruments').prop( "checked" )){
      $('.glossary-content .changed-by').css({'display' : 'inline-block'});
    }

  },

  // close the dialog box
  destroyDialog : function(closeButton){
    closeButton.closest(Glossary.settings.contentBox).remove();
    Glossary.boxState = "default";
  },

  calculatePosition : function(){

    var glossaryBox = $(Glossary.settings.contentBox);

    var screenWidth = $(document).width(),
        pageContainerWidth = 960,
        positionForDialog;

    positionForDialog = (screenWidth - pageContainerWidth) / 2;

    glossaryBox.css({'left' : positionForDialog})

  },

  calculateHeight : function(){

    var glossaryBox = $(Glossary.settings.contentBox);

    var screenHeight = $(window).height(),
        glossaryBoxHeight = glossaryBox.height(),
        gap = 30;

    // console.log('screenHeight: ' + screenHeight);
    // console.log('glossaryBoxHeight: ' + glossaryBoxHeight);

    //shrink it when necessary
    if(glossaryBoxHeight > screenHeight - gap*2)
    {
      glossaryBox.css({'height' : screenHeight - gap*2});
      // console.log('make smaller');
    }

    // make it bigger it when necessary
    if(glossaryBoxHeight < 500 && glossaryBoxHeight < screenHeight - gap*2)
    {
      // console.log('make bigger');
      if(screenHeight > 500){
        screenHeight = 500;
      }
      glossaryBox.css({'height' : screenHeight - gap*2});
    }

  },


  minimiseTermBox : function(){
    // console.log('minimise it');

    $('.glossary-content').attr('style', '').css({
      'height': 0,
      'padding': 0
    });

    $('.glossary-term-content').attr('style', '').css({
      'height': 34,
      'bottom': 0
    });

			// Toggle, add and remove classes for minimise/default-window
			$('.navigation-control-box .fa-angle-down').toggleClass('fa-angle-up').addClass('fa-angle-up maximise').removeClass('fa-angle-down minimise');

    Glossary.boxState = 'minimised';

  },


  defaultBoxPosition : function(){
    // console.log('default position');

    $('.glossary-content').attr('style', '');

    $('.glossary-term-content').attr('style', '');

		// Toggle, add and remove classes for expand button
		$('.navigation-control-box .fa-expand').toggleClass('fa-compress');
		$('.navigation-control-box .fa-expand').addClass('maximise');
		$('.navigation-control-box .fa-expand').removeClass('minimise fa-compress');

		// Add and remove classes for minimise/default-window
		$('.navigation-control-box .fa-angle-up').addClass('minimise fa-angle-down');
		$('.navigation-control-box .fa-angle-up').removeClass('maximise fa-angle-up');

    Glossary.calculatePosition();

    Glossary.boxState = 'default';

  },

  maximiseTermBox : function(){
    // console.log('maximise it');

    $('.glossary-content').attr('style', '').css({
      'height': 'auto'      
    });

    $('.glossary-term-content').attr('style', '').css({
      'left': '10%',
      'width': '80%',
      'max-width': 'initial',
      'height': '90%',
      'top' : '5%',
      'overflow-y' : 'auto'
    });

		// Toggle and remove classes for maximise button
		$('.navigation-control-box .fa-expand').toggleClass('fa-compress minimise');
		$('.navigation-control-box .fa-expand').removeClass('maximise');

    Glossary.boxState = 'maximised';

  }


  // problem is I have values that need to match values in my sass. Can this be done?

}

