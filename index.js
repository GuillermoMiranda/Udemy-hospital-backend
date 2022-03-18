//CONFIGURACION DE LAS VARIABLES DE ENTORNO EN EL ARCHIVO ".env"
require('dotenv').config(); //esta leyendo las variables de entorno, y por defecto esta buscando un archivo ".env" y lo establece en las variables de entorno de NODE

//Express
const express = require('express');
//CORS
const cors = require('cors')

//conexion de la BD
const { dbConnection } = require('./database/config'); //imporot para la coneccion ala BD

//crear el servidor de express
const app = express();

//configurar cors. cors se utiliza para que mi servidor acepte peticiones dede diferente dominios
app.use(cors());

//hago la conexion a la BD, ejecuntando la funcion
dbConnection()



//rutas
app.get( '/', (req, res)=>{
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    });
})


//levantar servidor. Uso la varible de entorno PORT
app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto '+ process.env.PORT)
})