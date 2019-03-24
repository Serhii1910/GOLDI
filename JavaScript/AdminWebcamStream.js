const Location = getParam("Admin");
let socketUrl;
let webcamID;
let webSocketConnectionEstablished = false;

$(document).ready(()=>{
    socketUrl = $(".URL").attr("url");

    $.getJSON("index.php?Function=AdminGetAllDevicesAndWebcams&Location="+Location,data => {
        BuildWebcamDropdown(data);
    });
});

function BuildWebcamDropdown(webcams){
    webcams = webcams.filter(w => w.URL !== null);
    $("#webcams").html("<option>= Webcamauswahl =</option>"+webcams.map(w =>
        `<option webcamid="${w.ServiceDestID}">${w.Type} (${w.ServiceDestID})</option>`
    ).join(""));
    $("#webcams").change(function() {
        let selected = $("#webcams option:selected");
        if(selected.attr("webcamid") != undefined)
            webcamID = parseInt(selected.attr("webcamid"));
        if(!webSocketConnectionEstablished)
            StartWebsocketConnection();
    });
}

function StartWebsocketConnection()
{
    $("#webcamStream").html('<img id="webcam_image" src="ECP/page-loader.gif" alt="progress" style="width=400px"/>');
    if(!webSocketConnectionEstablished){
        let WebSocketClient = new WebSocket(socketUrl);

        WebSocketClient.onopen = e => {
            webSocketConnectionEstablished = true;
            WebSocketClient.send(webcamID);
        };
        WebSocketClient.onmessage = e => {
            webSocketConnectionEstablished = true;
            $("#webcam_image").attr("src","data:image/png;base64,"+e.data);

            setTimeout(function(){
                WebSocketClient.send(webcamID);
            },100);
        };
        WebSocketClient.onerror = e => {
            WebSocketClient.close();
            webSocketConnectionEstablished = false;
            StartWebsocketConnection();
        }
    }
}