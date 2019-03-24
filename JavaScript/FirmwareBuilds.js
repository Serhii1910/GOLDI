$(document).ready(function()
{
    //let Location = getParam("Admin");

    // time in milliseconds the visitor's view is being refreshed
    let RefreshTime = 1000;
    let items;
    let Template_WithoutApproval = $('#FirmwaresWithoutApprovalTemplate').clone();
    Template_WithoutApproval.removeClass('hide');
    let oldDataForFirmwaresWithoutApproval = null;

    let Template_WithApproval = $('#FirmwaresWithApprovalTemplate').clone();
    Template_WithApproval.removeClass('hide');
    let CountOfFirmwaresWithApproval = null;

    RefreshFirmwareBuildSite();
    
    let RefreshTimer = setInterval(function () {
        RefreshFirmwareBuildSite();
    }, RefreshTime);
    
    function RefreshFirmwareBuildSite()
    {
        $.getJSON("index.php?Function=AdminGetFirmwaresWithoutApproval",function( data )
        {
            items = data;
            if(oldDataForFirmwaresWithoutApproval === null || JSON.stringify(items) !== oldDataForFirmwaresWithoutApproval){
                oldDataForFirmwaresWithoutApproval = JSON.stringify(items);
                BuildFirmwaresWithoutApprovalTable(items);
            }
        });

        $.getJSON("index.php?Function=AdminGetFirmwaresWithApproval",function( data )
        {
            items = data;
            if(CountOfFirmwaresWithApproval === null || CountOfFirmwaresWithApproval !== data.length){
                CountOfFirmwaresWithApproval = data.length;
                BuildFirmwaresWithApprovalTable(items);
            }
        });
    }

    function BuildFirmwaresWithoutApprovalTable(Firmwares){
        let Obj;
        $('#FirmwaresWithoutApprovalContainer').html('');


        for(let i = 0; i < Firmwares.length; i++)
        {
            Obj = $(Template_WithoutApproval).clone();
            Obj.removeAttr("id");
            Obj.find("td:nth-child(1)").text(Firmwares[i].BoardType);
            Obj.find("td:nth-child(2)").text(Firmwares[i].HardwareVersion);
            Obj.find("td:nth-child(3)").text((new Date(Firmwares[i].UploadDate * 1000).toLocaleString()));
            Obj.find("td:nth-child(4)").text(Firmwares[i].TestState);

            Obj.find(".delete").attr("id","delete_"+Firmwares[i].FirmwareID);
            Obj.find(".delete").on("click",function() {
                SendChanges({
                    Function: "AdminFWDeleteFirmware",
                    FirmwareID: $(this).attr("id").split("_")[1]
                },true);
            });

            Obj.find(".release").attr("id","release_"+Firmwares[i].FirmwareID);
            Obj.find(".release").on("click",function() {
                SendChanges({
                    Function: "AdminFWReleaseFirmware",
                    FirmwareID: $(this).attr("id").split("_")[1],
                },true);
            });

            if(Firmwares[i].TestState !== "Verified")
                Obj.find(".release").prop("disabled",true);

            $('#FirmwaresWithoutApprovalContainer').append(Obj);
        }
    }

    function BuildFirmwaresWithApprovalTable(Firmwares){
        let Obj;
        $('#FirmwaresWithApprovalContainer').html('');


        for(let i = 0; i < Firmwares.length; i++)
        {
            Obj = $(Template_WithApproval).clone();
            Obj.removeAttr("id");
            Obj.find("td:nth-child(1)").text(Firmwares[i].BoardType);
            Obj.find("td:nth-child(2)").text(Firmwares[i].HardwareVersion);
            Obj.find("td:nth-child(3)").text(Firmwares[i].DeviceType);
            Obj.find("td:nth-child(4)").text(Firmwares[i].FirmwareVersion);
            Obj.find("td:nth-child(5)").text((new Date(Firmwares[i].UploadDate * 1000).toLocaleString()));

            Obj.find(".unstable").attr("id","unstable_"+Firmwares[i].FirmwareID);
            Obj.find(".unstable").prop("checked", $.inArray("Unstable",Firmwares[i].BuildTypes) !== -1);
            Obj.find(".unstable").on("change",function() {
                SendChanges({
                    Function: $(this).prop("checked")?"AdminFWAddApproval":"AdminFWRemoveApproval",
                    FirmwareID: $(this).attr("id").split("_")[1],
                    BuildType: "Unstable"
                });
            });

            Obj.find(".stable").attr("id","stable_"+Firmwares[i].FirmwareID);
            Obj.find(".stable").prop("checked", $.inArray("Stable",Firmwares[i].BuildTypes) !== -1);
            Obj.find(".stable").on("change",function() {
                SendChanges({
                    Function: $(this).prop("checked")?"AdminFWAddApproval":"AdminFWRemoveApproval",
                    FirmwareID: $(this).attr("id").split("_")[1],
                    BuildType: "Stable"
                });
            });

            if(Firmwares[i].TestState !== "Verified")
                Obj.find(".release").prop("disabled",true);

            $('#FirmwaresWithApprovalContainer').append(Obj);
        }


        $(".firmware-toggle").bootstrapToggle({
            on: "Allowed",
            onstyle: "success",
            off: "Forbidden",
            offstyle: "danger",
        });
    }

    function SendChanges(Param, Refresh = false){
        // console.log(Param);
        let url = "index.php?"+$.param(Param);
        // console.log(url);
        $.post("index.php?"+$.param(Param),function(data){
            // alert(`Param: ${JSON.stringify(Param)} Result: ${JSON.stringify(data)}`);
            if(Refresh){
                oldDataForFirmwaresWithoutApproval = null;
                CountOfFirmwaresWithApproval = null;
                RefreshFirmwareBuildSite();
            }
        });
    }
});
