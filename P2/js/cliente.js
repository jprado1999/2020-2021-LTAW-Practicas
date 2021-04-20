console.log("Ejecutando Javascript...");

//-- Elementos HTML para mostrar informacion
const display1 = document.getElementById("display1");
const display2 = document.getElementById("display2");
const display3 = document.getElementById("display3");
const display4 = document.getElementById("display4");
const display5 = document.getElementById("display5");
const display6 = document.getElementById("display6");
const master = document.getElementById("master");

//-- Caja de busqueda
const caja = document.getElementById("caja");

//-- Retrollamda del boton de Ver productos
caja.oninput = () => {

    //-- Crear objeto para hacer peticiones AJAX
    const m = new XMLHttpRequest();

    //-- Función de callback que se invoca cuando
    //-- hay cambios de estado en la petición
    m.onreadystatechange = () => {

        //-- Petición enviada y recibida. Todo OK!
        if (m.readyState==4) {

            //-- Solo la procesamos si la respuesta es correcta
            if (m.status==200) {

                //-- La respuesta es un objeto JSON
                let productos = JSON.parse(m.responseText)

                //-- Borrar el resultado anterior
                master.innerHTML = "";
                display1.innerHTML = "";
                display2.innerHTML = "";
                display3.innerHTML = "";
                display4.innerHTML = "";
                display5.innerHTML = "";
                display6.innerHTML = "";

                //-- Añadir cada a la lista deplegable
                display1.innerHTML += productos[0];
                display2.innerHTML += productos[1];
                display3.innerHTML += productos[2];
                display4.innerHTML += productos[3];
                display5.innerHTML += productos[4];
                display6.innerHTML += productos[5];

                //--Recorrer los productos del objeto JSON
                for (let i=0; i < productos.length; i++) {

                    master.innerHTML += productos[i];

                }

            } else {
                //-- Hay un error en la petición
                //-- Lo notificamos en la consola y en la propia web
                console.log("Error en la petición: " + m.status + " " + m.statusText);
                master.innerHTML += '<p>ERROR</p>'
            }
        }
    }

    console.log(caja.value.length);

    //-- La peticion se realia solo si hay al menos 1 carácter
    if (caja.value.length >= 3) {   //-- poner un 3

      //-- Configurar la petición
      m.open("GET","/resultados?param1=" + caja.value, true);

      //-- Enviar la petición!
      m.send();
      
    } else {
        master.innerHTML="";
    }
}
