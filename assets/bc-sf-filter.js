// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_row * bcSfFilterConfig.custom.row_number,
        // Optional
        loadProductFirst: true
    }
};

// Declare Templates
var bcSfFilterTemplate = {
    'saleLabelHtml': '<span class="badge badge--on-sale">' + bcSfFilterConfig.label.sale + '</span>',
    'soldOutLabelHtml': '<span class="badge badge--sold-out">' + bcSfFilterConfig.label.sold_out + '</span>',

    // Grid Template
    'productGridItemHtml': '<div class="product grid__item {{itemGridWidthClass}} text-center">' +
                                '<a href="{{itemUrl}}" class="grid__image sale-{{onSaleClass}} sold-{{soldOutClass}}">'+
                                    '{{itemImages}}' +
                                    '{{itemSoldOutLabel}}' +
                                    '{{itemSaleLabel}}' +
                                '</a>' +
                                '<p class="h3"><a href="{{itemUrl}}">{{itemTitle}}</a></p>' +
                                '<p class="price">{{itemPrice}}</p>' +
                            '</div>',

    // Pagination Template
    'pageItemHtml': '<a class="btn btn--small btn--dark btn--outline" href="{{itemUrl}}">{{itemTitle}}</a> ',
    'pageItemSelectedHtml': '<a class="btn btn--small btn--dark btn--outline btn--disabled-alt">{{itemTitle}}</a> ',
    'pageItemRemainHtml': '<a class="btn btn--small btn--dark btn--outline btn--disabled-alt">{{itemTitle}}</a> ',
    'paginateHtml': '<div class="pagination text-center">{{pageItems}}</div>',
};

var counter = 1;

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
    /*** Prepare data ***/
    var images = data.images_info;
     // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

    if (index == 1) counter = 1;

    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;
  
    // Add a specific class for grid item
    var itemGridWidthClass = '';
    switch(bcSfFilterConfig.custom.products_per_row) {
        case 2: itemGridWidthClass = 'small--one-whole medium--one-half large--one-half'; break;
        case 3: itemGridWidthClass = 'small--one-whole medium--one-third large--one-third'; break;
        case 4: itemGridWidthClass = 'small--one-half medium--one-quarter large--one-quarter'; break;
        case 5: itemGridWidthClass = 'small--one-half medium--one-third large--one-fifth'; break;
        default: itemGridWidthClass = 'one-third medium--one-half small--one-whole'; break;
    }
    itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);

    // Add soldOut item
    var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel); 
  
    // Add onSale item
    var itemSaleLabel = onSale ? bcSfFilterTemplate.saleLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabel);

    itemHtml = itemHtml.replace(/{{onSaleClass}}/g, onSale);
    itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOut);

    // Add Images
    var itemImagesHtml = ''
    if (images.length > 0) {
        var image = images[0];
        var aspect_ratio = image.width / image.height;
        var img_url = this.optimizeImage(images[0]['src'], '{width}x');

        itemImagesHtml += '<div class="product__image-wrapper supports-no-js" style="padding-top:' + (1 / aspect_ratio * 100) + '%;">';
        itemImagesHtml += '<img class="no-js lazyload" data-src="' + img_url + '" ' +
                                'data-widths="[108, 360, 375, 414, 568, 684, 720, 732, 736, 768, 1024, 1200, 1296, 1512, 1728, 1944, 2048]" ' +
                                'data-aspectratio="' + aspect_ratio + '" ' +
                                'data-sizes="auto" ' +
                                'data-parent-fit="width" ' +
                                'alt="{{itemTitle}}">';
        itemImagesHtml += '</div>';
        itemImagesHtml +=   '<noscript>' +
                                '<img src="' + this.optimizeImage(images[0]['src'], '580x') + '" ' +
                                'srcset="' + this.optimizeImage(images[0]['src'], '580x') + ' 1x, ' + this.optimizeImage(images[0]['src'], '580x@2x') +  ' 2x" ' + 
                                'alt="{{itemTitle}}" style="opacity:1;">' +
                            '</noscript>';
    } else {
        if (counter == 7) counter = 1;
        if (bcSfFilterConfig.custom.hasOwnProperty('placeholder_svg_tag_' + counter)) {
            itemImagesHtml += bcSfFilterConfig['custom']['placeholder_svg_tag_' + counter];
        }
        counter++;
    }
    itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImagesHtml);

    // Add Price
    var itemPriceHtml = '';
    if (priceVaries) {
        itemPriceHtml += bcSfFilterConfig.label.from_price + ' ';
    }
    if (onSale) {
        itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.sale_price + '</span>';
    } else {
        itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.regular_price + '</span>';
    }
    itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
    if (onSale) {
        itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.regular_price + '</span>';
        itemPriceHtml += ' <span class="compare-price">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat) + '</span>';
    }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add main attribute
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
};

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.pagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage = 0; iPage < pageArr.length; iPage++) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        jQ(this.selector.pagination).html(paginationHtml);
    }
};

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
          /* Start Initialize BC QuickView */
          if (typeof(bcQuickView) !== 'undefined') {
            if(typeof(bcQuickViewParams) !== 'undefined') {
              bcQuickView.init(bcQuickViewParams);
            } else {
              bcQuickView.init();
            }
          }
          /* End Initialize BC QuickView */};

    // Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

    // Customize data to suit the data of Shopify API
BCSfFilter.prototype.prepareProductData=function(data){for(var k=0;k<data.length;k++){data[k]['images']=data[k]['images_info'];if(data[k]['images'].length>0){data[k]['featured_image']=data[k]['images'][0]}else{data[k]['featured_image']={src:bcSfFilterConfig.general.no_image_url,width:'',height:'',aspect_ratio:0}}data[k]['url']='/products/'+data[k].handle;var optionsArr=[];for(var i=0;i<data[k]['options_with_values'].length;i++){optionsArr.push(data[k]['options_with_values'][i]['name'])}data[k]['options']=optionsArr;data[k]['price_min']*=100,data[k]['price_max']*=100,data[k]['compare_at_price_min']*=100,data[k]['compare_at_price_max']*=100;data[k]['price']=data[k]['price_min'];data[k]['compare_at_price']=data[k]['compare_at_price_min'];data[k]['price_varies']=data[k]['price_min']!=data[k]['price_max'];var firstVariant=data[k]['variants'][0];if(getParam('variant')!==null&&getParam('variant')!=''){var paramVariant=data.variants.filter(function(e){return e.id==getParam('variant')});if(typeof paramVariant[0]!=='undefined')firstVariant=paramVariant[0]}else{for(var i=0;i<data[k]['variants'].length;i++){if(data[k]['variants'][i].available){firstVariant=data[k]['variants'][i];break}}}data[k]['selected_or_first_available_variant']=firstVariant;for(var i=0;i<data[k]['variants'].length;i++){var variantOptionArr=[];var count=1;var variant=data[k]['variants'][i];var variantOptions=variant['merged_options'];if(Array.isArray(variantOptions)){for(var j=0;j<variantOptions.length;j++){var temp=variantOptions[j].split(':');data[k]['variants'][i]['option'+(parseInt(j)+1)]=temp[1];data[k]['variants'][i]['option_'+temp[0]]=temp[1];variantOptionArr.push(temp[1])}data[k]['variants'][i]['options']=variantOptionArr}data[k]['variants'][i]['compare_at_price']=parseFloat(data[k]['variants'][i]['compare_at_price'])*100;data[k]['variants'][i]['price']=parseFloat(data[k]['variants'][i]['price'])*100}data[k]['description']=data[k]['content']=data[k]['body_html']}return data};