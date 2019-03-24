/**
 * Created by rehu7999 on 23.09.2016.
 */
function resizeWindow(){
    $("#wrap").css("padding-top",(120+Math.max(50,$("#headernavbar").height()))+"px");
}
$(window).resize(function(){
    resizeWindow();
});
$(document).ready(function(){
    resizeWindow()
});
