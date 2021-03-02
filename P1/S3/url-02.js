//-- Construir un objeto URL
const myURL = new URL('https://miTienda.com:8080/home/product=1?edition=bluray&type=steelbook#precio');


//-- Imprimir la información de la URL
console.log("  * URL completa (href): " + myURL.href)
console.log("  * Origen: " + myURL.origin);
console.log("    * Protocolo: " + myURL.protocol);
console.log("    * host: " + myURL.hostname);
console.log("    * port: " + myURL.port);
console.log("  * Ruta: " + myURL.pathname);
console.log("  * Busqueda: " + myURL.search);

//-- Recorrer todas las búsquedas
myURL.searchParams.forEach((value, name)=>{
  console.log("      * Parametro: " + name + " = " + value);
});

//-- Imprimir directamente los valores de los parametros
console.log("    * Artículo: " + myURL.searchParams.get('edition'));
console.log("    * Tipo: " + myURL.searchParams.get('type'));
console.log("    * Otro: " + myURL.searchParams.get('otro'));

//-- Ultima parte: Fragmento
console.log("  * Fragmento: " + myURL.hash);