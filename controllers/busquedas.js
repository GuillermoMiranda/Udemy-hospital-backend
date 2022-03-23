//esto lo que hara ser[a realiar una busqueda a partir de una palabra que me mandarn por el url en todas las librerias que tenga en mi BD.


const { response } =  require('express')

const  Usuario  = require('../models/usuario')
const  Medico  = require('../models/medico')
const  Hospital  = require('../models/hospital')

const getTodo = async(req, res = response) =>{

    const busqueda = req.params.busqueda; //aca saco de los params el termino de busqueda que me pasaron

    //para hacer la bsqueda insensible a mayusculas y demas, paso ese termino"busqueda" por ua expresion regular, haciendolo insensible
    const regex = new RegExp( busqueda, 'i'); //mando la constante busqueda y la hago insensible con el 'i'.

    //con esta nueva contante que ya es insenible hago la busqueda en las distintas librerias

    /*   //////////////////////////////  const usuarios = await Usuario.find( {nombre: regex} ) //aca le digo que busque en la libreria Usuarios, por el campo nombre que sea igual a lo que haya en regex

    //idem que con usuarios pero ahora para medicos y hospitales
    const medicos = await Medico.find( {nombre: regex} )
    const hospitales = await Hospital.find( {nombre: regex} ) ///////////////////////// */

    //se hace un promise.all para ejecutar los 3 await que estan comentados de manera simultamnea y no hacerle en serie porque me generaque hasta que no termina uno no empieza el otro

    const [usuarios, medicos, hospitales ] =  await Promise.all([ //voy a esperar (AWAIT) hasta que las promesas incluidas en el promise all se ejecuten todas y tenga los resultados.
        Usuario.find( {nombre: regex} ),
        Medico.find( {nombre: regex} ),
        Hospital.find( {nombre: regex} )
    ])


    try {
        res.status(200).json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        })
    }
}

//ca busco un termino en una dad coleccion
const getDocumentosColeccion = async(req, res = response) =>{

    const tabla = req.params.tabla; //extraigo la tabla o coleccion que me a[psaron en donde tengo que buscar]
    const busqueda = req.params.busqueda; //aca saco de los params el termino de busqueda que me pasaron

    //para hacer la bsqueda insensible a mayusculas y demas, paso ese termino"busqueda" por ua expresion regular, haciendolo insensible
    const regex = new RegExp( busqueda, 'i'); //mando la constante busqueda y la hago insensible con el 'i'.

    //una vez que tengo la coleccion y el termino de busqueda debo ir viendo cual es la coleccion para ir haciendo las distintas rutas

    //creo un arreglo data que tendra las resultas para cada caso, y sera lo que devolvere luego de este switch

    let data = []

    switch (tabla) {
        case 'medicos':
             data = await Medico.find({nombre: regex})//se puede hacer el populate si queremos
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')
        break;
        
        case 'hospitales':
            data = await Hospital.find({nombre: regex})
                                 .populate('usuario', 'nombre img')
        break;
        
        case 'usuarios':
            data = await Usuario.find({nombre: regex});

            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'no existe la coleccion buscada'
            })
    }

    //aca devuelvo la data, si es que no salto el default 
    res.json({
        ok: true,
        resultados: data
    })

    
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}