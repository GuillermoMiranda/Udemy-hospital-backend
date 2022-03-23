//estos son modelos de mngoose que define como lucira cada uno de los elemntos generados a partir de este modelo. Se define el Schema de cada elemenot. Con este modelo se evita que se guarden en la BD caracteristicas de un usuario que NO esten definidas en el Schema. Si no estan en el Schema no los mirara la BD,

const { Schema, model} =  require('mongoose')

//define el Schema del Medico, es decir, que datos y de que tipo tendra cada uno. Que cosas tendra cada medico?
const MedicoSchema = Schema({

    nombre: {
        type: String,
        required: true

    },
    img: {
        type: String,
    },
    //quiero guardar tb cual es el usuario que genero el medico. Este sera un tipo de datos particular, que le indicara a Mongoose que vaa haber una relacion entre este Schema de Medico con el Schema que definido en la propeidad ref, que es el Schema de Usuario
    usuario: {
        reruired: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
}) 

//dlo que se ahace a continuacion es tomar el elemento que genera mongoose,y sacar el campo __v que  es generado automaticamente por mongoose pero que no usaremos. 
MedicoSchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject();
    return object
})


//se genero el Schema, pero ahora hay que implementar el Modelo, que se hace en la importacion, indicando como se llama el modelo y cual es el Schema que usara ese modelo
module.exports = model('Medico', MedicoSchema)