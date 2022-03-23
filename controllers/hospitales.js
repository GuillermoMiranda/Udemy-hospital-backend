const { response } = require('express')
const Hospital = require('../models/hospital')

const getHospitales = async (req, res = response)=>{

    const hospitales = await Hospital.find()
                                    .populate( 'usuario',  'nombre img') //cpn el populate le digo que para el campo "usuario" del hospital (es decir el usuario que creo dicho hospital) me muestre ademas de uid que le estamos pasando al momento de la creacio, me muestre tambien el nombre e img del usuario creador.
    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response)=>{

    //en el modelo de hosptal defini que para el hospital necesito el usuario que lo crea. Esta info la mando, al memoento de pasar por el middleware "validar-jwt" y lo estoy mandando en la req. Por eso lo voy a sacar de ahi, para poder pasarlo al hiospital que estoy creando, porque sino no me va a dejar crear el hospital. Es decir, estoy sanco el uid de la persona que se autentico con el token para poder crear un hospital, y cuando valido el token extraigo el uid que ahora s elo pasre al hospital
    const uid = req.uid;
    
    //uso el modelo Hospital que cree para crear un hospital. a este hospital le engo que psar la info del body que es donde desde el gfrontend me pasan el nombre e imagen del hospital, pero tambien tengo que pasrle como "usuario" lo que acabo de extraer como uid. Por eso desestructuro lo que le paso, pasndole todos los campos del body y el uid
    const hospital = new Hospital({
        usuario: uid,
        ...req.body}) //al tener defino el modelo, el mismo modelo va a filtrar todo lo que no necesite y estoy mandando delsde el body, y luego se crea.

    //una vez que ya le pase todos los datos intento crear el hospital, por eso lo hago dentro de un trychatch
    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })  
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const actualizarHospital = (req, res = response)=>{
    res.json({
        ok: true,
        msg: ' actualizarHospital'
    })
}

const borrarHospital = (req, res = response)=>{
    res.json({
        ok: true,
        msg: ' borrarHospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}