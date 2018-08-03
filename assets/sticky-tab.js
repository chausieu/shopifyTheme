$(document).ready(function() {

  			var tabOffset = 0;
  			var priceOffset = 0;
  
  			function MakeSticky(elementName, offsetValueWhenSticky, stickyClassName, initVarName) {
    			var currentOffset = $(elementName).offset().top;
    			var scrollTop = $(window).scrollTop();
        
    			if (eval(initVarName + " == 0")) {
      				eval(initVarName + " = currentOffset");
    			}

	    		var distance = eval(initVarName + " - scrollTop");
  
				if (distance <= offsetValueWhenSticky) {
        			$(elementName).addClass(stickyClassName)
      			} else {
        			$(elementName).removeClass(stickyClassName);
      			}
			}
  
			$(document).scroll(function(){
				  MakeSticky('#tab-navbar', 70, 'sticky', 'tabOffset');
				  MakeSticky('#configuration-price', 100, 'sticky-pricing', 'priceOffset');
  			});
  
  			$(window).resize(function() {
				  tabOffset = 0;
				  priceOffset = 0;
        	MakeSticky('#tab-navbar', 70, 'sticky', 'tabOffset');
				  MakeSticky('#configuration-price', 100, 'sticky-pricing', 'priceOffset');
  			});

});

