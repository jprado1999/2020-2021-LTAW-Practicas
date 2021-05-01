//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 8080;

//-- Defino una variable para almacenar la cantidad de usuarios
let users = 0;

//-- Defino una variable para obtener la fecha actual
let date = new Date();


//-- Crear una nueva aplicacion web
const app = express();

//-- Crear un servidor, asociado a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

const comandos = "<p style='color:red'>/help: Devuelve una lista con los comandos disponibles</p> \
<p style='color:red'>/list: Devuelve el número de usuarios conectados</p> \
<p style='color:red'>/hello: Devuelve un saludo por parte del servidor</p> \
<p style='color:red'>/date: Devuelve la fecha actual</p>";

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
    res.send('Bienvenido a mi aplicación Web!!!' + '<p><a href="/intro.html">Entrar al Chat</a></p>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {

    //-- Envio un mensaje a todos los clientes anunciando que alguien se ha unido
    io.send("Un nuevo usuario se ha unido al Chat");

    //-- Aumento la cantidad de usuarios
    users += 1;

    //-- Mensaje de bienvenida, solo lo ve el cliente que se conecta
    socket.send("Has entrado en el Chat");
  
    console.log('** NUEVA CONEXIÓN **'.yellow);

    console.log("Usuarios: " + users);

    //-- Evento de desconexión
    socket.on('disconnect', function(){
        console.log('** CONEXIÓN TERMINADA **'.yellow);

        //-- Decremento en 1 a los usuarios del chat
        users -= 1;

        console.log("Usuarios: " + users);
    });  

    //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
    socket.on("message", (msg)=> {
        console.log("Mensaje Recibido!: " + msg.blue);

        //-- Un cliente teclea un comando
        if (msg == '/help') {
            socket.send(comandos);
        } else if (msg == '/list') {
            socket.send("Actualmente hay " + users + " usuarios conectados");
        } else if (msg == '/hello') {
            socket.send("Heeey I'm the server. How are you?");
        } else if (msg == '/date') {
            socket.send("Hoy es: " + date);
        } else {
            //-- Reenvio el mensaje a todos los clientes conectados
            io.send(msg);
        }

    });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);