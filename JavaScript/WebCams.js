$(document).ready(function()
{
    var Location = getParam("Admin");

    var RefreshTimer = undefined;
    var RefreshTime = 1000;
    var Devices;
    var Template = $('#WebCamsTemplate').clone();
    Template.removeClass('hide');

    RefreshExperimentSite();

    function RefreshExperimentSite()
    {
        $.getJSON("index.php?Function=AdminGetAllDevicesAndWebcams&Location="+Location,function( data )
        {
            BuildWebCamLines(data);
        });
    }

    function SendUpdates(ID){
        URL = "index.php?Function=AdminSetNewWebCamSettings&Loccation="+Location+"&";

        Return = {
            ServiceDestID:ID,
            WebcamType:$("[data='WebcamType'][ServiceDestID='"+ID+"']").val(),
            URL:$("[data='WebcamURL'][ServiceDestID='"+ID+"']").val(),
            Parameter:$("[data='WebcamParameter'][ServiceDestID='"+ID+"']").val(),
            Rotation:$("[data='WebcamRotation'][ServiceDestID='"+ID+"']").val(),
            Location:Location
        };

        $.post(URL+$.param(Return),function(data){
            console.log(data);
        });
    }

    function BuildWebCamLines(Devices)
    {
        var Obj;
        $('#WebCamsContainer').html('');

        var Return = new Array();
        for(var i = 0; i < Devices.length; i++)
            if(Devices[i].Virtual == 0)
            {
                Obj = $(Template).clone();

                Obj.children()[0].innerHTML = Devices[i].Type;
                Obj.children()[1].innerHTML = Devices[i].ServiceDestID;

                Input = Obj.find("[data='WebcamType']");
                Input.val(Devices[i].WebcamType);
                Input.attr("ServiceDestID",Devices[i].ServiceDestID);
                // Input.addClass(Devices[i].DeviceID);
                Input.change(function(){
                    SendUpdates($(this).attr("ServiceDestID"));
                });

                Input = Obj.find("[data='WebcamURL']");
                Input.val(Devices[i].URL);
                Input.attr("ServiceDestID",Devices[i].ServiceDestID);
                // Input.addClass(Devices[i].DeviceID);
                Input.change(function(){
                    SendUpdates($(this).attr("ServiceDestID"));
                });

                Input = Obj.find("[data='WebcamParameter']");
                Input.val(Devices[i].Parameter);
                Input.attr("ServiceDestID",Devices[i].ServiceDestID);
                // Input.addClass(Devices[i].DeviceID);
                Input.change(function(){
                    SendUpdates($(this).attr("ServiceDestID"));
                });

                Input = Obj.find("[data='WebcamRotation']");
                Input.val(Devices[i].Rotation);
                Input.attr("ServiceDestID",Devices[i].ServiceDestID);
                // Input.addClass(Devices[i].DeviceID);
                Input.change(function(){
                    SendUpdates($(this).attr("ServiceDestID"));
                });

                $('#WebCamsContainer').append(Obj);
            }
    }
});
