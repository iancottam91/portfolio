(function($) {
    "use strict";

    function sidebarHeightCheck(){
        
        var navHeight = 50;
        var sidebarContent = $('#plugins .sidebar .header');
        var sidebarHeight = sidebarContent.outerHeight();
        var sidebarMargin = parseInt(sidebarContent.css('margin-top')) + parseInt(sidebarContent.css('margin-bottom'));
        var viewportHeight = $(window).height();
        
        // if sidebar is taller than viewport height
        if((sidebarHeight + sidebarMargin + navHeight) > viewportHeight){
            // remove fixed sidebar
            $('#plugins').addClass('no-fixed-sidebar');
        }
    }

    sidebarHeightCheck();

}(jQuery));