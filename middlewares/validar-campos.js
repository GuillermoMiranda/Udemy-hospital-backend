//este middleware lo que hace es validar los resultados de las validaciones de los campos anteriores o middlewares aplicados antes que este. De esta manera, si viene algun error de algun middleware anterior, no llegara a ejecutarse el controller y me sacara antes.

const { response } =  require('express')
const { validationResult } =  require('express-validator') //este paquete lo uso para tomar los resultados de las validaciones en el middleware y en base a estas dar un respuetsa

const validarCampos = (req, res = response , next)=>{

       //a esta altura ya paso por los middleware, porque lo que cn el paquete validationResultas puedo ver los errores y emitir los mensajes en base a estos
       const errores = validationResult( req ) //le mando el req, que es donde vienen los errores desde los middlewares y me creara un arreglo con todos esos errores.
       //Si hubo errores los devulvto y sino sigo
   
       if (!errores.isEmpty() ){
           return res.status(400).json({
               ok: false,
               errors: errores.mapped()
           })
       }

       next();
}

module.exports = {
    validarCampos
}