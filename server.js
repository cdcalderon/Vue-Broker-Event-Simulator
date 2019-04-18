const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var schedule = require("node-schedule");

app.use("/style", express.static(__dirname + "/style"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
let job = null;
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

    if (job == null) {
      job = schedule.scheduleJob(" */5 * * * * *", function() {
        io.emit("new-broker-message", {
          system: "Rabbit MQ new Message",
          message:
            "Broker was just updated, this is the new message .." +
            new Date().toLocaleString()
        });
      });
    }

    console.log(socket.appid + " has joined!");
  });
});

http.listen(3000, () => console.log("listening on port 3000"));
