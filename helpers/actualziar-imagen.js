const  Usuario  = require('../models/usuario')
const  Medico  = require('../models/medico')
const  Hospital  = require('../models/hospital')

const fs = require('fs')

//como dependiendo del caso segun el tipo hago en los 3 casos el borrardo de imagen y el codigo es igual, voy a crear una funcion que la llamare en cada caso para no reptir tanto codigo.
const borrarImagen = (path) =>{
       //para verificar si ese pathViejo existe, uso el paquete fs (filesystem)que trae node
       if( fs.existsSync(path)){ //pregunto si existe algo en ese pathViejo
        fs.unlinkSync(path) //si existe lo borro la iamgen con el unlinkSync
    }   
}

const actualizarImagen = async (tipo, id, nombreArchivo)=>{

    let pathViejo = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id) //busco un medico por ese id
            if (!medico){
                console.log('no existe un medico con ese id')
                return false
            }
            //si existe un medico con ese id tengo que verificar primero si ese medico ya tiene una foto, y de ser asi borrarla para luego guardar esta nueva.
            pathViejo = `./uploads/medicos/${medico.img}`;
          
            borrarImagen(pathViejo)

            //si no existe la iamgen o ya la borro se llega a este punto, debo asignar al medico esa imagen nueva
            medico.img = nombreArchivo;

            //grabo el medico, y por lo tanto le estoy poniendo como dato de img el path a esa imgen que acabo de guardar.
            await medico.save();
            //si hace todo correctamente, retorna true
            return true;

        break;
        
        case 'hospitales': //se repite lo mismo que los medicos
            const hospital = await Hospital.findById(id) 
            if (!hospital){
                console.log('no existe un hospital con ese id')
                return false
            }
            pathViejo = `./uploads/hospitales/${hospital.img}`;
            
            borrarImagen(pathViejo)
            
            hospital.img = nombreArchivo;

            await hospital.save();
            return true;

        break;

        case 'usuarios': //se repite lo mismo que los medicos
            const usuario = await Usuario.findById(id) 
            if (!usuario){
                console.log('no existe un usuario con ese id')
                return false
            }
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            
            borrarImagen(pathViejo)
            
            usuario.img = nombreArchivo;

            await usuario.save();
            return true;

        break;
    
        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}