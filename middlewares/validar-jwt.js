//creo un middleware personalizado para validar un jwt dado que esto lo voy a utilziar en varios lugares de la aplicacion. 

//Otra cosa que voya validar aca, a partir del jwt es que el usuario tenga el role de ADMIN en aquellos lugares donde sea neceario el mismo, pero esto como otroa funcion distitna al validarJWT


const jwt = require('jsonwebtoken') //importo el paquete para comparar el jwt que tengo con el que se generaria para mi uid que esta logueado
const { response } = require('express');

//importo el modelo de usaurio que sera contra el que validare que el usaurio que estoy analizando tena el role de administrador
const Usuario = require('../models/usuario')



const validarJWT = (req, res = response , next)=>{

    //leer JWT. El JWT lo voy a estar andando en los header
    const token = req.header('x-token');

    if (!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    //si existe un token lo voy a verificar. Siempre usare un try catch
    try {
        //aca verificare el jwt
        const { uid } = jwt.verify(token, process.env.JWT_SECRET) //si puede verificar que el token que le estoy pasadnod es generado con la semilla secreta va a seguir con el codigo, sino salta al CATCH

        //en este punto ya verifique el token y es correcto. 
        //ahora lo que voya  hacer es pasar al controller que siga luego de este middleware el valor del uid que saque el toeken, para que lo pueda usar. es decir, este el el uid del USUARIO QUE HIZO LA PETICION
        req.uid = uid

        //sigo en el siguiente middleware o controller
        next();

        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
        
    }

    
}

//este middleware lo voy a llmar siempre despues del validarJWT, por lo tanto para ese punto yo voy a disponer del uid del usuario, porque viene en la repsuesta del middleware validarJWT
const validarADMIN_ROLE = async(req, res = response, next) =>{

    //aca voy a validar contra el modelo (por eso lo importo) si es usuario tiene el ADMIN_ROLE, caso contrario no lo voy a dejar pasar.

    const uid = req.uid; //en el validarJWT estableci que req.uid es igual al uid del usuario, por eso en la request tengo el dato del uid del ususrio.

    try {

        //primero valido que el uid corres[pponda] a un usuario de la BD.
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }
        //si sigue es porque el usuarios existe, ahora debo preguntar si el ROLE de ese usuario es el de ADMIN_ROLE

        if (usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'no tiene privilegios apra hacer eso'
            })
        }

        //si pasa hasta aca qiuiere decir que es un usuario ADMIN, por lo que puede seguir, por lo que llamo el next()

        next();
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

//este middleware lo voy a llmar siempre despues del validarJWT, por lo tanto para ese punto yo voy a disponer del uid del usuario, porque viene en la repsuesta del middleware validarJWT
const validarADMIN_ROLE_o_MismoUsuario = async(req, res = response, next) =>{

    //aca voy a validar contra el modelo (por eso lo importo) si es usuario tiene el ADMIN_ROLE, caso contrario no lo voy a dejar pasar.

    const uid = req.uid; //en el validarJWT estableci que req.uid es igual al uid del usuario, por eso en la request tengo el dato del uid del ususrio.

    //aca necesito validar si es un usuario que esta queriendo actualizar su propio usuario, y el ID que esta queriendo adctualizar es el que viende en el url, es deir en los params, por lo que voy a necesitar ese valor tambien
    const id = req.params.id;

    try {

        //primero valido que el uid corres[pponda] a un usuario de la BD.
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }
        //si sigue es porque el usuarios existe, ahora debo preguntar si el ROLE de ese usuario es el de ADMIN_ROLE o si el uid es igual al id, es decir, el usaurio que esta logueado quiere modificar su propio usuairo, es decir, cambiar algo de SU profile, por eso agrego el OR,es decir si  es administrador o es SU usuario,  lo dejo pasar y llamo el next.  En caso que NO se cuampla NINGUNA, es decir NO es administrador y NO es SU usuario lo sacara

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id){ 

            //si pasa hasta aca qiuiere decir que es un usuario ADMIN o es su propio usuario, por lo que puede seguir, por lo que llamo el next()

            next();

        } else {

            return res.status(403).json({
                ok: false,
                msg: 'no tiene privilegios apra hacer eso'
            })
        }

       
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE, //este middleware lo voy a llamar por ejemplo en la ruta de actualizar usaurios, de manera que solo puedan hacerlo los usuarios que son ADMIN_ROLE
    validarADMIN_ROLE_o_MismoUsuario //este controla que si es el mismo uid es deicr, es el propio usuario si pueda modificar SU perfil
}