let socket;
let dingSound;
let usernameInput
let chatIDInput;
let messageInput;
let chatRoom;
let delay = true;

function onload() {
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");

  socket.on("join", function(room){
    chatRoom.innerHTML = `Currently connected to Room: <span id="roomId">${room}</span>`;
    dingSound.play();
  })

  // Message Post Feature
  socket.on("recieve", function(message){
    console.log(message);
    document.getElementById("messages").innerHTML += `${message}<br>`

  })
}

function Connect(){
  socket.emit("join", chatIDInput.value, usernameInput.value);
}

function Disconnect() {
  socket.emit("disconnect");
}

function Send(){
  // removes any whitespace characters and checks that its not empty
  if (delay && messageInput.value.trim() != ""){
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}

function delayReset(){
  delay = true;
}