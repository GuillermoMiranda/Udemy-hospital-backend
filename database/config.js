//aca hare la configuracion de moongse para la conexion con la DB

//importo el paquete
const mongoose = require('mongoose');

//creare una funcion pra que cada vez que la llame establezca la coneixion
const dbConnection = async ()=>{

    //dentro de la funcion voy a hacer un try y catch porque como es conexion a bd puede fallar (CLASE 97)
    try {
        mongoose.connect( process.env.DB_CNN  ); //conecto usando la variable de entorno que tiene la cadna de conexion completa

        console.log('DB online');

    } catch (error) {
        console.log(error)
        throw new Error('Error al inicializar la BD, ver logs')
    }
    
}

module.exports = { //exporto la funcion que me hace la conexion a la BD, que lo voy a requerir desde el idex.js
    dbConnection
}