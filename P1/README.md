 # Práctica 1: Tienda online

 Esta primera práctica consiste en crear una aplicación web que sea una tienda online. Para ello he tenido que programar tanto el servidor web *back-end* como la presentación al usuario *front-end*

 Por ahora el desarrollo de la práctica es el exigido por las especificaciones de la misma y no he implementado ninguna mejora.

 Para ejecutarla, basta con escribir en un terminal dentro de la carpeta P1 del directorio: 
 > node tienda.js 
 
 Posteriormente hay que entrar en el navegador web que se prefiera y poner la dirección:
 > 127.0.0.1:9000

 La práctica está optimizada en Google Chrome versión escritorio, si se usa desde otro navegador o desde un dispositivo movil puede que algunas fotos o letreros estén descuadrados.

 Otra consideración a tener en cuenta es que a veces a mí me pasa que al entrar en la página principal o en alguna de las secciones, éstas se visualizan como si no hubiera cargado a tiempo el fichero css, es decir, con el fondo blanco por defecto y los artículos fuera de sus posiciones. Esto se soluciona recargando la web una o dos veces.

 ## Documentación técnica del Servidor web

 Mi servidor web está construido sobre node.js, lo que quiere decir que hace uso de los módulos **url**, **http** y **fs**. Mediante estos módulos he conseguido implementar todas las especificaciones pedidas de la siguiente manera:  

 * Mediante **url** he recortado y pasado a mi servidor los recursos de las peticiones del cliente

 * Usando **http** he configurado el servidor para que escuche en el puerto 9000, funcionando de forma asíncrona.Tras esto buscará cada uno de los recursos pedidos por el cliente en el sistema para posteriormente mostrarlo en el *front-end*

 * Mediante **fs** he conseguido leer de forma asíncrona los ficheros donde están escritas las distintas componentes de la página web

 El servidor está programado para recibir la petición por parte del cliente, separar los campos de la misma, buscar el recurso solicitado en el sistema y servirlo. Cuando se recibe una petición se escriben los campos por de defecto para enviar al cliente, es decir, un res.statusCode = 200 y un res.statusMessage = OK. 
 
 En caso de que el recurso pedido exista, se construirá la página, se enviarán los anteriores campos formando una respuesta junto con el 'Content Type' del recurso y se mostrará por pantalla. Además, en la consola de comandos del VSCode podremos ver información de este proceso. 

 Por otro lado, si el recurso pedido no existe, los campos anteriormente mencionados cambiarám sus valores a '404' y 'Not Found' respectivamente y se mostrará una página de error en el navegador.

 ## Documentación técnica del Front-end

 La web que recibe el cliente y se muestra por pantalla se llama El Baúl del Coleccionista y está formado por un fichero html estático. Esta web es una tienda de películas en formato físico y de alta calidad, teniendo productos en Blu-Ray, 4K-UHD y ediciones SteelBook de las mismas calidades.

 En la página principal podemos encontrar tres secciones, cada una con su foto correspondiente y su tipo determinado de producto. También hay un símbolo que representa al carrito de la compra (*aún no accesible*) y un footer en el lado inferior derecho con datos sobre mí y mi página de Github. Para acceder a las distintas secciones de la web simplemente hay que hacer click en la foto que las representa o en el híperenlace de la sección. Cada una de estas secciones está compuesta por una página html distinta, con su correspondiente fichero css exclusivo que no se comparte entre ellas. Su organización es en estructura de malla (*grid* en css) y su encuadre puede variar dependiendo del navegador desde el que se visualice. 

 Las tres secciones incluyen una cantidad variable de películas junto con un rótulo que indica su nombre y precio, nada de ello accesible en este momento. Dentro de cada sección y al lado del icono del carrito, habrá aparecido el icono de una flecha que nos devolverá a la página anterior. 

 También existe una página de error con una foto graciosa que aparece cuando el cliente pide un recurso que no existe en el sistema. Para llegar a ella simplemente hay que borrar parte del recurso pedido, por ejemplo:

 > 127.0.0.1:9000/tiend



