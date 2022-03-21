//creo un middleware personalizado para validar un jwt dado que esto lo voy a utilziar en varios lugares de la aplicacion


const jwt = require('jsonwebtoken') //importo el paquete para comparar el jwt que tengo con el que se generaria para mi uid que esta logueado
const { response } = require("express");



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

module.exports = {
    validarJWT
}