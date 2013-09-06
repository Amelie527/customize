$(window).load(function () {
	$('#thumbnail-container').click(function (event) {
		var newSrc = event.target.getAttribute('src');
		$('#main-image').attr('src', newSrc);
		$('#main-image').attr('tempSrc', '');
	});
	$('#thumbnail-container').mouseover(function (event) {
		var tempSrc = $('#main-image').attr('src');
		var newSrc = event.target.getAttribute('src');
		$('#main-image').attr('tempSrc', tempSrc);
		$('#main-image').attr('src', newSrc);
	});
	
	$('#thumbnail-container').mouseout(function (event) {
	if($('#main-image').attr('tempSrc') != '') {
			var tempSrc = $('#main-image').attr('tempSrc');
			var newSrc = event.target.getAttribute('src');
			$('#main-image').attr('src', tempSrc);
			$('#main-image').attr('tempSrc', '');
		}
	});
	
	$( "#necklines" ).change(function() {
	  var selectedNeckline = $('#necklines').find(":selected").text();
	  var selectedSilhouette = $('#silhouettes').find(":selected").text();
	  var selectedLace= $('#lace').find(":selected").text();
	  var mainImageSrc = $('#main-image').attr('src');
	  var srcPathArray = mainImageSrc.split('/');
	  var newPath = mainImageSrc.split(srcPathArray[srcPathArray.length - 1]) + last;
	  $('#main-image').attr('src', tempSrc);
	});
	
	$('.custom-option').click(function(event) {
		$(event.target).next().toggleClass('active');
	});
	
    var init = function(){
	    loadNecklinesNSilhouettes('flat');
	    loadFabric('flat');
    }

	$('#thumbnail-container').mouseover(function (event) {
		var tempSrc = $('#main-image').attr('src');
		var newSrc = event.target.getAttribute('src');
		$('#main-image').attr('tempSrc', tempSrc);
		$('#main-image').attr('src', newSrc);
	});
	
	$('#thumbnail-container').mouseout(function (event) {
	if($('#main-image').attr('tempSrc') != '') {
			var tempSrc = $('#main-image').attr('tempSrc');
			var newSrc = event.target.getAttribute('src');
			$('#main-image').attr('src', tempSrc);
			$('#main-image').attr('tempSrc', '');
		}
	});
	
	$(document).on('click','.flexslider li img', function(event) {
		var currentNode = $(event.target);
		currentNode.parents('ul').children('.selected').removeClass('selected');
		currentNode.parent().addClass('selected');
		sliderIndex = currentNode.parents('.flexslider').attr('index');
		if(sliderIndex == 0) {
			var neckline = $('#slider0').find('.selected img').attr('name');
			loadSilhouettesNUpdateMainImage(neckline);
		} else {
			var imageName = currentNode.attr('name');
			var imageMask = currentNode.attr('mask');
			updateMainImage(sliderIndex, imageName, imageMask);
		}
	});
	
	var updateMainImage =  function(sliderIndex, imageName, imageMask) {
		var prefix = imageName.split('-')[0];
		var fabric = imageName.split('-')[1];
		if(fabric == 'organza') fabric = 'tulle';
		$('#image-layer' + sliderIndex).attr('src', 'http://www.bluethreadbridal.com/layers/' + prefix + '/' + fabric + '/' + imageName + '.png');
		if(imageMask != null && imageMask != "") {
			$('#image-layer2').attr('src', 'http://www.bluethreadbridal.com/layers/SIL-ABOVE/mask/' + imageMask + '.png');
		} else if (imageMask == null && sliderIndex == 1){
			$('#image-layer2').attr('src', 'http://www.bluethreadbridal.com/layers/BG/transparent.png');
		}	
	};
 	
 	$('.fabric-container .option').click(function(event) {
 		var fabricContainer = $(event.target).parents('.fabric-container');
        if (fabricContainer.hasClass('enabled') && fabricContainer.find('li').length != 0) {
        	fabricContainer.find('.fly-out').toggleClass('active');
        }
	});
	
	$(document).on('click', '.fabric-container ul li', function(event) {
		var selectedOption = $(event.target);
		var fabricContainer = selectedOption.parents('.fabric-container');
		fabricContainer.find('.fly-out').toggleClass('active');
		var newText = selectedOption.text();
		fabricContainer.find('span').text(newText);
		var fabricIndex = selectedOption.index();
		if(fabricContainer.attr('id') == 'nl-fabric-container') {
			filterSlider(newText, 0);
		} else if(fabricContainer.attr('id') == 'sil-fabric-container') {
			filterSlider(newText, 1);
		}	
		//updateMainImageWFabric(optionRow, fabricIndex);
	});
	
	var updateMainImageWFabric =  function(optionRow, fabricIndex) {
		var selectedSliderIndex = $('#slider' + optionRow).find('.selected').index();
		$('#image-layer' + optionRow).attr('src', 'http://www.bluethreadbridal.com/images/' + optionRow + '-' + selectedSliderIndex + '-' + fabricIndex +'.png');
	};
	
	var loadSilhouettes = function(neckline) {
		$.ajax({
    		type: 'GET',
    		crossDomain: true,
		    url: 'http://www.bluethreadbridal.com/src/getSilhouette.php?neckline=' + neckline,
		    async: false,
		    contentType: "application/json",
    		dataType: 'jsonp',
    		success: function(data) {
    			reloadSliderSuccess(data, 1);
    		},
    		error: function(e) {
       			console.log(e.message);
    		}
		});
	};
	
	var loadSilhouettesNUpdateMainImage = function(neckline){
		$.ajax({
    		type: 'GET',
    		crossDomain: true,
		    url: 'http://www.bluethreadbridal.com/src/getSilhouette.php?neckline=' + neckline,
		    async: false,
		    contentType: "application/json",
    		dataType: 'jsonp',
    		success: function(data) {
     			updateMainImage(0, neckline);
    			reloadSliderSuccess(data, 1);
    			FilterFabrics(data);	
    			var defaultSilhouette = data[0].name;
    			var imageMask = data[0].mask;
    			updateMainImage(1, defaultSilhouette, imageMask);  			
    		},
    		error: function(e) {
       			console.log(e.message);
    		}
		});
	};
	
	var reloadSliderSuccess = function(data, sliderIndex) {
		var necklineSlider = $('#slider' + sliderIndex);
    	necklineSlider.empty();
    	necklineSlider.removeData('flexslider');
    	var newUl = $('<ul>', {'class': 'slides'});
    	var name, mask;
		for(var i=0; i<data.length; i++){
		    name = data[i].name;
		    fabric = data[i].fabric;		    
		
		    if(sliderIndex == 1) {
		        mask = data[i].mask;
		        if(i==0){
	 				newUl.append($('<li>', {'class': 'selected'}).append($( '<img>', { 'src': 'http://www.bluethreadbridal.com/thumbnails/' + name + '-thumbnail.png', 'name': name, 'mask': mask, 'fabric': fabric})));
	 			} else {
	 				newUl.append($('<li>').append($( '<img>', { 'src': 'http://www.bluethreadbridal.com/thumbnails/' + name + '-thumbnail.png', 'name': name, 'mask': mask, 'fabric': fabric})));
		 		}
		    }
		    else {
			    if(i==0){
	 				newUl.append($('<li>', {'class': 'selected'}).append($( '<img>', { 'src': 'http://www.bluethreadbridal.com/thumbnails/' + name + '-thumbnail.png', 'name': name, 'fabric': fabric})));
	 			} else {
	 				newUl.append($('<li>').append($( '<img>', { 'src': 'http://www.bluethreadbridal.com/thumbnails/' + name + '-thumbnail.png', 'name': name, 'fabric': fabric})));
		 		}
		    }
	 		
		}
		necklineSlider.append(newUl);
		reloadSlider(necklineSlider);
	};
	
	var reloadSlider = function(elm) {
		elm.flexslider({
		  	slideshow: false,
  			controlNav: false,
  			directionNav: true,
	        animation: "slide",
    	    animationLoop: false,
        	itemWidth: 78,
        	itemHeight: 80,
        	itemMargin: 5
  		});
	};
	
	var loadFabric = function(shape) {
		$.ajax({
    		type: 'GET',
    		crossDomain: true,
		    url: 'http://www.bluethreadbridal.com/src/getFabrics.php?shape=' + shape,
		    async: false,
		    contentType: "application/json",
    		dataType: 'jsonp',
    		success: function(data) {
	    		initFabricOption(data, 0);
    		},
    		error: function(e) {
       			console.log(e.message);
    		}
		});
	};
	
	var loadNecklines = function(shape) {
		$.ajax({
    		type: 'GET',
    		crossDomain: true,
		    url: 'http://www.bluethreadbridal.com/src/getNecklines.php?shape=' + shape,
		    async: false,
		    contentType: "application/json",
    		dataType: 'jsonp',
    		success: function(data) {
	  			reloadSliderSuccess(data, 0);
    		},
    		error: function(e) {
       			console.log(e.message);
    		}
		});
	};
	
	var loadNecklinesNSilhouettes = function(shape) {
		$.ajax({
    		type: 'GET',
    		crossDomain: true,
		    url: 'http://www.bluethreadbridal.com/src/getNecklines.php?shape=' + shape,
		    async: false,
		    contentType: "application/json",
    		dataType: 'jsonp',
    		success: function(data) {
	  			reloadSliderSuccess(data, 0);
	  			var defaultNeckline = $('#slider0').find('.selected img').attr('name');
	    		loadSilhouettes(defaultNeckline);
    		},
    		error: function(e) {
       			console.log(e.message);
    		}
		});
	};
	
	var filterSlider = function(fabric, sliderIndex) {
		var sliderItems = $('#slider' + sliderIndex + ' ul.slides li');
		var itemCounter = 0; 
		$.each(sliderItems, function(index, item) {
			var item = $(item);
			if(item.find('img').attr('fabric') != fabric) {
				item.css('display', 'none');
			} else {
				item.css('display', 'block');
				itemCounter ++;
			}
		});
		if(itemCounter > 3) {
			$('.flex-direction-nav li').css('display', 'block');
		} else {
			$('.flex-direction-nav li').css('display', 'none');	
		}
		$('#slider' + sliderIndex + ' .slides').css('transform', 'translate3d(0, 0, 0)');
	};
	
	/**
	var filterNLSlider = function(fabric) {
		var shape = $('#style-container span.selected').text();
		$.ajax({
    		type: 'GET',
    		crossDomain: true,
		    url: 'http://www.bluethreadbridal.com/src/getNecklinesWFabric.php?shape=' + shape + '&fabric=' + fabric,
		    async: true,
		    contentType: "application/json",
    		dataType: 'jsonp',
    		success: function(data) {
	  			reloadSliderSuccess(data, 0);
    		},
    		error: function(e) {
       			console.log(e.message);
    		}
		});
	};
	
	var filterSILSlider = function(fabric) {
		var shape =  $('#slider0 ul li').find('img').attr('name');
		$.ajax({
			type: 'GET',
			crossDomain: true,
		    url: 'http://www.bluethreadbridal.com/src/getSilhouettesWFabric.php?shape=' + shape + '&fabric=' + fabric,
		    async: true,
		    contentType: "application/json",
			dataType: 'jsonp',
			success: function(data) {
	  			reloadSliderSuccess(data, 1);
			},
			error: function(e) {
	   			console.log(e.message);
			}
		});
	};*/
	
	var FilterFabrics = function(datas) {
		var fabricArray = [];
		var newArray = [];
		datas.forEach(function(data){
			if($.inArray(data.fabric, fabricArray) < 0) {
				fabricArray.push(data.fabric);
				newArray.push(data);
			}
		});
		initFabricOption(newArray, 1);
	};
	
	var initFabricOption = function(data, fabricOptionIndex) {
		var fabricOption;
		if (fabricOptionIndex == 0) {
			fabricOption = $('#nl-fabric-container');
		} else {
			fabricOption = $('#sil-fabric-container');
		}
		
		fabricOption.removeClass('enabled');
		var flyOut = fabricOption.find('.fly-out').empty();
		var newUl = $('<ul>');
		for(var i=0; i<data.length; i++){
				if(i==0){
					newUl.append($('<li>', {class: 'selected', text: data[i].fabric}));
				} else {
					newUl.append($('<li>', { text: data[i].fabric}));
				}
		}
		flyOut.append(newUl);
		if(data.length > 0) {
			fabricOption.addClass('enabled');
		}
	};
 	
	$('#style-container span').click(function(event){
		$('#style-container span.selected').removeClass('selected');
    	var shape = $(event.target).text();
    	$(event.target).addClass('selected');
    	loadFabric(shape);
    	loadNecklinesNSilhouettes(shape);
	});
	
	init();
	
});