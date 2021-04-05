//-- Importo los módulos necesarios para el servidor
const http = require('http');
const fs = require('fs');

//-- Defino el numero de puerto que utilizo
const PUERTO = 9000;

//-- Leer el fichero JSON
const tienda_json = fs.readFileSync('json/tienda.json');

//-- Leer el fichero de respuesta al formulario
const RESPUESTA = fs.readFileSync('html/procesar.html', 'utf-8');

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Creo el servidor
const server = http.createServer((req, res) => {
    console.log("\nPetición recibida!");

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";

    //-- Declaro el valor del content type por defecto
    let mimetype = 'text/html';

    //-- Declaro la variable que almacenará los recursos solicitados
    let petition = "";

    //-- Defino la variable que va a obtener el nombre introducido en el formulario
    let nombre;

    //-- Construyo la url que pide el cliente
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("\nSe ha solicitado el recurso: " + url.pathname);

    //-- Si se pide la pagina principal
    if (url.pathname == "/") {
        petition += "/tienda.html";
        //-- Me guardo el tipo de recurso pedido, separando su nombre de la extension
        resource = petition.split(".")[1];
        //-- Le añado un punto para que el sistema pueda buscarlo y mostrarlo
        petition = "." + petition;
    } else if (url.pathname == '/favicon.ico') {    //-- Si se pide el icono de la pestaña
        petition += '/img/carrito.jpg';
        //-- Me guardo el tipo de recurso pedido, separando su nombre de la extension
        resource = petition.split(".")[1];
        //-- Le añado un punto para que el sistema pueda buscarlo y mostrarlo
        petition = "." + petition;
    } else if (url.pathname == '/productos') {      //-- Productos de la tienda
        petition += '/json/tienda.json';
        //-- Me guardo el tipo de recurso pedido, separando su nombre de la extension
        resource = petition.split(".")[1];
        //-- Le añado un punto para que el sistema pueda buscarlo y mostrarlo
        petition = "." + petition;            
    } else {                                        
        //-- Si se pide cualquier otra cosa
        nombre = url.searchParams.get('nombre');
        //console.log("Nombre: " + nombre);
        if (nombre != null) {
            let html_extra = "";
            if (nombre == tienda[0]["usuarios"][0]["nombre"] || nombre == tienda[0]["usuarios"][1]["nombre"] || nombre == tienda[0]["usuarios"][2]["nombre"]) {
                //-- Devolver la pagina de bienvenida correspondiente
                console.log("Usuario registrado");
                petition = RESPUESTA.replace("NOMBRE", nombre);
                html_extra = "<h2>Bienvenid@ a mi tienda!!</h2>";
                petition = petition.replace("HTML_EXTRA", html_extra);
            } else {
                //-- Devolver la pagina de bienvenida de error
                nombre = "Desconocido";
                petition = RESPUESTA.replace("NOMBRE", nombre);
                console.log("Usuario desconocido");
                html_extra = "<h2>Tu usuario no se encuentra en la base de datos</h2>";
                petition = petition.replace("HTML_EXTRA", html_extra);
            }
            resource = "html"
            res.setHeader('Content-Type', mimetype);
            res.write(petition);
            res.end();
            return
        } else {
            //-- Le doy valor a la peticion cuando el archivo a devolver no es la respuesta de
            //-- un formulario
            petition = url.pathname; 
            //-- Me guardo el tipo de recurso pedido, separando su nombre de la extension
            resource = petition.split(".")[1];
            //-- Le añado un punto para que el sistema pueda buscarlo y mostrarlo
            petition = "." + petition;
        }
    }

    //-- Me guardo el tipo de recurso pedido, separando su nombre de la extension
    //resource = petition.split(".")[1];
    //-- Le añado un punto para que el sistema pueda buscarlo y mostrarlo
    //petition = "." + petition;

    console.log("Nombre del recurso servido: " + petition);
    //console.log("Extension del recurso: " + resource);

    //-- Generar la respusta en función de las variables
    //-- code, code_msg
    res.statusCode = code;
    res.statusMessage = code_msg;

    //-- Lectura asincrona de los recursos a mostrar en la pagina
    fs.readFile(petition, (err, data) => {
        if (err) {
            res.statusCode = 404
            res.statusMessage = "Not Found"
            petition = "html/error.html";
            data = fs.readFileSync(petition);
            res.setHeader('Content-Type', mimetype);
            res.write(data);
            //-- Para que deje de buscar el recurso y vuelva a esperar peticiones
            return res.end();
        }

        //-- Ajusto el valor del content type cuando nos piden un css
        if (resource == "css") {
            mimetype = "text/css";
        }

        //-- El valor de content type varia segun el formato de imagen pedido
        if (resource == "jpg" || resource == "png" || resource == "jpeg") {
            mimetype = "image/" + resource;
        }

        //-- Si nos piden el iconito, su tipo es texto plano
        if (resource == "ico") {
            mimetype = "text/plain";
        }

        //-- Ajusto el valor del content type cuando nos piden un archivo js
        if (resource == "js") {
            mimetype = "application/javascript";
        }

        //-- Ajusto el valor del conten type cuando nos piden un json
        if (resource == "json") {
            mimetype = "application/json";
        }

        //-- Escribo la cabecera del mensaje y muestro la pagina solicitada
        res.setHeader('Content-Type', mimetype);
        res.write(data);
        res.end();
    });
});

//-- Inicio el servidor en el puerto 9000
server.listen(PUERTO);

console.log("Servidor back-end. Escuchando en puerto: " + PUERTO);