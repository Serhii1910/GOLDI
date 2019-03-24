$(document).ready(function()
{
    var RefreshTime = 1000;
    var Bookings = {};
    var Template = $('#TableRowTemplate').clone();
	Template.removeClass('hidden');

    RefreshBookingSite();
    
    setInterval(function () {
        RefreshBookingSite();
    }, RefreshTime);
    
    function RefreshBookingSite()
    {
        $.getJSON("index.php?Function=GetBooking&GetAllUserBookings",function( data )
        {
            if(Object.keys(Bookings).length != Object.keys(data).length){
                Bookings = data;
                BuildBookings(Bookings);
            }
        });
    }

    function BuildBookings(Bookings)
    {
        var Obj;
        $('#TableBody').html('');

        $.each(Bookings,function(Index, Element){
            Obj = $(Template).clone();

            var date =  new Date();
            var ExperimentIsNow = date.getTime() >= (Element.StartTime*1000) && date.getTime() <= (Element.EndTime*1000);
            //#f0ad4e
            if(ExperimentIsNow){
                Obj.css("color", "#066");
                Obj.css("font-weight", "bold");
            }
            Obj.find("td:nth-child(1)").text((new Date(Element.StartTime * 1000)).toLocaleString());
            Obj.find("td:nth-child(2)").text((Element.EndTime - Element.StartTime)/60 + " min");
            Obj.find("td:nth-child(3)").attr("data-i18n",Element.BPUType);
            Obj.find("td:nth-child(4)").attr("data-i18n",Element.BPUVirtual == "0" ? "real" : "virtual");
            Obj.find("td:nth-child(5)").attr("data-i18n",Element.PSPUType);
            Obj.find("td:nth-child(6)").attr("data-i18n",Element.PSPUVirtual == "0" ? "real" : "virtual");
            Obj.find("td:nth-child(7)").text(Element.Location);
            Obj.find("td:nth-child(8)").html('<button BookingID="'+Element.BookingID+'" class="Start tag btn btn-'+(ExperimentIsNow?"success":"warning")+'" '+(ExperimentIsNow?"":"disabled")+' data-i18n="Start"></button>');
            Obj.find("td:nth-child(9)").html('<button BookingID="'+Element.BookingID+'" class="Delete tag btn btn-'+(ExperimentIsNow?"success":"warning")+'" data-i18n="Delete"></button>');

            $('#TableBody').append(Obj);
        });

        $(".Start").click(function(){
            window.open("index.php?Function=ECP&Reserved&BookingID="+$(this).attr("BookingID"));
        });
        $(".Delete").click(function(){
            $.ajax({
                url: "index.php?Function=DeleteBooking&BookingID="+$(this).attr("BookingID"),
                dataType: 'json',
                success: function (data) {
                    RefreshBookingSite();
                },
                cache: false
            });

        });
        i18nValidate();
    }
});
