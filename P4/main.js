//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const ip = require('ip');

//-- Cargar el módulo de electron
const electron = require('electron');
console.log("Arrancando electron...");

const PUERTO = 8080;

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Obtengo la direccion IP de mi maquina
let ip_address = ip.address()
//console.log(ip_address);

//-- Creo la variable con la direccion IP y el puerto
let ip_send = "http://" + ip_address + ":" + PUERTO + "/index.html";

//-- Defino una variable para almacenar la cantidad de usuarios
let users = 0;

//-- Defino un array que almacenará los nicks
let nicknamesArray = [];

//-- Mensaje con comandos para cuando lo pida un cliente
const comandos = "<p style='color:red'>/help: Devuelve una lista con los comandos disponibles</p> \
<p style='color:red'>/list: Devuelve el número de usuarios conectados</p> \
<p style='color:red'>/hello: Devuelve un saludo por parte del servidor</p> \
<p style='color:red'>/date: Devuelve la fecha actual</p> \
<p style='color:red'>/clear: Vacía el chat</p>";

//-- Defino una variable para obtener la fecha actual
let date = new Date();

//-- Crear una nueva aplicacion web
const app = express();

//-- Crear un servidor, asociado a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- El punto de entrada por defecto es la carpeta /public
//-- de forma que siempre coja el fichero index.html

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', ()=>{
    console.log("Evento Ready!")

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,  //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

     //-- Cargar interfaz gráfica en HTML
    win.loadFile("frontpage.html");

    //-- Envio la IP y el puerto al proceso de renderizado
    win.on('ready-to-show', () => {
        console.log("Enviando IP y puerto");
        win.webContents.send('ip', ip_send);
    });
});

//- Proceso para enviar un mensaje a todos los usuarios
electron.ipcMain.handle('test', (event, msg) => {
    console.log("Mensaje desde el renderizado: " + msg);
    io.send(msg);
});

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {

    //-- Aumento la cantidad de usuarios
    users += 1;

    //-- Envio el numero de usuarios al proceso de renderizado
    console.log("Enviando numero de usuarios");
    win.webContents.send('users', users);

    //-- Mensaje de bienvenida, solo lo ve el cliente que se conecta
    socket.send("Has entrado en el Cyber-Chat");
  
    console.log('** NUEVA CONEXIÓN **'.yellow);

    console.log("Usuarios: " + users);  

    //-- Mensaje para todos los usuarios
    socket.on('nick', (nick) => {
        io.send(nick + " ha entrado en el Cyber-Chat");

        //-- Envio el mensaje de conexion al proceso de renderizado
        console.log("Enviando evento de conexion");
        win.webContents.send('hello', nick + " se ha unido al Cyber-Chat");

        //-- Incluyo el nuevo nick en el array
        nicknamesArray.push(nick);
        console.log(nicknamesArray);

        //-- Evento de desconexión
        socket.on('disconnect', function(){
            console.log('** CONEXIÓN TERMINADA **'.yellow);

            //-- Decremento en 1 a los usuarios del chat
            users -= 1;

            //-- Envio un mensaje a todos los usuarios para informar
            io.send(nick + " ha abandonado el Cyber-Chat");

            //-- Envio el mensaje de desconexion al proceso de renderizado
            console.log("Enviando evento de desconexion");
            win.webContents.send('bye', nick + " ha abandonado el Cyber-Chat");

            //-- Envio el numero de usuarios al proceso de renderizado
            console.log("Enviando numero de usuarios");
            win.webContents.send('users', users);

            //-- Elimino a ese cliente del Array
            let position = nicknamesArray.indexOf(nick);
            nicknamesArray.splice(position, 1);

            console.log("Usuarios: " + users);
        });

        //-- Mensaje recibido: Va dirigido a todos los clientes
        socket.on("msg", (msg)=> {
            console.log("Mensaje Recibido!: " + msg.blue);
            
            //-- Reenvio el mensaje a todos los clientes conectados
            //-- Añadiendo el nick de quien lo envia
            msg = nick + ": " + msg;
            io.send(msg);

            //-- Envío el mensaje a la aplicacion de electron
            console.log("Enviando mensaje del chat");
            win.webContents.send('msg', msg);

        });

        //-- Comando recibido
        socket.on("cmd", (msg) => {
            
            console.log("Comando Recibido!: " + msg.blue);

            //-- Envio el comando recibido al proceso de renderizado
            console.log("Enviando comando");
            win.webContents.send('cmd', msg);
            
            //-- Veo si el comando está en los que tengo definidos
            //-- y envío la informacion correspondiente solo al usuario que la solicita
            switch (msg) {
                case '/help':
                    socket.send(comandos);
                    break;
                case '/list':
                    if (users > 1) {
                        socket.send("Actualmente hay " + users + " usuarios conectados");
                        socket.send("Usuarios: " + nicknamesArray);
                    } else {
                        socket.send("Actualmente hay " + users + " usuario conectado");
                        socket.send("Usuario: " + nicknamesArray);
                    } 
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
});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);