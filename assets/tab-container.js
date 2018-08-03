$(document).ready(function() {
	jQuery('.tab-container .tab-links a').on('click', function(e) {
		var currentAttrValue = jQuery(this).attr('href');

		// Show/Hide Tabs
		jQuery('.tab-container ' + currentAttrValue).show().siblings().hide();

		// Change/remove current tab to active
		jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

		e.preventDefault();
	});
});
/*
$(document).ready(function () {
  //combine price;
  var optionTotal = 0;
  if($('#ProductPrice-product-template-variants').length > 0 || $('div.bold_option_total div span').length > 0){
  var original = $('#ProductPrice-product-template-variants').text().replace(/[,$\/#!%\^&\*;:{}=\-`~]/g,"");
    var extraPrice = +$('div.bold_option_total div span').text().replace(/[,$\/#!%\^&\*;:{}=\-`~]/g,"");
  
    $('#product-price').text("$"+(+original+ +extraPrice).toFixed(2));
  }
  $(document).on('change',$("[name^='properties['],.single-option-selector"), function() {
  	var original = $('#ProductPrice-product-template-variants').text().replace(/[,$\/#!%\^&\*;:{}=\-`~]/g,"");
  	var extraPrice = +$('div.bold_option_total div span').text().replace(/[,$\/#!%\^&\*;:{}=\-`~]/g,"");

  	$('#product-price').text("$"+(+original+ +extraPrice).toFixed(2));
  });

});
*/
$(document).ready(function(){
  $('.jstree-result').hide();
  $.jstree.defaults.core.themes.variant = "large";
  $('#jstree-download').jstree({"plugins" : [ "search" ] });
  var to = false;
    $('#jstree-search').keyup(function () {
    if(to) { clearTimeout(to); }
    to = setTimeout(function () {
      var v = $('#jstree-search').val();
      $('#jstree-download').jstree(' close_all ');

      $('#jstree-download').jstree(true).search(v);
    }, 250);
  });
      $('#jstree-download').on("changed.jstree", function (e, data) {
		var objNode = data.instance.get_node(data.selected);
        var objId = objNode.a_attr['id'].split("_")[0];
        if( $('#'+objId+'-display').length > 0) {
        	$('.jstree-result').hide();
        	$('#'+objId+'-display').show();
        }
     //   console.log (objId);
        //$('#jstree-result').html('Selected: <br/><strong>' + objNode.id+'-'+objNode.text+ objNode.a_attr['id'] + '</strong>');
        
        
      });
  
//   $('#jstree-result').stick_in_parent({ 
//     offset_top: 70,
//     parent: ".sticky-parent", // note: we must now manually provide the parent
//   	spacer: ".sticky-spacer",

  /*
  var pricing = $('#jstree-result');
  if($('#jstree-result')){
  var pricingOffset = pricing.offset().top;
  }
  function myFunction() {
    var width = $(window).width();
    var window_offset = navbarOffset - $(window).scrollTop();
    var tabOffset = pricingOffset - $(window).scrollTop();
    var offsetY = ((-0.0000935088)*(width*width))-(0.392722*width) + 7.78015;
    
    //console.log('width: ' + width + ', $(window).scrollTop(): ' + $(window).scrollTop() + ', navbarOffset: ' + navbarOffset + ', window_offset: ' + window_offset + ', offsetY: ' + offsetY + ', tabOffset: ' + tabOffset + ', offsetY: ' + offsetY);

      console.log('width: ' + width + ', window_offset <= 110: ' + window_offset + ', window_offset <= : ' + offsetY);
	console.log(width > 1008 && tabOffset <= 110) || (width <= 1008 && tabOffset <= offsetY);
      if ((width > 1008 && tabOffset <= 110) || (width <= 1008 && tabOffset <= offsetY)) {
        pricing.addClass("jstree-sticky")
      } else {
        pricing.removeClass("jstree-sticky");
      }
    
  }
  
  $(document).scroll(function(){
    myFunction();
  });
  */
});
  
/*
  $(document).ready(function(){
    $('.selection-tree').change(function(){
      var selected = $('#select-tree option:selected').text();
      $('#'+selected).css("display","block");
      console.log(selected);
    });
    
  });

/*
$(document).ready(function(){
	setTimeout(function(){
		
	var isProductSelectHidden = Boolean(localStorage.getItem("isProductSelectHidden"));
	var item = $('.bold_option_title').length == 0;
	console.log(isProductSelectHidden);
	console.log(item);
	console.log(isProductSelectHidden && item);
	if(isProductSelectHidden && item)
		$('#item-configuration').detach().appendTo('#configuration-price');
	},1000);
});
/*
$(document).ready(function(){
	var configurable = localStorage.getItem("configurable");
	console.log(configurable);
	if( configurable && $('.bold_option .bold_options_loaded').is(":hidden")){
		console.log("test");
		$('#item-configuration').detach().appendTo('#configuration-price');;
	}
});
/*
$(document).ready(function(){
	$('.shopify-product-form select').each(function(i,select){
		var $select = $(select);
		$select.find('option').each(function(j,option){
			var $option = $(option);
			var $radio = $('<input type="radio" />');

			$radio.attr('name',$select.attr('name')).attr('value',$option.val());
			if ($option.attr('selected')) 
				$radio.attr('checked','checked');

			$select.before($radio);

			$select.before($("<label/>").attr('for',$select.attr('name')).text($option.text()));
			$select.before("<br/>");
		});
		$select.remove();
	});

});
*/