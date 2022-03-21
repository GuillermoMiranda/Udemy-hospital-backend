//se creo un helper sepradao opar ala lectura del jwt porque lo puedo llmara desde distintos lugarres de la app. Ya se en el login, o para validar un accesos a una ruta privada. se usa el paquete jsonwebtoken

const jwt = require('jsonwebtoken');

const generarJWT = (uid) =>{

    //necesito trnasformar toda esta funcion de generarJWT en un promesa para que espere hasta que este la respuesta, por eso genero una promesa y dentro de esta pongo toda la logica del JWT

    return new Promise( (resolve, reject) => {
        //voy a generar primero el payload que le voy a mandar al jwt cuando se genere. En este caso solo voy a guardar el uid en el payload. Aca podria ir cualquier informacion NO SENSIBLE porque el jwt si se puede revertir y obtener el payload
        const payload = {
            uid
        };

        jwt.sign( payload, process.env.JWT_SECRET, { //como tercer argumento mando las optiones, y por ejemplo puedo definir la duraccion del token.
        expiresIn: '24h'
        }, (err, token)=>{ //El segundo arcgumento (luego de las opciones) es un callback que devuelve un error si llega a ocurrir, o un token en caso que todo haya andado bien
            //si hay error lo muestro en consola y devuelvo el reject de la promesa
            if(err){
                console.log(err)
                reject('No se pudo generar el JWT')
            } else { //si anda bien, mando el resolve con el token
                resolve(token)
            }
        });  
    })
}

module.exports = { generarJWT }