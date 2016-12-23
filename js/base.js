$(function() {

	var c_height = $(window).height() -218;
	$(".page-content").css("min-height",c_height+"px");

	/*$(window).scroll(function() {
		if($(window).scrollTop()>500){
			$("#to-top").css("display","block");
		}else{
			$("#to-top").css("display","none");
		}
	});

	$('#to-top').on("click",function(){
		$('html,body').animate({
			scrollTop: 0
		}, 300);
	});*/

});