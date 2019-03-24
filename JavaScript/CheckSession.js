$(document).ready(function(){
    SetTimestampLastAction();
    var TimeoutSeconds = $("#settings").attr("SessionTimeoutSeconds");

    setInterval(function(){
        if(GetNow() - parseInt(GetTimestampLastAction()) >= TimeoutSeconds * 1000){
            window.location.href = "index.php?Site=12&Hint=SessionTimeout";
            // $.post("index.php?Function=Logout",function(){
            //     ;
            // });
        }
    }, 1000);
});