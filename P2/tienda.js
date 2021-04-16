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

//-- Leer el fichero de procesar compras
const PROC = fs.readFileSync('html/procesar-compra.html', 'utf-8');

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

function get_cart(req) {

    //-- Leer la Cookie recibida
    const cookie = req.headers.cookie;
  
    //-- Hay cookie
    if (cookie) {
          
      //-- Obtener un array con todos los pares nombre-valor
      let pares = cookie.split(";");
          
      //-- Variable para guardar el carrito y la cantidad
      let cart;
  
      //-- Recorrer todos los pares nombre-valor
      pares.forEach((element, index) => {
  
        //-- Obtener los nombres y valores por separado
        let [nombre, valor] = element.split('=');
  
        //-- Leer el producto
        //-- Solo si el nombre es 'carrito'
        if (nombre.trim() === 'carrito') {
            cart = valor;
        }
      });
      //-- Si la variable cart no está asignada
      //-- se devuelve null
      return cart || null;
    }
}

function get_cantidad(req) {

    //-- Leer la Cookie recibida
    const cookie = req.headers.cookie;
  
    //-- Hay cookie
    if (cookie) {
          
      //-- Obtener un array con todos los pares nombre-valor
      let pares = cookie.split(";");
      console.log(pares);
      //-- Variable para guardar la cantidad
      let cantidad;
  
      //-- Recorrer todos los pares nombre-valor
      pares.forEach((element, index) => {
  
        //-- Obtener los nombres y valores por separado
        let [nombre, valor] = element.split('=');
        console.log("Nombre: " + nombre + " valor: " + valor);
        //-- Leer el producto
        //-- Solo si el nombre es una cantidad
        if (nombre.trim() === 'cantidad4k') {
            cantidad = valor;
            console.log(cantidad);
        } else if (nombre.trim() === 'cantidadBluray') {
            cantidad = valor;
            console.log(cantidad);
        } else if (nombre.trim() === 'cantidadSteelbook') {
            cantidad = valor;
            console.log(cantidad);
        }
      });
  
      //-- Si la variable cantidad no está asignada
      //-- se devuelve null
      return cantidad || null;
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
    } else if (url.pathname == '/productos') {      //-- Productos de la tienda en formato json
        petition += '/json/tienda.json';
        resource = petition.split(".")[1];
        petition = "." + petition;            
    } else if (url.pathname == '/html/formulario.html') {                                        
        
        //-- Si la variable user está asignada, no permito hacer login
        //-- Este if nunca debería alcanzarse puesto que al loguearte
        //-- desaparece el enlace a la página de login
        //-- Lo he dejado para que se vea como lo controlaba antes 
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
        //-- Si se pide cualquier otro recurso
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
                let sendCookie = "user=" + nombre + "; path=/";

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

        //-- Si estamos saliendo de cualquiera de las páginas de compra
        if (cantidad4k != null || cantidadBluray != null || cantidadSteel != null) {

            //-- Defino el inicio de la cookie que almacenara los productos del carrito
            let cartCookie = "carrito=";

            if (cantidad4k != null) {           //-- Coge valor al salir del formulario 4k
                cartCookie += "4k;cantidad4k=" + cantidad4k + ";path=/";
            } else if (cantidadBluray != null) {       //-- Coge valor al salir del formulario blu ray
                cartCookie += "Bluray;cantidadBluray=" + cantidadBluray + ";path=/"
            } else if (cantidadSteel != null) {        //-- Coge valor al salir del formulario Steelbook
                cartCookie += "Steelbook;cantidadSteelbook=" + cantidadSteel + ";path=/";
            }

            //-- Envio la cookie del carrito solo si estamos realizando una compra
            //cartCookie += "; path=/";
            console.log(cartCookie);
            res.setHeader('Set-Cookie', cartCookie);
        }

        //-- Hay que mandar otra cookie

        if (envio != null && tarjeta != null) { //-- Estamos saliendo de la pagina de comprar

            if (user) {     //-- Si hay usuario procesamos la compra, en caso contrario no
                //-- Añado los datos del pedido según los valores de los campos extrídos anteriormente
                tienda[2]["pedidos"][0]["direccion de envio"] = envio;
                tienda[2]["pedidos"][0]["numero de la tarjeta"] = tarjeta;
                tienda[2]["pedidos"][0]["nombre de usuario"] = user;

                //-- Compruebo si tengo la cookie del carrito para añadir los productos al pedido
                let cart = get_cart(req);
                let cantidad = get_cantidad(req);
                console.log("Producto: " + cart + " - cantidad: " + cantidad);
                if (cart != null & cantidad != null) {
                    console.log("Producto: " + cart + " - cantidad: " + cantidad);
                    if (cart == "4k") {
                        tienda[2]["pedidos"][0]["productos"][0]["nombre"] = cart;
                        tienda[2]["pedidos"][0]["productos"][0]["cantidad"] = cantidad;
                        //-- Actualizo el stock de la tienda 
                        tienda[1]["productos"][2]["stock"] -= cantidad;
                    } else if (cart == "Bluray") {
                        tienda[2]["pedidos"][0]["productos"][1]["nombre"] = cart;
                        tienda[2]["pedidos"][0]["productos"][1]["cantidad"] = cantidad;
                        //-- Actualizo el stock de la tienda
                        tienda[1]["productos"][0]["stock"] -= cantidad;
                    } else if (cart == "Steelbook") {
                        tienda[2]["pedidos"][0]["productos"][2]["nombre"] = cart;
                        tienda[2]["pedidos"][0]["productos"][2]["cantidad"] = cantidad;
                        //-- Actualizo el stock de la tienda
                        tienda[1]["productos"][1]["stock"] -= cantidad;
                    }
                } else {
                    console.log("Hay un problema con la cantidad o tipo de productos");
                }

                //-- Convertir la variable a cadena JSON
                let myJSON = JSON.stringify(tienda);
                //-- Guardarla en el fichero destino
                fs.writeFileSync(FICHERO_JSON_OUT, myJSON);
                //-- Como había usuario devuelvo la página de compra exitosa
                petition = PROC.replace("HTML_EXTRA", "¡Compra realizada!");
                resource = "html";
                res.setHeader('Content-Type', mimetype);
                res.write(petition);
                res.end();
                return
            } else {
                //-- Como no había usuario devuelvo la página de compra fallida
                petition = PROC.replace("HTML_EXTRA", "No se ha podido realizar la compra, usuario no registrado");
                resource = "html";
                res.setHeader('Content-Type', mimetype);
                res.write(petition);
                res.end();
                return
            }
        }
         
        //-- Le doy valor a la peticion para devolver la pagina pedida sea cual sea
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