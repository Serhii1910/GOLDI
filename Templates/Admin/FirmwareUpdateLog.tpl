<script src="Common/js/jquery.tablesorter.min.js"></script>

<table id="firmwareupdatelogtable" class="table tablesorter">
    <thead>
        <tr>
            <th>
                Timestamp
            </th>
            <th>
                Location
            </th>
            <th>
                DeviceType
            </th>
            <th>
                FirmwareID
            </th>
            <th>
                Result
            </th>
        </tr>
    </thead>
    <tbody>
        [[++FirmwareUpdateLogLines++]]
    </tbody>
</table>

<script>
    $(document).ready(function(){
        $("#firmwareupdatelogtable").tablesorter();
    })
</script>