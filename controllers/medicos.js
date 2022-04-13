const { response } = require('express');
const { IdTokenClient } = require('google-auth-library');
const Medico = require('../models/medico')

const getMedicoById = async(req, res = response)=>{

    //tengo que sacar el id del medico que quiero obtener, del url
    const id = req.params.id;

    try {
        
        const medico = await Medico.findById(id)
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre')
        res.json({
            ok: true,
            medico
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

//controller para obtener el listado de medicos
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

const actualizarMedico = async(req, res = response)=>{
   
    //tengo que sacar el id del medico que quiero modificare, del url
    const id = req.params.id;

    //voy a sacar el uid del usuario que esta tratando de modificar los datos del medico, para guardar en la BD cual fue el usuario que reliza esta modificacion
    const uid =  req.uid; //este uid lo tengo porque pasamos por la autenticacion del JWT (como middleware) y de ahi lo estyo trayendo.

    try {
        //lo pirmero quye debo hacer es verificar si existe un medico con ese id
        const medico = await Medico.findById(id);

        //si no existe el medico muestro un error
        if(!medico){
            return res.status(404).json({
                    ok: false,
                    msg: ' No existe un medico con ese ID',
                    id
                 })
        }

        //si existe el ID tya estaria listo para actualizar el nombre del medico. Ese nombre (o cualquier combio que quiera realizar) viene el el body de la request, por eso saco esos campos del body, y adem[as el uid del usuario que quier hacer los cambios. Todo esto lo cuando en una variable, que sere la que le pasr[e al hospital para que actualice
        const cambiosMedico = {
            ...req.body,
            usuario: uid //estyo sacando los campos del body, y grabando en usuario (campo que esta en el modelo del medico cmo la persona que realiza el cambio). Todos estos campos se los pasare al Hospital y los actualizare
        }

        //actualico medico
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true} ); /* //le paso el id para que lo encuentre y los cambiosMedico para que actualice los campos que vengan en esa variable (lo que no vienen no se actualizara y quedara como esta), que puede ser solo 1 o varios. De esta manera preparo la opcion para cambiar varios campos, y no solo el nombre. Con el tercer parametro {new:true} solo le estoy diciendod que me devuelva el registro ya actualizado en el postaman. */
        

    res.json({
        ok: true,
        medico: medicoActualizado
    })    

    } catch (error) {
        console.log('El error es este', error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
    
}

const borrarMedico = async(req, res = response)=>{
    //tengo que sacar el id del medico que quiero borrar, del url
    const id = req.params.id;

    
    try {
        //lo pirmero quye debo hacer es verificar si existe un medico con ese id
        const medico = await Medico.findById(id);

        //si no existe el medico muestro un error
        if(!medico){
            return res.status(404).json({
                    ok: false,
                    msg: ' No existe un medico con ese ID',
                    id
                 })
        }

    await Medico.findByIdAndDelete(id)
        

    res.json({
        ok: true,
        msg: 'Medico eliminado'
    })    

    } catch (error) {
        console.log('El error es este', error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}