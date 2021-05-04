//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{

  display.innerHTML += '<p style="color:blue">' + "> " + msg + '</p>';
  //-- Reproduzco el sonido cuando nos llega un mensaje
  document.getElementById("audio").play();

});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value) {
    //-- Comando para vaciar el display
    if (msg_entry.value == "/clear") {
      display.innerHTML = "";
    } else {
      //-- Detecto si el mensaje es texto o un comando
      if (msg_entry.value[0] == "/" && msg_entry.value != "/clear") {
        socket.emit("cmd", msg_entry.value)
      } else {
        socket.emit("msg", msg_entry.value)
      }
    }
  }
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}