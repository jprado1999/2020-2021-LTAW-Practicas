# Práctica 4: Aplicación Web de Chat con Electron

Esta cuarta práctica consiste crear un proyecto con **Node js** consistente en añadir funcionalidades de **Electron** a nuestra **aplicación Web de Chat** de la práctica 3. De esta forma cualquier usuario pueda descargarla y usarla en su ordenador, llegando a usarla desde un archivo ejecutable de Linux o incluso en sus dispositivos móviles al escanear un código QR. 

La aplicación dispondrá de una *interfaz gráfica* donde se muestra información acerca del sistema donde se ejecute, información del chat como los mensajes recibidos o el número de usuario y también la URL y código QR correspondientes para unirse al chat.

Una característica a destacar es que **no se ha hecho ningún cambio sobre el código del chat programado anteriormente**. Todos las adiciones son para crear y dejar totalmente funcional la interfaz gráfica de Electron.

Ahora, al tratarse de un **proyecto**, los ficheros que debe incluir son los siguientes:

* Ficheros fuente: *main.js*, *frontpage.js*, *frontpage.css*, *frontpage.html* y toda la carpeta *public* de la práctica anterior.

* Dependencias externas: están dentro de la carpeta *node_modules*, que no he subido al repositorio

* Información sobre el proyecto: toda la información está incluida en los ficheros *package.json* y *package-lock.json*, que describen el árbol de dependencias de mi programa. También incluyen la información necesaria para iniciar el programa.

Es muy sencillo arrancar la aplicación desde cualquier ordenador que tenga Node js instalado. Los pasos a seguir son los siguientes:

1. Descargar el repositorio en nuestro disco local y abrir una ventana del terminal, entrando en la carpeta del proyecto.

2. Ejecutar los siguientes comandos en orden en la consola:

> npm install

De esta manera se habrán descargado las dependencias necesarias para que funcione la aplicación.

> npm start

Al lanzar este segundo comando, node leerá del fichero *package.json* el comando para lanzar nuestro programa y lo ejecutará. 

Una vez ejecutado saltará en la pantalla una ventana de *Electron*, que en realidad es un navegador, con la que podremos monitorizar la aplicación y usar la **Url** o **código QR** que contiene para acceder a la página del chat como en la práctica 3.

Al comenzar a chatear e iniciar sesiones con otros usuarios, veremos como se va modificando la información que muestra la interfaz gráfica de Electron.

## Documentación técnica de la Aplicación

Ahora voy a ir explicando paso a paso cómo he programado cada una de las especificaciones de mi aplicación:

**1. Creación de la interfaz básica:** partiendo del código de la práctica anterior, debemos añadir el módulo Electron (descargándolo y posteriormente importándolo con *require()*). En este momento ya tendremos las funciones y propiedades del paquete de Electron para usarlas dentro de nuestra aplicación. Es por eso que ahora crearemos una app de Electron que escuche el evento *ready* y lance una función de retrollamada cuando éste ocurra. En ese momento crearemos la interfaz gráfica de Electron mediante el comando **new electron.BrowserWindow** además de cargar el fichero HTML que contiene la frontpage de la aplicación.

**2. Versiones de Node, Electron y Chrome en la interfaz gráfica de la aplicación:**  una vez creada la app de Electron, si queremos mostrar estas versiones por pantalla debemos hacer varias cosas: 

* En primer lugar como el proceso de renderizado necesita acceder al sistema para utilizar el módulo **process**, le tenemos que dar permisos desde el proceso principal. Para ello añadiremos las siguientes líneas en la creación de la ventana de Electron: 

> webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

Ahora desde el proceso de renderizado podremos usar **process.versions** que nos devuelve un array con versiones de diferentes programas, debemos filtrar este array y enviar a la interfaz las versiones pedidas. 

**2.5 Mejora de mostrar más información del sistema:** esto lo podemos realizar de manera muy sencilla desde el proceso de renderizado ya que le hemos dado permisos anteriormente. Utilizamos nuevamente el módulo **process** y sus propiedades para obtener la información requerida y mostrarla en la interfaz gráfica.

**3. URL a la que se deben conectar los clientes para chatear:** para realizar este apartado necesitaremos el módulo externo **ip**. Una vez descargado e importado a nuestro sistema, lo único que debemos hacer es guardar lo que nos devuelva ip.address() en una variable (yo lo he hecho desde el proceso principal) y posteriormente formar la URL completa junto con el inico, el puerto y el recurso. Una vez teniendo la URL completa, la he mandado al proceso de renderizado utilizando primero el evento *ready-to-show* (para que se muestre una vez cargada la página) y posteriormente win.webContents.send(). En el lado del proceso de renderizado simplemente hay que definir una función que escuche el evento con el que la he mandado y posteriormente representarla en la interfaz.

**3.5 Mejora de añadir un código QR que nos dirija a la página del chat:** partiendo de lo realizado anteriormente, he descargado e importado el módulo **qrcode**, que posteriormente utilizo de la siguiente manera (qrcode.toDataURL(url, function())) siendo ese parámetro url la que he recibido del proceso principal. Para representar el código formado en la interfaz, debo darle permiso desde el fichero html al javascript para que pueda formar y utilizar imágenes en dicha interfaz. Esto lo permito escribiendo "img-src 'self' data:" en la línea correspondiente de la política de seguridad de contenidos.

**4. Mostrar los mensajes que envían los usuarios:** para poder mostrar los mensajes del chat lo primero que debemos hacer es definir la *zona de nuestra interfaz gráfica* donde queremos que aparezcan y las propiedades que tendrá ese *display*. Tras ello lo único que debemos hacer es dentro del socket del servidor enviar la información de cada evento recibido al proceso de renderizado con la funcion *win.webContentes.sen()*. En el proceso de renderizado debemos escuchar esos eventos, darle el formato deseado a cada mensaje recibido y mostrarlo en el display definido anteriormente.

**5. Botón de pruebas para enviar un mensaje a todos los usuarios conectados:** para realizar esta especificación debemos declarar un botón en nuestra página html y controlar lo que ocurre cuando sea pulsado. En ese momento directamente puedo imprimir un mensaje por el display, a la vez que envío la misma información mediante un evento al proceso principal mediante la función *electron.ipcRenderer.invoke()*. En el proceso de principal escucho ese evento y mediante io.send() envío el mensaje recibido a todos los clientes.