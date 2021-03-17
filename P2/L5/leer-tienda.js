//-- Crear una variable con la estructura definida
//-- en un fichero JSON

const fs = require('fs');

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Numero de usuarios registrados en la tienda
console.log("Numero de usuarios registrados actualmente: " + tienda.usuarios.length + "\n");

//-- Listado con los usuarios de la tienda
tienda.usuarios.forEach((element,index)=>{
    console.log("Usuario " + (index + 1) + ": " + element["nombre"]);
    console.log("Es un usuario de tipo: " + element["login"]);
    console.log("")
});

//-- Cantidad y listado de productos en la tienda
console.log("Hay " + tienda.productos.length + " tipos de producto en mi tienda \n");
console.log("Productos de la tienda: \n");
tienda.productos.forEach((element,index)=>{
    console.log("Producto " + (index + 1) + ": " + element["tipo"]);
    console.log("Hay " + element["stock"] + " unidades en stock de este producto \n");
});

//-- Numero de pedidos pendientes y detalles de los mismos
console.log("Hay " + tienda.pedidos.length + " pedido/s pendientes \n");
tienda.pedidos.forEach((element,index)=>{
    console.log("Numero de pedido: " + element["numero de pedido"] + "\n");
    console.log("Detalles del pedido: ");
    element["productos"].forEach((element,index)=> {
        console.log("Tipo de producto: " + element.tipo + ". Cantidad: " + element.cantidad);
        console.log("");
    });

});