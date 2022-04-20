//CONFIGURACION DE LAS VARIABLES DE ENTORNO EN EL ARCHIVO ".env"
require('dotenv').config(); //esta leyendo las variables de entorno, y por defecto esta buscando un archivo ".env" y lo establece en las variables de entorno de NODE

//esto lo importo para resovler el problemas d elas rutas cuando apso la app a produccion. ver luego de las rutas (CLASE 253)
const path = require('path')

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

//directorio publico. Esto sera la parte publica de mi aplicacion. Aca defino o indico cual es la carpeta que sera publica
app.use(express.static('public'));


//lectura y parseo del body . ESTO TIENE QUE COLOCARSE ANTES DE LAS RUTAS PORQUE SINO NO PODRIA LELER NADA SI LO PINGO DESPUES.
app.use(express.json())

//rutas (hace referencia a las rutas definidas en routes/xxxx.js)
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/hospitales', require('./routes/hospitales'))
app.use('/api/medicos', require('./routes/medicos'))
app.use('/api/login', require('./routes/auth'))
app.use('/api/todo', require('./routes/busquedas'))
app.use('/api/upload', require('./routes/uploads'))

//lo ultimo. esto se hace porque cuando paso la app a produccion, es decir genere al carpeta dist en angular, copie todo eso a la carpeta public del backend en node y lo subi a heroku, tengo problemas con la app de la web porque cuando actualizo la pagina Angular pierde el control de las rutas, entonces tengo que especificar lo siguiente. Aca le estoy diciendo que cualquier otra ruta que no este defuinida aca arriba pasara por aca...(importe el path) (clase 253) aCA LE INDICO QUE CUALUIER RUTA NO DEFINIDA PROVOQUE QUE SE EJECUTE EL ARCHIVO DE ANGULAR, QUE POR ESO LE CREO EL PATH HASTA EL ARCHIVO INDEX QUE COPIE DE ANGULAR (DE LA CARPETA DIST) A LA CARPETA PUBLIC DE ACA (EL BACKEND)
app.get('*', (req, res)=> {
    res.sendFile( path.resolve(__dirname, 'public/index.html'))
})

//levantar servidor. Uso la varible de entorno PORT
app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto '+ process.env.PORT)
})