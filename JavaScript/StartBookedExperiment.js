var UserBooking;
var UserWantsToStartBookedExperiment = true;

function TestForCurrentBookings(){
    $.getJSON("index.php?Function=GetExperimentsBookedForUserNow",function( data ){
        UserBooking = data;
        if(data.length > 0 && UserWantsToStartBookedExperiment)
            $("#BookingsSystemStartBookedExperiment").modal();
    });
}

$(document).ready(function(){
    $("#BookingsSystemStartBookedExperimentYes").click(function(){
        window.open("index.php?Function=ECP&Reserved");
        UserWantsToStartBookedExperiment = false;
    });

    $("#BookingsSystemStartBookedExperimentCancel").click(function(){
        UserWantsToStartBookedExperiment = false;
    });

    setInterval(function(){
        TestForCurrentBookings();
    },60000);

    TestForCurrentBookings();
});