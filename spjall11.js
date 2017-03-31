var e = require("express");
var app = e();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(e.static("./"));
var chatlog = [];
var users = [];
var us = 0;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/ChatServerGrunnur11.html');
});


io.on('connection', function (socket) {
    console.log("A new user has connected");
    io.emit('nick', users);
    io.emit('chatMsg', chatlog);


    io.emit('chatMsg', chatlog);
    io.emit('nick', users);

    socket.on('forceDisconnect', function () {
        console.log("User has disconnecetd");
        var user = users.indexOf(socket.username);
        if (user > -1) {
            users.splice(user, 1);
        }
        var kk = "<nobr id=chill>↩ HAHA!!! </nobr>" + socket.username + "<nobr id=chill> has been kicked!</nobr>";
        chatlog.push(kk);
        io.emit('chatMsg', chatlog);
        io.emit('nick', users);
    });

    socket.on('disconnect', function () {
        console.log("User has disconnecetd");
        var user = users.indexOf(socket.username);
        if (user > -1) {
            users.splice(user, 1);
        }
        var kk = "<nobr id=chill>✘ </nobr>" + socket.username + "<nobr id=chill> has left the chat!</nobr>";
        chatlog.push(kk);
        io.emit('chatMsg', chatlog);
        io.emit('nick', users);

    });

    socket.on("check", function (nick, pw) {
        var check = true;
        var checkPw = false;
        socket.username = nick;
        for (var i = 0; i < users.length; i++) {
            if (users[i] === nick) {
                check = false;
                break;
            }
        }

        if (pw === "12345") {
            checkPw = true;
        }

        if (check === true && checkPw === true) {
            socket.emit("switch");
            var kk = "<nobr id=brill>✔ </nobr>" + nick + "<nobr id=brill> has joined the chat!</nobr>";
            socket.emit("switch");
            chatlog.push(kk);
            io.emit("chatMsg", chatlog);
            users.push(socket.username);
            io.emit("nick", users);
        } else {
          socket.emit("false");
        }
    });
    socket.on('info', function () {
        chatlog.push("Your shortcut messages are<br>brb<br>omw<br>lol<br>lit<br>BAN WORD: danni<br>Also you can change nick by typing /nick");
        socket.emit('chatMsg', chatlog);
        var count = chatlog.length - 1;
        chatlog.splice(count, 1);

    });

    socket.on('clearBox', function(){
        io.emit('clearBox');
              });

    socket.on('nickk', function (nickk) {
        var user = users.indexOf(socket.username);
        if (user > -1) {
            users.splice(user, 1);
        }
        var ff = "<nobr id=grill>➑ </nobr>" + socket.username + "<nobr id=grill> has changed his nick! </nobr>"
        socket.username = nickk;
        var kk = "<nobr id=srill> New nick is:  </nobr>" + nickk;
        chatlog.push(ff + kk);
        io.emit("chatMsg", chatlog);
        users.push(nickk);
        io.emit("nick", users);
    });


    socket.on("getText", function (msg) {
        var s = socket.username;
        var b = " : ";
        io.emit("getText", s, b, msg);
    });

    socket.on('chatMsg', function (message) {
        if (message === "") {

        } else {
            chatlog.push(socket.username + " : " + message);
            io.emit('chatMsg', chatlog);
        }
    });
});

 server.listen(3000, function () {
     console.log("Server is listening on port 3000");
 });