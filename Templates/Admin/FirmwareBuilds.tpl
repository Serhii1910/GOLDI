<script type="text/javascript" src="JavaScript/FirmwareBuilds.js"></script>

<h3>Firmwares without approval</h3>
<table class="table">
    <tr>
        <th>BoardType</th>
        <th>HardwareVersion</th>
        <th>UploadDate</th>
        <th>TestState</th>
        <th>Delete</th>
        <th>Release</th>
    </tr>
    <tr id="FirmwaresWithoutApprovalTemplate" class="hide">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><button class='btn btn-danger delete'>X</button></td>
        <td><button class='btn btn-success release'>Release</button></td>
    </tr>
    <tbody id="FirmwaresWithoutApprovalContainer">
    </tbody>
</table>
<br>
<h3>Firmwares with approval</h3>
<table class="table">
    <tr>
        <th>BoardType</th>
        <th>HardwareVersion</th>
        <th>DeviceType</th>
        <th>FirmwareVersion</th>
        <th>UploadDate</th>
        <th>Experimental</th>
        <th>Unstable</th>
        <th>Stable</th>
    </tr>
    <tr id="FirmwaresWithApprovalTemplate" class="hide">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><input checked class="firmware-toggle" type="checkbox" disabled></td>
        <td><input class="firmware-toggle unstable" type="checkbox"></td>
        <td><input class="firmware-toggle stable" type="checkbox"></td>
    </tr>
    <tbody id="FirmwaresWithApprovalContainer">
    </tbody>
</table>

