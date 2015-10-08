// JS for the new publications navigation
var PublicationsMenu = {

	showAll : true,

	// settings and dom elements
	settings: {
		speed: 600,
		navList : '.publications-nav'
	},

	init: function(){
		this.bindUIActions();
		this.hideSubMenus();
	},

	// hide the sub menus in the javascript to ensure accessibility - this function should be run on page load

	// If you want to open all nested lists when click expand - pass the value 'top-level-only' to this function.
	hideSubMenus: function(behaviour){

		var navigation = $(PublicationsMenu.settings.navList);

		// determine whether to hide all lists or just the top level list
		if (behaviour == "top-level-only") {
			var lists = navigation.find('> li > ol, > li > ul');
			var buttons = navigation.find('> li > button');
		} else {
			var lists = navigation.find('ol, ul');
			var buttons = navigation.find('li > button');
		}

		var links = navigation.find('a');

		// accessibility (hide the navigation with .js class then show once all JS has run)
		navigation.show();

		// hide all lists and change 'Collapse -' to 'Expand -'
		lists.hide();
		buttons.text('Expand +').removeClass('open').addClass('closed');
		// allow the expand all button to work
		PublicationsMenu.showAll = false;

		// overwrite to show a menu item if it has the initial-open class
		links.each(function(index){
			var t = $(this);
			if(t.hasClass('initial-open')){
				
				// show the list and its parent lists
				t.siblings('ul, ol').show().find('ul, ol').show();
				t.parentsUntil(PublicationsMenu.settings.navList, 'ul, ol').show();

				// show all lists that don't have buttons
				t.parentsUntil(PublicationsMenu.settings.navList, 'ul, ol').each(function(){
					if($(this).find('>li >button').length == 0){
						$(this).find('ul,ol').show();
					}
				});




				// switch the expand/collapse
				PublicationsMenu.switchPlusMinusLogo(t.siblings("button").eq(0));
				PublicationsMenu.switchPlusMinusLogo(t.parentsUntil(PublicationsMenu.settings.navList, 'ul, ol').siblings("button"));
			}
		});

	},

	// bind functions to dom elements
	bindUIActions: function(){

		// toggle a menu list based on a click
		$(PublicationsMenu.settings.navList + ' li button').on('click', function(e){
			var listItem = $(this).parent();

			// listItem.parent().hasClass('publications-nav') will be true for the top level buttons and false for everthing else
			PublicationsMenu.toggleMenu(listItem, listItem.parent().hasClass('publications-nav') , e);

		});

		$(".publications-nav").on("click", "li.nonContentLink > a", function(e)
		{
			e.preventDefault();
			$(this).siblings("button").trigger("click");
		});

		// toggle all menu items
		$(".toggle-all").on('click', function(){
			PublicationsMenu.toggleAllMenus($(this));
		});
	},

	// toggle a navigation menu based on a click
	toggleMenu: function(listItem, topLevelList){

		if(listItem.has('> ul, > ol').length != 0){

			// show all the grandchildren lists if it's a second level list or lower
			if(!topLevelList){
				var grandChildLists = listItem.find('> ul ul');

				// only show all lists for the open animation, not the close animation
				if(!listItem.find(' > button').hasClass('open')){
					grandChildLists.show();
				}
			}

			// animate the child lists
			var directChildList = listItem.find('> ul, > ol');
			directChildList.slideToggle(PublicationsMenu.settings.speed, function(){
				PublicationsMenu.switchPlusMinusLogo(listItem.find('>button'));
			});

		} else {
			return false;
		}

	},

	// show the relevent icon to toggle the child lists
	switchPlusMinusLogo: function(button){
		if(button.hasClass('closed')){
			button.removeClass('closed');
			button.addClass('open');
			button.text('Collapse -');
		} else if(button.hasClass('open')) {
			button.removeClass('open');
			button.addClass('closed');
			button.text('Expand +');
		}
	},

	toggleAllMenus: function(toggleAllButton){

		// this is required to change the button values
		var allLists = $(PublicationsMenu.settings.navList + ', ' + PublicationsMenu.settings.navList + ' ul');
		// this is required to hide/show lists
		var secondLevelAndBelowLists = $(PublicationsMenu.settings.navList + ' ul');

		if (PublicationsMenu.showAll){

			// hide lists that are not the top level (if you hid top level there would be no navigation at all!)
			secondLevelAndBelowLists.hide();

			// change the text on the buttons
			toggleAllButton.removeClass('open').addClass('closed').text('Expand all +');
			allLists.find('> li > button').removeClass('open').addClass('closed').text('Expand +');

			// indicate that the lists are all closed
			PublicationsMenu.showAll = false;
		} else {

			// show all lists
			secondLevelAndBelowLists.show();

			// change the text on the buttons
			toggleAllButton.removeClass('open').addClass('closed').text('Collapse all -');
			allLists.find('> li > button').removeClass('closed').addClass('open').text('Collapse -');

			// indicate that the lists are all open
			PublicationsMenu.showAll = true;
		}
	}

}