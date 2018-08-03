$(document).ready(function(){
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  
  if ($('#variant-spec').length > 1 ){
  var input = $('#variant-spec').html().trim();
  
  var data = $.csv.toArrays(input);
  var html = generateTable(data);

  $('#variant-spec').html(html);
  }
  function generateTable(data){
  	var html = '';
		html += '<table class="variant-spec">';
    	for(var row in data) {
          html += '<tr>\r\n';
          for(var item in data[row]) {
            if(item == 0 || row == 0){
            	html += '<td><h4>' + data[row][item] + '</h4></td>\r\n';
            }
            else
            html += '<td>' + data[row][item] + '</td>\r\n';
          }
          html += '</tr>\r\n';
        }
    	html += '</table>';
    	
    return html;
  }
  /*
    var form =  jQuery('form[action="/cart/add"]');
    var currentVariant = jQuery('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', form).val();
    $('.variant-spec').hide();
    $('#'+currentVariant).show();
   // console.log(currentVariant);
   $(document).on('change','.single-option-selector',function(){
    $('#'+currentVariant+'.variant-spec').hide();
    currentVariant = jQuery('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', form).val()
   // currentVariant = getParameterByName('variant');
    //$('.variant-spec').hide();
    $('#'+currentVariant+'.variant-spec').show();
    //console.log(currentVariant);
    });
    */
});