const path = require('path')
const fs = require('fs')
const { response } = require('express')
const { v4: uuidv4 } = require('uuid'); //se imprta porque instale el paquete uuid para genrara el nombre de los archivos que guardare en el servidor.
const { actualizarImagen } = require('../helpers/actualziar-imagen');

const fileUpload = (req, res = response)=>{

    const tipo = req.params.tipo; //aca extraigo del url lo que viene como tipo, para luego mverificar ques sea medicos, usuarios u hospitales
    const id = req.params.id //idem con el id

    //validamos que el tipo que me estan pasando es valido
    const tiposValidos = ['usuarios', 'medicos', 'hospitales']
    if (!tiposValidos.includes(tipo)){ //si el tipo que me pasan no es los que tenemos definidos retorno un msj de error.
        return res.status(400).json({
            ok: false,
            msg: 'El tipo debe ser usuarios, medicos u hospitales'
        })
    }

    //en este punto ya podemos subir el archivo porque tenemos importado el paquete expressUploadFile. De la documentacion viene lo siguiente, para verificar si me han pasado un archivo que viene en el body
    if (!req.files || Object.keys(req.files).length === 0) { //revisa que venga algun archivo del frontend
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        })
    }

    //ya hecha las validaciones, ahora ya puedo procesar las imagenes para luego ejecutar la subida correspondiente al servidor.

    const file = req.files.imagen;// en el req.files.imagen hago referencia al nombre que le hayamos dado al campo en el que se sube el archivo en el body de la peticion. tengo acceso a los files gracias al middleware expressFileUpload que establecimos en la ruta

    //como paso siguiente voy a extraer la extension del archivo, considerando que en el nombre puede haber "." mas alla del que separa nombre de extension, por eso debo extraer la extension haciendo un manejo del archivo
    const nombreCortado = file.name.split(".") //separo en un arreglo por los "."
    const extensionArchivo = nombreCortado[nombreCortado.length - 1] //tomo la ultima posiicon del arreglo

    //Validar extension de los archivo, para ver si es de las que voy a permitir
    const extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension valida'
        })
    }

    //Generar el nombre del archivo. tengo que asegurarme que el nombre del archivo sea unico, por eso razon se usa el paquete UUID, de manera de ue nunca tenga dos archivos que se guarden con el mismo nombre.
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`

    //ahora debo crear el path en dnde se guardara la imagen, y dependera de que tipo (usuarios, medicos u hospitales) sea.
    const path = `./uploads/${tipo}/${nombreArchivo}` //cree una carpeta en la raiz que se llama "uploads" y dentro de esta cree una carpeta por cada tipo de libreria (medicos, usuarios, hospitales)

    //ahora ya tengo el path y debo mavoer la imagen (file) a use path
    file.mv(path, (err)=> { //le paso el path, y si hay un error ejecuta la funcion de fleca definida, es decir, ese callback
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'error al mover la imagen'
            })
        }
        //en este punto estoy en condiciones de actualizar la base de datos, es decir, asignar esa imaghen subida al hospital, usuario o medico (tipo) que se corresponda al id que me pasaron. esta parte del codigo se hara uen un helper llamado actualizarImagen que sera llamado aca. Le paso varioas argumentos a la funcion del helper.
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo movido',
            nombreArchivo
        })
  });
}

const retornaImagen = (req, res = response)=>{

    const tipo = req.params.tipo; //aca extraigo del url lo que viene como tipo, para luego mverificar ques sea medicos, usuarios u hospitales
    const foto = req.params.foto; //aca extraigo del url lo que viene como foto, que viene con su nombre completo

    //ahora debo obtener el path competo en donde se va a encontrar la foto que quiero retornar. Para eso uso un paquete llamado path que ya viene en node. Lo importo arriba
    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`) //le estoy pasando el path completo

    //si ese pathImg no es correcto o no existe ninguna imagen voy a definir una por defecto que me mostrara. Para preguntar por un path debo usar el paquete fs de node.
    if ( fs.existsSync(pathImg)){
        //ahora tengo que pedir que me responda pero con la iamgen y no con el json
        res.sendFile(pathImg) //hago el sendFile y le paso el path completo que acabo de generar. Esto en postman me retornara la imagen y no un json.
    } else { //si no existe ese path, debo mandar la imagne por defecto que tengo guardada en la raiz, por eso genero ese path y lo mando como respuesta.
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`)
        res.sendFile(pathImg)
    }

    
}

module.exports = {
    fileUpload,
    retornaImagen
}