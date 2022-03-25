
const bcrypt = require('bcryptjs');
const {response} = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario')
const { googleVerify } =  require('../helpers/google-verify')

const login = async (req, res = response)=>{

    //para hacer el login debo extraer el email y el passsword que me viene en el body

    const {email, password} = req.body;

    //a esta altura, dado que paso las validaciones, sabemos que el email al menos es de formato email.

    try {

        //primerop verificamos de que exista un usuario con un email como el cargado. Por eso compara con el modelo Usuario
        const usuarioDB = await Usuario.findOne({email});

        //si no existe el email, termino el proceso aca
        if( !usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            })
        }

        //ahroa, dado que existe el mail, hay que VERIFICAR CONTRASENIA
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido'
            })
        }

        //en este punto, ya se valido todo, por eso hay que GENERAR UN TOKEN
        const token = await generarJWT( usuarioDB.id) //aca pongo "id", porque mongo va a saber que estoy haciendo referencia al id de ese documento. Como defini el generarJWT como una promesa, le debo poner el await
        
        res.status(200).json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msh: 'Hable con le administrador'
        })
    }
}

const googleSignIn = async(req, res=response)=>{
       
    //en el body vendra el token de google, lo extraigo, porque se lo voy a pasr al helper que creee para que lo verifique.
    const googleToken = req.body.token;

    try {

        //aca llmare la funcion del helper y desestruturare para sacar los datos quye me retorna esa funcion
        const {name, email, picture} = await googleVerify(googleToken);

        //en este punto ya tengo esos datos del usuario que se loguea con google. Entocnes debo verificar si ese usuario ya tiene usuario en la base de datos, vrificando por email
        const usuarioDB = await Usuario.findOne({email})
        let usuario;

        //si ese usuario no existe en la BD, debo crearle un nuevo usuario, que tomara toda la informacion que estyo recibiendo de mi funcion de googleVerify
        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@', //el modelo pide el passord como requerido, por eso debo pasarle algo en la creacion. Igualemtne el usuario no s epodra autenticar con ese password
                img: picture,
                google: true,

            }) 
        } else { //si SI existe el usuairo, igualo el usuario a lo que viene de googlwe, pero ademas marco que la propiedad google es TRUE, porque puede ser que el usuario venga de loguearso con usuario y contrase;a y ahora lo hara mediante google. Y tambien debo definir el password como lo hice cuando cree el usuario con la info de google en el apso anterior, en el IF.
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.password = '@@@' //si hago este cambio, la persona no s epodra autenticar con mail y password, en cambio si no modifico el password le permitie acceder por los 2m metrodos, con mail y passwor dy via google tb.
        
        }

        //ahora ya debo guardar estos cambios en la BD
        await usuario.save()

         //en este punto, ya se valido todo, por eso hay que GENERAR UN TOKEN
         const token = await generarJWT( usuario.id) //aca pongo "id", porque mongo va a saber que estoy haciendo referencia al id de ese documento. Como defini el generarJWT como una promesa, le debo poner el await
        
         
        res.json({
            ok: true,
            msg:'Google SigIn',
            token
        })
    } catch (error) {
        
    }
        res.status(401).json({
                ok: false,
                msg:'Token invalido'
            })
}

//voy a hacer el controlador para hacer el renew del token. En este punto ya tengo el uid del usuario, porque ya tengo un token generado y valiido que se esta por vencer
const renewToken = async(req, res=response)=>{

    const uid = req.uid;

    //en este punto, ya se valido todo, por eso hay que GENERAR UN TOKEN
    const token = await generarJWT( uid ) //aca pongo "id", porque mongo va a saber que estoy haciendo referencia al id de ese documento. Como defini el generarJWT como una promesa, le debo poner el await

    //en este punto, dado que estyo logueado ya tengo un token nuevo. Es decir, desde el BODY mandare un token (que lo necesita el middleware generarJWT) y lo que tendre sera un token nuevo que tendra una fecha de expiracion nueva

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}