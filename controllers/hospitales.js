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

const actualizarHospital = async (req, res = response)=>{
    
    //tengo que sacar el id del hospital que quiero modificarle el nombre, del url
    const id = req.params.id;

    //voy a sacar el uid del usuario que esta tratando de modificar los datos del hospital, para guardar en la BD cual fue el usuario que reliza esta modificacion
    const uid =  req.uid; //este uid lo tengo porque pasamos por la autenticacion del JWT (como middleware) y de ahi lo estyo trayendo.

    try {
        //lo pirmero quye debo hacer es verificar si existe un hospital con ese id
        const hospital = await Hospital.findById(id);

        //si no existe el hospital muestro un error
        if(!hospital){
            return res.status(404).json({
                    ok: false,
                    msg: ' No existe un hospital con ese ID',
                    id
                 })
        }

        //si existe el ID tya estaria listo para actualizar el nombre del hospital. Ese nombre (o cualquier combio que quiera realizar) viene el el body de la request, por eso saco esos campos del body, y adem[as el uid del usuario que quier hacer los cambios. Todo esto lo cuando en una variable, que sere la que le pasr[e al hospital para que actualice
        const cambiosHospital = {
            ...req.body,
            usuario: uid //estyo sacando los campos del body, y grabando en usuario (campo que esta en el modelo del Hospital cmo la persona que realiza el cambio). Todos estos campos se los pasare al Hospital y los actualizare
        }

        //actualico hspital
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true} ); /* //le paso el id para que lo encuentre y los cambiosHospital para que actualice los campos que vengan en esa variable (lo que no vienen no se actualizara y quedara como esta), que puede ser solo 1 o varios. De esta manera preparo la opcion para cambiar varios campos, y no solo el nombre. Con el tercer parametro {new:true} solo le estoy diciendod que me devuelva el registro ya actualizado en el postaman. */
        

    res.json({
        ok: true,
        hospital: hospitalActualizado
    })    

    } catch (error) {
        console.log('El error es este', error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
    
    
    
}

const borrarHospital = async (req, res = response)=>{
   //tengo que sacar el id del hospital que quiero modificarle el nombre, del url
   const id = req.params.id;

   //voy a sacar el uid del usuario que esta tratando de modificar los datos del hospital, para guardar en la BD cual fue el usuario que reliza esta modificacion
   
   try {
       //lo pirmero quye debo hacer es verificar si existe un hospital con ese id
       const hospital = await Hospital.findById(id);

       //si no existe el hospital muestro un error
       if(!hospital){
           return res.status(404).json({
                   ok: false,
                   msg: ' No existe un hospital con ese ID',
                   id
                })
       }

       //borro el hospitakl
       await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}