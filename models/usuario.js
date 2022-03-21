//estos son modelos de mngoose que define como lucira cada uno de los elemntos generados a partir de este modelo. Se define el Schema de cada elemenot. Con este modelo se evita que se guarden en la BD caracteristicas de un usuario que NO esten definidas en el Schema. Si no estan en el Schema no los mirara la BD,

const { Schema, model} =  require('mongoose')

//define el Schema del Usuario, es decir, que datos y de que tipo tendra cada uno. Que cosas tendra cada usuario?
const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
})

//dado que mongoose manera el ID como _id, lo que se ahace a continuacion es tomar el elemento que genera mongoose, y cambiarle el _id por uid< y sacar el campo __v que tambien es generado automaticamente por mongoose pero que no usaremos. El password tambien lo estyo sacando.
UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object
})


//se genero el Schema, pero ahora hay que implementar el Modelo, que se hace en la importacion, indicando como se llama el modelo y cual es el Schema que usara ese modelo
module.exports = model('Usuario', UsuarioSchema)