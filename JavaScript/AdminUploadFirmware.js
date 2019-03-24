$(document).ready(()=>{
    $("#fileupload").fileinput({
//            uploadUrl: 'index.php?Function=AdminUploadFirmware'
        showPreview: false,
        showRemove: false,
        showUpload: false
    });

    function uploadSuccessful(){
        $(".infos").hide();
        $("#uploadSuccessful").show();
    }

    function uploadError(res){
        $(".infos").hide();
        $("#uploadError").text(res);
        $("#uploadError").show();
    }

    $("#submit").click(()=> {
        let selectedHardwareConfigID = $("#hardwareconfig").val();

        var formData = new FormData($('#UploadForm')[0]);
        $.ajax({
            url: 'index.php?Function=AdminUploadFirmware',  //Server script to process data
            type: 'POST',
            success: (res)=> {
                if(res == true){
                    uploadSuccessful();
                }else{
                    uploadError(res);
                }
            },
            error: (res)=> {
                uploadError(res);
            },
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        });
    });
});