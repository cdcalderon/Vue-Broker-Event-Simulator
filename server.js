const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use("/style", express.static(__dirname + "/style"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

io.on("connection", socket => {
  socket.on("message", msg =>
    io.emit("message", { system: socket.appid, message: msg })
  );
  socket.on("join", appid => {
    socket.appid = appid != null ? appid : "client-App";

    io.emit("message", {
      system: socket.appid,
      message: socket.appid + " has joined!"
    });

    console.log(socket.appid + " has joined!");
  });
});

http.listen(3000, () => console.log("listening on port 3000"));
