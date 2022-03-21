
const bcrypt = require('bcryptjs');
const {response} = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario')

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

module.exports = {
    login
}