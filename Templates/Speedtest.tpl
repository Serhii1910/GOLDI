<script>
    var SpeedtestOK = true;

    var Starttime, Endtime;

    var ImageAddr = "[[++ImagePath++]]";
    var DownloadSize = "[[++ImageSize++]]"; //bytes

    var DownloadImage;
    var DownloadImage2;

    var DownloadSpeedDiv;

    $(document).ready(function() {
        MeasureDownloadSpeed();
    });

    function MeasureDownloadSpeed() {
        DownloadImage = new Image();

        DownloadSpeedDiv = $("#downloadspeed");
        DownloadSpeedDiv.html("[[**SpeedtestDownloadingFiles**]]");
        DownloadImage = new Image();
        DownloadImage2 = new Image();


        DownloadImage.onload = function () {
            SartTime = (new Date()).getTime();
            var cacheBuster = "?nnn=" + SartTime;

            DownloadImage2.src = ImageAddr + cacheBuster;
        }

        DownloadImage2.onload = function () {
            EndTime = (new Date()).getTime();
            showResults();
        }

        DownloadImage2.onerror = function (err, msg) {
            DownloadSpeedDiv.innerHTML = "[[**SpeedtestErrorDownloading**]]";

            SpeedtestOK = false;
            ShowInfo();
        }

        DownloadImage2.onerror = function (err, msg) {
            DownloadSpeedDiv.innerHTML = "[[**SpeedtestErrorDownloading**]]";

            SpeedtestOK = false;
            ShowInfo();
        }

        SartTime = (new Date()).getTime();
        var cacheBuster = "?nnn=" + SartTime;

        DownloadImage.src = ImageAddr + cacheBuster;

        function showResults() {
            var duration = (EndTime - SartTime) / 1000;
            var bitsLoaded = DownloadSize * 8;
            var speedBps = (bitsLoaded / duration).toFixed(2);
            var speedKbps = (speedBps / 1024).toFixed(2);
            var speedMbps = (speedKbps / 1024).toFixed(2);

            var color = "green";
            if(speedMbps < 3){
                color = "red";
                SpeedtestOK = false;
            }

            DownloadSpeedDiv.html(
                    "[[**SpeedtestDownloadSize**]]: " +
                    Math.floor(DownloadSize / 1024 / 1024 * 100) / 100 + " Mb <br>" +
                    '[[**SpeedtestDownloadSpeed**]]: <b style="color:'+color+'">' +
                    speedMbps + " Mbps</b>"
            );
            MeasureUploadSpeed();
        }
    }

    var UploadSpeedDiv;
    var UploadText;

    function MeasureUploadSpeed() {
        UploadSpeedDiv = $("#uploadspeed");
        UploadSpeedDiv.html("[[**SpeedtestUploadingFiles**]]");

        DownloadSize = 1024*1024 / 4;

        UploadText = "";
        for(i=0;i<DownloadSize;i++)
            UploadText += "A";

        $.ajax({
            type: "POST",
            url: "index.php?time="+Starttime,
            contentType: "UploadText/plain",
            data: UploadText,
            headers: { "cache-control": "no-cache" },
            error: function(){
                SpeedtestOK = false;
                ShowInfo();
            },
            success: function(data, textStatus, jqXHR) {
                SartTime = (new Date()).getTime();

                $.ajax({
                    type: "POST",
                    url: "index.php?time="+Starttime,
                    contentType: "UploadText/plain",
                    data: UploadText,
                    headers: { "cache-control": "no-cache" },
                    error: function(){
                        SpeedtestOK = false;
                        ShowInfo();
                    },
                    success: function(data, textStatus, jqXHR) {
                        EndTime = (new Date()).getTime();
                        var duration = (EndTime - SartTime) / 1000;
                        var bitsLoaded = DownloadSize * 8;
                        var speedBps = (bitsLoaded / duration).toFixed(2);
                        var speedKbps = (speedBps / 1024).toFixed(2);
                        var speedMbps = (speedKbps / 1024).toFixed(2);

                        var color = "green";
                        if(speedMbps < 0.5){
                            color = "red";
                            SpeedtestOK = false;
                        }

                        UploadSpeedDiv.html(
                                "[[**SpeedtestUploadSize**]]: " +
                                Math.floor(DownloadSize / 1024 / 1024 * 100) / 100 + " Mb<br>" +
                                '[[**SpeedtestUploadSpeed**]]: <b style="color:'+color+'">' +
                                speedMbps + " Mbps</b>"
                        );

                        TestPorts();
                    }
                });
            }
        });
    }

    var PorttestDiv;

    function TestPorts()
    {
        PorttestDiv = $("#porttest");

        WebSocketClient = new WebSocket("ws://141.24.211.105/goldidata");

        WebSocketClient.onopen = function () {
            PorttestDiv.html('<b style="color:green">[[**SpeedtestPortOpen**]]</b>');
            WebSocketClient.close();
            ShowInfo();
        };

        WebSocketClient.onerror = function () {
            PorttestDiv.html('<b style="color:red">[[**SpeedtestPortClosed**]]</b>');
            SpeedtestOK = false;
            ShowInfo();
        };
    }

    function ShowInfo(){
        if(SpeedtestOK){
            $("#info").html('<b style="color:green">[[**SpeedtestOK**]]</b>');
        }else{
            $("#info").html('<b style="color:red">[[**SpeedtestNotOK**]]</b>');
        }
    }

</script>



<h1 class="tag" data-i18n="SpeedtestHeader"></h1>
<br><br>

<div id="downloadspeed">

</div>

<br><br>

<div id="uploadspeed">

</div>

<br><br>

<div id="porttest">

</div>

<br><br>

<div id="info">

</div>
