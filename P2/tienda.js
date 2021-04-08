//-- Importo los módulos necesarios para el servidor
const http = require('http');
const fs = require('fs');

//-- Defino el numero de puerto que utilizo
const PUERTO = 9000;

//-- Leer el fichero JSON
const tienda_json = fs.readFileSync('json/tienda.json');

//-- Nombre del fichero JSON de salida provisional, para no modificar el original
const FICHERO_JSON_OUT = "json/resultado.json";

//-- Leer el fichero de respuesta al formulario
const RESPUESTA = fs.readFileSync('html/procesar.html', 'utf-8');

//-- Leer el fichero que indica que un usuario ya está logueado
const LOGUED = fs.readFileSync('html/usuarioexistente.html', 'utf-8');

//-- Leer el fichero de la página principal
const MAIN = fs.readFileSync('tienda.html', 'utf-8');

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Analizar la cookie y devolver el nombre del
//-- usuario si existe, o null en caso contrario
function get_user(req) {

  //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
        
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");
        
    //-- Variable para guardar el usuario
    let user;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'user') {
        user = valor;
      }
    });

    //-- Si la variable user no está asignada
    //-- se devuelve null
    return user || null;
  }
}

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

    //-- Obtener le usuario que ha accedido
    //-- null si no se ha reconocido
    let user = get_user(req);

    //console.log("User: " + user);

    //-- Si se pide la pagina principal
    if (url.pathname == "/") {

        //--- Si la variable user está asignada
        if (user) {
            //console.log("Pagina con usuario");
            //-- El usuario ya ha hecho login anteriormente, devuelvo la pagina correspondiente
            petition = MAIN.replace("HTML_LOGIN", user);
            resource = "html";
            res.setHeader('Content-Type', mimetype);
            res.write(petition);
            res.end();
            return
        } 
        //-- Si no esta asignado user
        //console.log("Pagina con login");
        let html_login = '<a href="html/formulario.html">Login</a>';
        petition = MAIN.replace("HTML_LOGIN", html_login);
        resource = "html";
        res.setHeader('Content-Type', mimetype);
        res.write(petition);
        res.end();
        return
    } else if (url.pathname == '/favicon.ico') {    //-- Si se pide el icono de la pestaña
        petition += '/img/carrito.jpg';
        resource = petition.split(".")[1];
        petition = "." + petition;
    } else if (url.pathname == '/productos') {      //-- Productos de la tienda
        petition += '/json/tienda.json';
        resource = petition.split(".")[1];
        petition = "." + petition;            
    } else if (url.pathname == '/html/formulario.html') {                                        
        
        //--- Si la variable user está asignada, no permito hacer login
        if (user) {
            //-- El usuario ya ha hecho login anteriormente, devuelvo la pagina correspondiente
            //console.log("Usuario existente");
            petition = LOGUED.replace("USER", user);
            resource = "html";
            res.setHeader('Content-Type', mimetype);
            res.write(petition);
            res.end();
            return
        }
        //-- Si no hay cookie devuelvo el formulario, puesto que es la primera vez que se pide
        petition = url.pathname; 
        resource = petition.split(".")[1];
        petition = "." + petition;

    } else {            
        //-- Si se pide cualquier otra cosa
        //-- Obtengo el nombre y los datos de la compra de la url en caso de que los haya
        nombre = url.searchParams.get('nombre');
        envio = url.searchParams.get('envio');
        tarjeta = url.searchParams.get('tarjeta');
        cantidad4k = url.searchParams.get('cantidad4k');
        cantidadBluray = url.searchParams.get('cantidadBluray');
        cantidadSteel = url.searchParams.get('cantidadSteel');

        //console.log("Nombre: " + nombre);
        if (nombre != null) {           //-- Estamos saliendo de la pagina de login               
            let html_extra = "";
            if (nombre == tienda[0]["usuarios"][0]["nombre"] || nombre == tienda[0]["usuarios"][1]["nombre"] || nombre == tienda[0]["usuarios"][2]["nombre"]) {
                //-- Devolver la pagina de bienvenida correspondiente
                //console.log("Usuario registrado");
                petition = RESPUESTA.replace("NOMBRE", nombre);
                html_extra = "<h2>Bienvenid@ a mi tienda!!</h2>";
                petition = petition.replace("HTML_EXTRA", html_extra);

                //-- Como el login ha sido correcto, añado la cookie al mensaje de respuesta
                let sendCookie = "user=" + nombre + ";path=/";

                //console.log(sendCookie);
                res.setHeader('Set-Cookie', sendCookie);
            } else {
                //-- Devolver la pagina de bienvenida de error
                nombre = "Desconocido";
                petition = RESPUESTA.replace("NOMBRE", nombre);
                //console.log("Usuario desconocido");
                html_extra = "<h2>Tu usuario no se encuentra en la base de datos</h2>";
                petition = petition.replace("HTML_EXTRA", html_extra);
            }
            resource = "html";
            res.setHeader('Content-Type', mimetype);
            res.write(petition);
            res.end();
            return
        }

        if (cantidad4k != null) {
            let cartCookie = "cantidad4k=" + cantidad4k + ";path=/";
            console.log(cartCookie);
            res.setHeader('Set-Cookie', cartCookie);
            //tienda[1]["productos"][2]["stock"] -= cantidad4K;
            //tienda[2]["pedidos"][0]["productos"][0]["cantidad"] += cantidad4k;
        }

        if (cantidadBluray != null) {
            let cartCookie = "cantidadBluray=" + cantidadBluray + ";path=/";
            console.log(cartCookie);
            res.setHeader('Set-Cookie', cartCookie);
            //tienda[1]["productos"][0]["stock"] -= cantidadBluray;
            //tienda[2]["pedidos"][0]["productos"][1]["cantidad"] += cantidadBluray;
        }

        if (cantidadSteel != null) {
            let cartCookie = "cantidadSteel=" + cantidadSteel + ";path=/";
            console.log(cartCookie);
            res.setHeader('Set-Cookie', cartCookie);
            //tienda[1]["productos"][1]["stock"] -= cantidadSteel;
            //tienda[2]["pedidos"][0]["productos"][2]["cantidad"] += cantidadSteel;
        }

        if (envio != null && tarjeta != null) { //-- Estamos saliendo de la pagina de comprar
            tienda[2]["pedidos"][0]["direccion de envio"] = envio;
            tienda[2]["pedidos"][0]["numero de la tarjeta"] = tarjeta;
            
            //-- Convertir la variable a cadena JSON
            let myJSON = JSON.stringify(tienda);
            //-- Guardarla en el fichero destino
            fs.writeFileSync(FICHERO_JSON_OUT, myJSON);
        }
         
        //-- Le doy valor a la peticion cuando el archivo a devolver no es la respuesta de
        //-- un formulario
        petition = url.pathname; 
        //-- Me guardo el tipo de recurso pedido, separando su nombre de la extension
        resource = petition.split(".")[1];
        //-- Le añado un punto para que el sistema pueda buscarlo y mostrarlo
        petition = "." + petition;
    }

    console.log("Nombre del recurso servido: " + petition);
    //console.log("Extension del recurso: " + resource);

    //-- Generar la respusta en función de las variables
    //-- code, code_msg
    res.statusCode = code;
    res.statusMessage = code_msg;

    //-- Lectura asincrona de los recursos a mostrar en la pagina
    fs.readFile(petition, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.statusMessage = "Not Found";
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