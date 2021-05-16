const electron = require('electron');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const vnode = document.getElementById("vnode");
const vchrome = document.getElementById("vchrome");
const velectron = document.getElementById("velectron");
const dirIP = document.getElementById("dirIP");
const n_users = document.getElementById("n_users");
const platform = document.getElementById("platform");
const architecture = document.getElementById("architecture");
const cwd = document.getElementById("cwd");

//-- Proceso para obtener las versiones de Chrome y Electron

//-- Me guardo la informacion que devuelve el modulo process.versions
let versions = process.versions;

//-- Compruebo que existen los campos que busco
console.log(versions);

//-- Obtengo el valor de los campos Chrome y Electron una vez compruebo que existen
let chrome_version = versions['chrome'];
let electron_version = versions['electron'];

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
vnode.textContent = process.version;
//-- Pongo aquí los datos obtenidos anteriormente
vchrome.textContent = chrome_version;
velectron.textContent = electron_version;

//-- Como electron me ha dado permisos, puedo usar el modulo process
platform.textContent = process.platform;
architecture.textContent = process.arch;
cwd.textContent = process.cwd();

//-- Datos recibidos del proceso MAIN
electron.ipcRenderer.on('ip', (event, message) => {
    console.log("Recibido: " + message);
    dirIP.textContent = message;
});

electron.ipcRenderer.on('users', (event, message) => {
    console.log("Usuarios: " + message);
    n_users.textContent = message;
});

electron.ipcRenderer.on('msg', (event, message) => {
    console.log("Mensaje del chat: " + message);
    display.innerHTML += '<p>' + message + '</p>';
});

btn_test.onclick = () => {
    display.innerHTML += '<p>' + "Mensaje para todos los usuarios!" + '</p>';
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "Saludos a todos los usuarios desde Electron!");
}