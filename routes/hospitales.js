/* 
Raiz de esta ruta: /api/hospitales

//aca estaran todas las rutas que tengan que ver con los hospitales

 */
const { Router } = require('express')

const { check } = require('express-validator')
const { crearHospital, actualizarHospital, borrarHospital, getHospitales } = require('../controllers/hospitales')
const { validarCampos } =  require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

//iniciliza la ruta
const router = Router()

//aca como ruta solo se indica el '/' porque sabemos que cada vez que se ingrese a esta ruta la ruta base sera 'api/hospitales', que es lo que esta indicado en el index.js para esta ruta. Tambien importo el controlador que se usara en esa ruta. Valido el JWT con mi middlewware personalizado
router.get('/',validarJWT, getHospitales );

//aca se hace la creacion de hopsitales, para lo cual debo recibir desde el frontend el nombre, por eso debo poder leer el body, por esa razon se implementa en el index.js el express.json(). Como segundo argumento van los middleware que son funciones que se ejecutan y validan cosas antes de que se llame el controller crearHopsital. Con los middlewares verifico que venga toda la informacion que estyo necesitando para poder crear un hospital. Uso el paquete exprress-validator
router.post('/', //url
           [
                validarJWT,
                check('nombre', 'El nombre del Hospital es obligatorio').not().isEmpty(),
                validarCampos //valir campo valida todos los check que haya puesto y muestra los errores encaso que hubiese
           ],    
        crearHospital  //controllers
);

//para actualizar un usuario con un put, le debo mandar el id
router.put('/:id', 
        [
        validarJWT,
        check('nombre', 'El nombre del Hospital es obligatorio').not().isEmpty(),
        validarCampos //valir campo valida todos los check que haya puesto y muestra los errores encaso que hubiese
        ],
        actualizarHospital );

router.delete('/:id',
        validarJWT,
        borrarHospital )



module.exports = router