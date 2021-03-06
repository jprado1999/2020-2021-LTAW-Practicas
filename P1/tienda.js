//-- Importo los módulos necesarios para el servidor
const url = require('url');
const http = require('http');
const fs = require('fs');

//-- Defino el numero de puerto que utilizo
const PUERTO = 9000;

//-- Creo el servidor
const server = http.createServer((req, res) => {
    console.log("Petición recibida!");

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";
    let page = "./tienda.html";

    //-- Declaro el valor del content type por defecto
    let mimetype = 'text/html';

    //-- Declaro la variable que almacenará los recursos solicitados
    let petition = "";

    //-- Construyo la url que pide el cliente
    const url = new URL(req.url, 'http://' + req.headers['host']);
    //console.log(url.pathname);

    //-- Si se pide la pagina principal
    if (url.pathname == "/") {
        petition += "/tienda.html";
    } else if (url.pathname == '/favicon.ico') {    //-- Si se pide el icono de la pestaña
        petition += '/img/carrito.jpg';
    } else {                                        //-- Si se pide cualquier otra cosa
        petition = url.pathname;
    }

    //-- Me guardo el tipo de recurso pedido
    resource = petition.split(".")[1];
    petition = "." + petition;

    //console.log("Nombre del fichero: " + petition);
    //console.log("Tipo de recurso: " + resource);

    //-- Generar la respusta en función de las variables
    //-- code, code_msg y page
    res.statusCode = code;
    res.statusMessage = code_msg;

    //-- Lectura asincrona de los recursos a mostrar en la pagina
    fs.readFile(petition, (err, data) => {
        if (err) {
            res.statusCode = 404
            res.statusMessage = "Not Found"
            petition = "./error.html";
            data = fs.readFileSync(petition);
            res.setHeader('Content-Type', mimetype);
            res.write(data);
            //-- Para que deje de buscar el recurso y vuelva a esperar peticiones
            return res.end();
        }

        //-- El valor de content type varia segun el formato de imagen pedido
        if (resource == 'jpg' || resource == 'png' || resource == 'jpeg') {
            mimetype = 'image/' + resource;
        }

        //-- Si nos piden el iconito, su tipo es texto plano
        if (resource == "ico") {
            mimetype = 'text/plain';
        }

        //-- Ajusto el valor del content type cuando nos piden un css
        if (resource == "css") {
            mimetype = 'text/css';
        }

        //console.log(mimetype)

        //-- Escribo la cabecera del mensaje y muestro la pagina solicitada
        res.setHeader('Content-type', mimetype);
        res.write(data);
        res.end();
    });
});

//-- Inicio el servidor en el puerto 9000
server.listen(PUERTO);

console.log("Servidor back-end. Escuchando en puerto: " + PUERTO);