$(function() {
  const socket = io();

  // show user has connected
  const name = prompt("Whats your chat name?");
  $("#chat").append(`<h3>You Joined</h3>`);

  socket.emit("new-user", name);

  socket.on("user-connected", name => {
    $("#chat").append(`<p style="margin:auto;">${name} has connected</p>`);
  });

  // chat message
  $("form").submit(function(e) {
    e.preventDefault();
    const formMsg = $("#m").val();

    // Display my message
    $("#chat").append(`<div id="answer" style="">
            <div class="answer">
                <div class="spacer"></div>
                <div class="balloon">${formMsg}</div>
                <div class="circleBot">
                    <div class="name">You</div>
                </div>
            </div>
        </div>`);

    // Emit event chat message - Create an event
    socket.emit("chat message", formMsg);

    // Empty form once hit send
    $("#m").val("");
    return false;
  });

  // Get content from emited event chat message - read content of event
  // display chat messages
  socket.on("chat message", function(data) {
    $("#chat").append(`<div id="question">
      <div class="question">
        <div class="circleBot">
          <div class="humour">${data.user}</div>
        </div>
        <div class="balloon">
          <span>${data.message}</span>
        </div>
        <div class="spacer" />
      </div>
    </div>`);
  });

  // When user disconnects
  socket.on("user-disconnected", user => {
    $("#chat").append(`<h3>${user} left</h3>`);
  });
});
