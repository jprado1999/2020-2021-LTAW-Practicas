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
//-- El punto de entrada por defecto es la carpeta /public
//-- de forma que siempre coja el fichero index.html

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {

    //-- Envio un mensaje a todos los clientes anunciando que alguien se ha unido
    io.send("Un nuevo usuario se ha unido al Cyber-Chat");

    //-- Aumento la cantidad de usuarios
    users += 1;

    //-- Mensaje de bienvenida, solo lo ve el cliente que se conecta
    socket.send("Has entrado en el Cyber-Chat");
  
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
    socket.on("msg", (msg)=> {
        console.log("Mensaje Recibido!: " + msg.blue);
        
        //-- Reenvio el mensaje a todos los clientes conectados
        io.send(msg);
    });

    socket.on("cmd", (msg) => {
        //-- Un cliente teclea un comando
        console.log("Comando Recibido!: " + msg.blue);
        
        //-- Veo si el comando está en los que tengo definidos
        //-- y envío la informacion correspondiente solo al usuario que la solicita
        switch (msg) {
            case '/help':
                socket.send(comandos);
                break;
            case '/list':
                socket.send("Actualmente hay " + users + " usuarios conectados");
                break;
            case '/hello':
                socket.send("Heeey I'm the Cyber-Server of Coruscant. How are you?");
                break;
            case '/date':
                socket.send("Hoy es: " + date);
                break;
            default:
                socket.send("No se reconoce el comando introducido");
                break;
        }

    });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);