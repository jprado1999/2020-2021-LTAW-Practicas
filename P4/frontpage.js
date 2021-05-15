const electron = require('electron');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");

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
info1.textContent = process.version;
//-- Pongo aquí los datos obtenidos anteriormente
info2.textContent = chrome_version;
info3.textContent = electron_version;

//-- Datos recibidos del proceso MAIN
electron.ipcRenderer.on('ip', (event, message) => {
    console.log("Recibido: " + message);
    info4.textContent = message;
});

electron.ipcRenderer.on('users', (event, message) => {
    console.log("Usuarios: " + message);
    info5.textContent = message;
});

btn_test.onclick = () => {
    display.innerHTML += "TEST! ";
    console.log("Botón apretado!");
}