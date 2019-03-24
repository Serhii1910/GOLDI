<table id="DeviceList" class="table">
    <thead>
        <tr>
            <th class="tag" data-i18n="Location"></th>
            <th class="tag" data-i18n="Type"></th>
            <th class="tag" data-i18n="Maintenance"></th>
            <th class="tag" data-i18n="Connected"></th>
            <th class="tag" data-i18n="BPUPSPU"></th>
            <th class="tag" data-i18n="ServiceDestID"></th>
        </tr>
    </thead>
    <tbody>
        [[++DeviceLines++]]
    </tbody>
</table>

<script>
    $(document).ready(function() {
        $("tr").find("td:nth-child(3)").each(function(){
            if($(this).text()=="1" || $(this).next().text() == "0"){
                $(this).parent().css("background-color","#FFDDDD");
            }else{
                $(this).parent().css("background-color","#DDFFDD");
            }
        });
    });

</script>