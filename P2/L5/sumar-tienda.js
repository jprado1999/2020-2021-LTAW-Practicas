//-- Lectura y modificación de un fichero JSON
const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda-out.json"

//-- NOmbre del fichero JSON de salida
const FICHERO_JSON_OUT = "tienda-out.json"

//-- Leer el fichero JSON
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Modificar la cantidad de stock de cada producto
tienda.productos.forEach((element) => {
    element["stock"] = element["stock"] + 1;
});

//-- Cantidad y listado de productos en la tienda
console.log("Hay " + tienda.productos.length + " tipos de producto en mi tienda \n");
console.log("Productos de la tienda: \n");
tienda.productos.forEach((element,index)=>{
    console.log("Producto " + (index + 1) + ": " + element["tipo"]);
    console.log("Hay " + element["stock"] + " unidades en stock de este producto \n");
});

//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);