const { response } = require('express')
const Medico = require('../models/medico')

const getMedicos = async(req, res = response)=>{

    
    try {
        
        const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre')
        res.json({
            ok: true,
            medicos
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const crearMedico = async(req, res = response)=>{
   //en el modelo de Medico defini que para el medico necesito el usuario que lo crea. Esta info la mando, al memoento de pasar por el middleware "validar-jwt" y lo estoy mandando en la req. Por eso lo voy a sacar de ahi, para poder pasarlo al medico que estoy creando, porque sino no me va a dejar crear el medico. Es decir, estoy sacando el uid de la persona que se autentico con el token para poder crear un medico, y cuando valido el token extraigo el uid que ahora s elo pasre al hospital
   const uid = req.uid;
    
   //uso el modelo Medico que cree para crear un hospital. a este medico le engo que psar la info del body que es donde desde el frontend me pasan el nombre del medico, el uid del hospital al que se asigna el medico e imagen del medico, pero tambien tengo que pasrle como "usuario" lo que acabo de extraer como uid. Por eso desestructuro lo que le paso, pasndole todos los campos del body y el uid
   const medico = new Medico({
       usuario: uid,
       ...req.body}) //al tener defino el modelo, el mismo modelo va a filtrar todo lo que no necesite y estoy mandando delsde el body, y luego se crea el medico.

   //una vez que ya le pase todos los datos intento crear el medico, por eso lo hago dentro de un trychatch
   try {

       const medicoDB = await medico.save();

       res.json({
           ok: true,
           medico: medicoDB
       })  
   } catch (error) {
       console.log(error)
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       })
   }
}

const actualizarMedico = (req, res = response)=>{
    res.json({
        ok: true,
        msg: ' actualizarMedico'
    })
}

const borrarMedico = (req, res = response)=>{
    res.json({
        ok: true,
        msg: ' borrarMedico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}