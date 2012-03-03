function socketStart() {
    var server = "ws://html5rocks.websocket.org/echo";
    //var connection = new WebSocket(server)||new MozWebSocket(server);
    if(WebSocket) {
        var connection = new WebSocket(server);
    } else if(MozWebSocket) {
        var connection = new MozWebSocket(server);
    }
    // When the connection is open, send some data to the server
    connection.onopen = function () {
        connection.send('Derp'); // Send the message 'Ping' to the server
    };
    // Log errors
    connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function (e) {
        console.log('Server: ' + e.data);
    };
}