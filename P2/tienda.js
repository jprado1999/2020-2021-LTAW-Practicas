//-- Importo los módulos necesarios para el servidor
const http = require('http');
const fs = require('fs');

//-- Defino el numero de puerto que utilizo
const PUERTO = 9000;

//-- Leer el fichero JSON en el que se almacena la información por defecto de la tienda
const tienda_json = fs.readFileSync('json/tienda.json');

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Obtengo el array de productos de mi tienda
let productos = tienda[3]["lista"];

//-- Defino una variable para almacenar el resultado de la busqueda
let resultadoB = "";

//-- Voy a definir 3 arrays en los que incluyo las peliculas
//-- que hay en cada una de mis paginas web. Así podré elegir
//-- el hiperenlace adecuado que envío junto con el nombre del producto
let peli4k = ["Pelicula 4k", "1917", "Batman", "Harry Potter", "Kong", "Spiderman", "Resident Evil"];

let peliblu = [ "Pelicula BluRay", "La Amenaza Fantasma",
"El Ataque de los Clones", "La Venganza de los Sith", "Una Nueva Esperanza",
"El Imperio Contraataca", "El Retorno del Jedi", "El Despertar de la fuerza",
"Los Últimos Jedi", "El Ascenso de Skywalker", "Han Solo", "Rogue One", "The Clone Wars"];

let pelisteel = [ "Pelicula Steelbook", "Indiana Jones", "Tenet",
"Joker", "IT", "Los Vengadores", "El Prestigio"];

//-- Nombre del fichero JSON de salida, para no modificar el original
const FICHERO_JSON_OUT = "json/resultado.json";

//-- Leer el fichero de respuesta al formulario
const RESPUESTA = fs.readFileSync('html/procesar.html', 'utf-8');

//-- Leer el fichero de la página principal
const MAIN = fs.readFileSync('tienda.html', 'utf-8');

//-- Leer el fichero de procesar compras
const PROC = fs.readFileSync('html/procesar-compra.html', 'utf-8');

//-- Leer el formulario de compra final
const FORM_FINAL = fs.readFileSync('html/formulario-compra.html', 'utf-8');

//-- Leer cada una de las secciones para hacer las páginas dinámicas
const seccion4K = fs.readFileSync('html/seccion4k.html', 'utf-8');
const seccionBR = fs.readFileSync('html/seccionbluray.html', 'utf-8');
const seccionST = fs.readFileSync('html/seccionsteelbook.html', 'utf-8');

//-- Función que analiza las cookies y devuelve el nombre del
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

//-- Función que analiza las cookies y devuelve el nombre del
//-- producto que hay en el carrito, o null en caso contrario
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

//-- Función que analiza la cookie y devuelve la cantidad de
//-- productos de cada tipo que se van a comprar, o null en caso contrario
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
        console.log("Nombre: " + nombre + " Valor: " + valor);
        //-- Leer el producto
        //-- Solo si el nombre es una cantidad
        if (nombre.trim() === 'cantidad4k') {
            cantidad = valor;
        } else if (nombre.trim() === 'cantidadBluray') {
            cantidad = valor;
        } else if (nombre.trim() === 'cantidadSteelbook') {
            cantidad = valor;
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
    //console.log("\nSe ha solicitado el recurso: " + url.pathname);

    //-- Obtener el nombre del usuario que ha accedido
    let user = get_user(req);

    //-- Si se pide la pagina principal
    if (url.pathname == "/") {

        if (user) {
            //--- Si la variable user está asignada
            //-- El usuario ya ha hecho login anteriormente, devuelvo la pagina correspondiente
            petition = MAIN.replace("HTML_LOGIN", user);
        } else {
            //-- Si no esta asignado user, devuelvo el formulario de registro
            let html_login = '<a href="html/formulario.html">Login</a>';
            petition = MAIN.replace("HTML_LOGIN", html_login);
        }

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
    } else if (url.pathname == '/pedidos') {        //-- Pedidos pendientes
        if (user == 'Root') {
            petition += '/json/resultado.json';
            resource = petition.split(".")[1];
            petition = "." + petition;
        }
    } else if (url.pathname == '/resultados') {     //-- Peticion AJAX
        console.log("Peticion de Productos!")
        mimetype = "application/json";

        //-- Leer los parámetros
        let param1 = url.searchParams.get('param1');

        param1 = param1.toUpperCase();

        console.log("  Parametro: " +  param1);

        let result = [];

        for (let prod of productos) {

            //-- Pasar a mayúsculas
            prodU = prod.toUpperCase();

            //-- Si el producto comienza por lo indicado en el parametro
            //-- meter este producto en el array de resultados
            if (prodU.startsWith(param1)) {
                result.push(prod);
                //-- Me guardo el resultado de la busqueda, que será el que decida
                //-- la pagina que pido al apretar el botón 'Buscar'
                resultadoB = prod;
            }
            
        }
        //-- Enviar la peticion AJAX
        console.log("  Resultados:")
        console.log(result);
        petition = JSON.stringify(result);
        res.setHeader('Content-Type', mimetype);
        res.write(petition);
        res.end();
        return

    } else if (url.pathname == '/buscar' || url.pathname == '/html/seccion4k.html' ||
    url.pathname == '/html/seccionbluray.html' || url.pathname == '/html/seccionsteelbook.html') {
        //-- Para cargar las páginas dinámicas de los productos, tengo que hacerlo tanto
        //-- si me las piden desde la pagina de inicio, como si me las piden desde el buscador
        if (peli4k.includes(resultadoB) || url.pathname == '/html/seccion4k.html') {
            //-- Si buscan una peli de esta seccion o se pide la seccion entera
            //-- tengo que definir los elementos dinamicos para cada caso
            let descripcion = tienda[1]["productos"][2]["descripcion"];
            let precio = "Precio: " + tienda[1]["productos"][2]["precio"];
            petition = seccion4K.replace("HTML_EXTRA", descripcion);
            petition = petition.replace("PRECIO", precio);
        } else if (peliblu.includes(resultadoB) || url.pathname == '/html/seccionbluray.html') {
            let descripcion = tienda[1]["productos"][0]["descripcion"];
            let precio = "Precio: " + tienda[1]["productos"][0]["precio"];
            petition = seccionBR.replace("HTML_EXTRA", descripcion);
            petition = petition.replace("PRECIO", precio);
        } else if (pelisteel.includes(resultadoB) || url.pathname == '/html/seccionsteelbook.html') {
            let descripcion = tienda[1]["productos"][1]["descripcion"];
            let precio = "Precio: " + tienda[1]["productos"][1]["precio"];
            petition = seccionST.replace("HTML_EXTRA", descripcion);
            petition = petition.replace("PRECIO", precio);
        } else {
            petition = fs.readFileSync('html/error.html', 'utf-8');
        }
        //-- Finalmente envio la peticion y vacío el resultado de la búsqueda
        resultadoB = "";
        resource = "html";
        res.setHeader('Content-Type', mimetype);
        res.write(petition);
        res.end();
        return
    } else if (url.pathname == '/html/formulario-compra.html'){ //-- Formulario de pago
        //-- Defino el mensaje por defecto y compruebo si hay productos en el carrito
        let html_extra = "No hay productos";
        let cart = get_cart(req);
        let cantidadC = get_cantidad(req);
        //-- Cambio el mensaje en caso de que haya productos
        if (cart) {
            html_extra = 'Productos en tu carrito: ' + cart + " - Cantidad: " + cantidadC;
            console.log(html_extra)
        }
        //-- Cargo la página solicitada
        petition = FORM_FINAL.replace("HTML_EXTRA", html_extra);
        resource = "html";
        res.setHeader('Content-Type', mimetype);
        res.write(petition);
        res.end();
        return
    } else {            
        //-- Si se pide cualquier otro recurso
        //-- Obtengo el nombre, contraseña y los parametros de la compra de la url en caso de que los haya
        nombre = url.searchParams.get('nombre');
        let contraseña = url.searchParams.get('contraseña');
        let envio = url.searchParams.get('envio');
        let tarjeta = url.searchParams.get('tarjeta');
        let cantidad4k = url.searchParams.get('cantidad4k');
        let cantidadBluray = url.searchParams.get('cantidadBluray');
        let cantidadSteel = url.searchParams.get('cantidadSteel');

        //-- Si estamos saliendo de la pagina de login
        if (nombre != null && contraseña != null) {               
            let html_extra = "";
            //-- Evalúo el usuario y contraseña de los distintos usuarios
            if ((nombre == tienda[0]["usuarios"][0]["nombre"] && contraseña == tienda[0]["usuarios"][0]["contraseña"]) 
            || (nombre == tienda[0]["usuarios"][1]["nombre"] && contraseña == tienda[0]["usuarios"][1]["contraseña"])
            || (nombre == tienda[0]["usuarios"][2]["nombre"] && contraseña == tienda[0]["usuarios"][2]["contraseña"])) {
                //-- Devolver la pagina de bienvenida correspondiente
                petition = RESPUESTA.replace("NOMBRE", nombre);
                html_extra = "<h2>Bienvenid@ a mi tienda!!</h2>";
                petition = petition.replace("HTML_EXTRA", html_extra);

                //-- Como el login ha sido correcto, añado la cookie al mensaje de respuesta
                let sendCookie = "user=" + nombre + "; path=/";

                //console.log(sendCookie);
                res.setHeader('Set-Cookie', sendCookie);
            } else {
                //-- Devolver la pagina de bienvenida de error
                nombre = "Desconocido o contraseña incorrecta";
                petition = RESPUESTA.replace("NOMBRE", nombre);
                html_extra = "<h2>Tu usuario o contraseña no son correctos</h2>\n \
                Prueba los usuarios: 'Root', 'El coleccionista' o 'La compra-pelis' y la contraseña: LTAW";
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
            let cantCookie = "";

            //-- Se puede comprar cada producto cuando su stock sea mayor que 0
            if (cantidad4k != null && tienda[1]["productos"][2]["stock"] > 0) { //-- Coge valor al salir del formulario 4k
                //-- Si se quieren comprar más productos de los que hay en stock
                //-- la cantidad que compras se ajusta a los máximos productos que haya en stock
                if ((tienda[1]["productos"][2]["stock"] - cantidad4k) < 0) {
                    cantidad4k = tienda[1]["productos"][2]["stock"];
                }
                //-- Defino el valor de las cookies
                cartCookie += "4k; path=/";
                cantCookie += "cantidad4k=" + cantidad4k + "; path=/";
                //-- Actualizo el stock de la tienda 
                tienda[1]["productos"][2]["stock"] -= cantidad4k;

            } else if (cantidadBluray != null && tienda[1]["productos"][0]["stock"] > 0) { //-- Coge valor al salir del formulario blu ray
                if ((tienda[1]["productos"][0]["stock"] - cantidadBluray) < 0) {
                    cantidadBluray = tienda[1]["productos"][0]["stock"];
                }
                cartCookie += "Bluray; path=/";
                cantCookie += "cantidadBluray=" + cantidadBluray + "; path=/";
                //-- Actualizo el stock de la tienda
                tienda[1]["productos"][0]["stock"] -= cantidadBluray;

            } else if (cantidadSteel != null && tienda[1]["productos"][1]["stock"] > 0) { //-- Coge valor al salir del formulario Steelbook
                if ((tienda[1]["productos"][1]["stock"] - cantidadSteel) < 0) {
                    cantidadSteel = tienda[1]["productos"][1]["stock"];
                }
                cartCookie += "Steelbook; path=/";
                cantCookie += "cantidadSteelbook=" + cantidadSteel + "; path=/";
                //-- Actualizo el stock de la tienda
                tienda[1]["productos"][1]["stock"] -= cantidadSteel;
            } else {
                //-- Devuelvo una pagina indicando el error
                //-- No envio ninguna cookie ni modifico el archivo json
                petition = PROC.replace("HTML_EXTRA", "No queda stock del producto que quieres comprar");
                resource = "html";
                res.setHeader('Content-Type', mimetype);
                res.write(petition);
                res.end();
                return
            }

            //-- Envio la cookie del carrito y la cantidad 
            //-- solo si estamos realizando una compra
            //cartCookie += "; path=/"; Esto es para una cookie de carrito con todos los productos
            console.log(cartCookie);
            console.log(cantCookie);
            res.setHeader('Set-Cookie', [cartCookie, cantCookie]);

            //-- Convertir la variable tienda a cadena JSON para actualizar el stock
            let myJSON = JSON.stringify(tienda);
            //-- Actualizar el stock
            fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

            //-- Devuelvo la página correspondiente a que hemos añadido cosas al carrito
            petition = PROC.replace("HTML_EXTRA", "Producto añadido al carrito");
            resource = "html";
            res.setHeader('Content-Type', mimetype);
            res.write(petition);
            res.end();
            return
        }

        if (envio != null && tarjeta != null) { //-- Estamos saliendo de la pagina de pagar
            
            //-- Compruebo que tengo usuario 
            if (user) {

                //-- Compruebo si tengo la cookie del carrito
                let cart = get_cart(req);
                let cantidad = get_cantidad(req);
                console.log("Producto: " + cart + " - cantidad: " + cantidad);

                if (cart != null) {     //-- Compruebo si hay productos en el carrito
                    //-- Añado los datos del pedido según los valores de los campos extraídos anteriormente
                    tienda[2]["pedidos"][0]["direccion de envio"] = envio;
                    tienda[2]["pedidos"][0]["numero de la tarjeta"] = tarjeta;
                    tienda[2]["pedidos"][0]["nombre de usuario"] = user;

                    if (cantidad != null) {
                        //-- En esta version solo se puede comprar un producto
                        //-- El que esté en la cookie del carrito
                        if (cart == "4k") {
                            tienda[2]["pedidos"][0]["productos"][0]["nombre"] = cart;
                            tienda[2]["pedidos"][0]["productos"][0]["cantidad"] = cantidad;
                        } else if (cart == "Bluray") {
                            tienda[2]["pedidos"][0]["productos"][1]["nombre"] = cart;
                            tienda[2]["pedidos"][0]["productos"][1]["cantidad"] = cantidad;
                        } else if (cart == "Steelbook") {
                            tienda[2]["pedidos"][0]["productos"][2]["nombre"] = cart;
                            tienda[2]["pedidos"][0]["productos"][2]["cantidad"] = cantidad;
                        }
                    } else {
                        console.log("No hay productos en el carrito");
                    }

                    //-- Vacio la cookie del carrito
                    let cartCookie = "carrito=; path=/";
                    res.setHeader('Set-Cookie', cartCookie);

                    //-- Convertir la variable a cadena JSON
                    let myJSON = JSON.stringify(tienda);
                    //-- Guardarla en el fichero destino para actualizar los datos del pedido
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
                    petition = PROC.replace("HTML_EXTRA", "No se ha podido realizar la compra, no hay productos en el carrito");
                    resource = "html";
                    res.setHeader('Content-Type', mimetype);
                    res.write(petition);
                    res.end();
                    return
                }
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

    //console.log("Nombre del recurso servido: " + petition);
    //console.log("Extension del recurso: " + resource);

    //-- Generar la respuesta en función de las variables
    //-- code, code_msg
    res.statusCode = code;
    res.statusMessage = code_msg;

    //-- Lectura asincrona de los recursos
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