/* 
Raiz de esta ruta: /api/medicos

//aca estaran todas las rutas que tengan que ver con los medicos

 */
const { Router } = require('express')

const { check } = require('express-validator')
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos')

const { validarCampos } =  require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

//iniciliza la ruta
const router = Router()

//aca como ruta solo se indica el '/' porque sabemos que cada vez que se ingrese a esta ruta la ruta base sera 'api/medicos', que es lo que esta indicado en el index.js para esta ruta. Tambien importo el controlador que se usara en esa ruta. Valido el JWT con mi middlewware personalizado
router.get('/',validarJWT, getMedicos );

//aca se hace la creacion de medicos, para lo cual debo recibir desde el frontend el nombre, por eso debo poder leer el body, por esa razon se implementa en el index.js el express.json(). Como segundo argumento van los middleware que son funciones que se ejecutan y validan cosas antes de que se llame el controller crearMedico. Con los middlewares verifico que venga toda la informacion que estyo necesitando para poder crear un medico. Uso el paquete exprress-validator
router.post('/', //url
           [
                validarJWT, //aca se extrae el uid del usuario logueado
                check('nombre', 'El nombre del Medico es obligatorio').not().isEmpty(),
                check('hospital', 'El ID del hospital debe ser valido').isMongoId(), //para crear un medico debo pasarle a que hospital se asigna, por eso debo validar que ese hospital que me van a pasr en el body sea in ID valido de mongo, y no me esten pasando cualquier cosa.
                validarCampos //valir campo valida todos los check que haya puesto y muestra los errores encaso que hubiese
           ],    
        crearMedico  //controllers
);

//para actualizar un medico con un put, le debo mandar el id
router.put('/:id', 
        [
                validarJWT,
                check('nombre', 'El nombre del Medico es obligatorio').not().isEmpty(),
                check('hospital', 'El ID del hospital debe ser valido').isMongoId(), 
                validarCampos //valir campo valida todos los check que haya puesto y muestra los errores encaso que hubiese 
        ],
        actualizarMedico );

router.delete('/:id', 
                validarJWT,
                borrarMedico )



module.exports = router