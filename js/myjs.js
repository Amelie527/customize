
$(document).ready(function(){
	$("#header1").animate({
		opacity: 0.25,
	    left: '-50px'
	})
});

$(".scroll").click(function(event){
     event.preventDefault();
     var hash = event.target.hash;
   	 var dest = $(hash).offset().top;
     $("html, body").animate({scrollTop: dest}, "slow", "swing");
});	
