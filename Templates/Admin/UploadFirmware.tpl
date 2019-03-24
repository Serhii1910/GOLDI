<script type="text/javascript" src="Common/js/fileinput.min.js"></script>
<script type="text/javascript" src="JavaScript/AdminUploadFirmware.js"></script>
<link href="Common/css/fileinput.min.css" rel="stylesheet">

<form id="UploadForm" action="upload.php" method="post" enctype="multipart/form-data">
    <label for="hardwareconfig">Select hardware configuration:</label>
    <select class="form-control" id="hardwareconfig" name="hardwareconfig">
        [[++options++]]
    </select>

    <br><br>

    <label for="fileupload">Select firmware file to upload:</label>
    <input id="fileupload" name="FirmwareFile" type="file" accept=".bit">

    <br><br>

    <button id="submit" type="button" class="btn btn-primary">Upload</button>
</form>
    <br>
    <p id="uploadError" class="infos alert alert-danger" style="display: none;" role="alert"> </p>
    <p id="uploadSuccessful" class="infos alert alert-success" style="display: none;" role="alert"> Upload successfully completed </p>

