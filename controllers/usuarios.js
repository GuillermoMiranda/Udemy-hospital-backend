/* 
aca estara guardada la logica que se utilizara para cada ruta que tenga que ver con los usuarios

 */

//importo el modelo para crear usaurios, por eso se pone en MAYUSCULAS

const Usuario = require ('../models/usuario')
const { response } =  require('express') //esta importacion se hace para igualar el res = respondse para que visual studio me ponga las opciones disponibles para res, dado que sabe que es de ese tipo si lo igualo en los parametros.

//se instala el paquete para que al momento de crear un usuario la contrase;a se guarde encriptada y no como un texto plano
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//esta funcion getUsuarios es llamada desde la ruta que hace el GET a los usuarios.
const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google '); //aca le estoy diciendo que me traiga todos los usuarios, porque no estoy definiendo el primer paramatero para el find. Como segundo parametro definido cuales son los campos que quiero que me traiga Como debe ir a la BD, debe ser con un await.
    res.json({
        ok: true,
        users: usuarios,
        //uid: req.uid //aca extraigo del req el uid. Esto viene de middleare persoalizado (validar-jwt) que estoy corriendo en la ruta de getusuario, ya que lo mando como dato. Este seria el UID del usuario que hizo la peticion.
    });
} 

//en el req viene lo que me manda el usuario en el body por medio del frontend
const crearUsuario = async (req, res = response) => {

    //extraigo del body la info que me manda el usuario
    const { password, email } = req.body;
 
    try {

        //voy a valirdar que el email ya no exista en la bd
        const existeEmail = await Usuario.findOne( {email})

        //si ya existe un usuario con ese email voy a devolver un mensaje con el mensaje de error, y sino sigo con la creacion del usuario

        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            }); 
        }

        //aca ya tengo los datos del body, por lo que ahora usando el model voy a crear un usuario en la bse de datos.
        const usuario = new Usuario( req.body) //en usuario ya tengo una instancia de mi modelo que tiene todos esas propiedades que me pasaron desde el frontend

        //antes de grabar en la base de datos, voy a encriptar la contrasenia.
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt)

        //en este punto, ya se valido todo, por eso hay que GENERAR UN TOKEN
        const token = await generarJWT( usuario.id) //aca pongo "id", porque mongo va a saber que estoy haciendo referencia al id de ese documento. Como defini el generarJWT como una promesa, le debo poner el await 

        //ahora solo me queda grabar esto en la base de datos. Como ese grabado no e sinmediato debo hacer un await para hacerlo antes de continuar.
        await usuario.save();

        res.json({
            ok: true,
            user: usuario,
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. revisar logs'
        })
    }
    
} 

//esta funcion actualizarUsuario es llamada desde la ruta que hace el PUT a los usuarios.
const actualizarUsuario = async (req, res = response) => {

    //tengo que sacar el uid de lo que me carga el usuario para saber cual es el usuario que hay que actualizar
    const uid = req.params.id;
    

    try {
        //con el uid que sacamos de la info que nos cargan se va a verificar si existe en la BD
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese ID'
            });
        }

        //llegado a este punto ya se pueden realizar las actualizaciones de los campos que quiera permitir que se actualicen. No voy a ermitir que se actualicen el password y el google
        const {password, google, email,  ...campos} = req.body; //No voy a ermitir que se actualicen el password y el google. Esta info viene porque es parte del modelo de mongoose, pero no la quiero mandar para que no se aposible modificarla. estos siempre se elimina de los datos que paso al backend. por eso desestructuro y saco esos 2 campos que no voy a usar. Tambien saco el email que es sobre el que validare que no existra en el siguietne paso.

        //para que no me quierean actualizarr un email que ya existe, lo primero que verifico es si el usuario esta intentando actualizar el email, si no es asi, borro el email de los datos que pasa.

        if ( usuarioDB.email !== email ) {
            //si el email que me estan pasando en el req no es igual al email que tiene el usuairo en la BD, quiere decir que el usuario esta queriendo cambiar su email. Por eso debo verificar que ese email no existe ya en la BD
            const existeEmail = await Usuario.findOne( {email: email});
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }
        //debo aniadir el email a los campos, dado que si lo quieren modificar y paso la validacion anterior si debe viajar al backend
        campos.email = email;
        //ahora le paso todos los campos que se podrian actualizar en donde no estaran ni google ni password
        const usuarioActualizado =  await Usuario.findByIdAndUpdate( uid, campos, {new: true}) //como primer parametro se pasa el id del usuariop que quiero actualizar y como segundo parametro elos campos que quiero actualizar, que es de donde saque el password y el google.

        res.json({
            ok: true,    
            user: usuarioActualizado    
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

       
} 

const borrarUsuario = async(req, res = response)=>{
    //tengo que sacar el uid de lo que me carga el usuario para saber cual es el usuario que hay que borrar
const uid = req.params.id;

try {

    //con el uid que sacamos de la info que nos cargan se va a verificar si existe en la BD
    const usuarioDB = await Usuario.findById( uid );

    if (!usuarioDB ){
        return res.status(404).json({
            ok: false,
            msg: 'No existe un usuario con ese ID'
        });
    }

    //si existe el uid, elimino el usuairo y mando el msj
    await Usuario.findByIdAndDelete( uid);

   res.status(200).json({
       ok: true,
       msg: 'Usuairo eliminado'
   })
   
} catch (error) {
   console.log(error)
   res.status(500).json({
       ok: false,
       msg: 'Oucrrio un error inesperado'
   })
   
}

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}