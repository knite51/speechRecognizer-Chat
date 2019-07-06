const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const port = 2000;

const users = {};

app.get("/", (req, res) => {
  res.send("App is live");
});

// Read a directory
app.use("/socketio", express.static(path.join(__dirname, "chatbox")));

io.on("connection", socket => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    console.log("user disconnected");
    delete users[socket.id];
  });

  // Turn on chat message event to handle the message - Listen to an event
  socket.on("chat message", msg => {
    // Emit message to front (everyone except sender)
    socket.broadcast.emit("chat message", {
      message: msg,
      user: users[socket.id],
    });
    // Emit message to front (everyone including sender)
    // io.emit("chat message", { message: msg, user: users[socket.id] });
    // emit an event to the socket/user
    // socket.emit("chat message" msg);
  });

  socket.on("new-user", name => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
});

http.listen(port, () => console.log("App is live"));

// Read a file
// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/index.html");
// });
