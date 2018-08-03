$(document).ready(function() {
  (
	function() {
      function FixText() {
        $('li.desc .reset').each(function() {
          var txt = $( this ).text();
          var metafield = txt.split('_');
          $(this).text(metafield[1]);
        });

        $('.row.metafield.reset').each(function(){
          var dataTxt = $( this ).text();
          var decodedTxt = $.parseHTML( dataTxt )
          $(this).html(decodedTxt);
        });

        $('.product-price__price').each(function() {
          var price = $( this ).text();
          if (price == '$0.00' || price == '0.00') {
            $(this).text('Configure for price');
            $( this ).css( "font-size", "0.75em" );
          }
        });

      }
  
    function ProcessWhenReady() {
        var checkExist = setInterval(function() {
         if ($('.reset').length) {
             FixText(); 
            clearInterval(checkExist);
         }
      }, 100);
    }

    var checkShowListExist = setInterval(function() {
       if ($('.show-list').length) {
         $( ".show-list" ).click(function() {
           ProcessWhenReady();
         });
          clearInterval(checkShowListExist);
       }
    }, 1000);
  
	ProcessWhenReady();
  })();
});
