/* 
Raiz de esta ruta: /api/usuarios

//aca estaran todas las rutas que tengan que ver con los usuarios

 */
const { Router } = require('express')
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios')
const { check } = require('express-validator')
const { validarCampos } =  require('../middlewares/validar-campos')
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario  } = require('../middlewares/validar-jwt')

//iniciliza la ruta
const router = Router()

//aca como ruta solo se indica el '/' porque sabemos que cada vez que se ingrese a esta ruta la ruta base sera 'api/usuarios', que es lo que esta indicado en el index.js para esta ruta. Tambien importo el controlador que se usara en esa ruta. Valido el JWT con mi middlewware personalizado
router.get('/', validarJWT, getUsuarios );

//aca se hace la creacion de usuarios, para lo cual debo recibir desde el frontend el nombre, passqword y mail dl usuario, por eso debo poder leer el body, por esa razon se implementa en el index.js el express.json(). Como segundo argumento van los middleware que son funciones que se ejecutan y validan cosas antes de que se llame el controller crearUsuario. Con los middlewares verifico que venga toda la informacion que estyo necesitando para poder crear un usuario. Uso el paquete exprress-validator
router.post('/', //url
           [    //middlewares (CLASE 110 )
            check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(), //valido que el campo nombre no este vacio
            check( 'password', 'El password es obligatorio' ).not().isEmpty(),
            check( 'email', 'El email es obligatorio' ).isEmail(), //valido que el campo email sea un email
            validarCampos //ejecuto el middleware personalizado que evalua si hay algun error en los check anteriores y salta si hay algo mal, y sino ejecuta el NEXT para pasar a controllador.

           ],    
        crearUsuario  //controllers
);

//para actualizar un usuario con un put, le debo mandar el id
router.put('/:id', 
        [
            validarJWT, //valido el JWT antes, de manera que si no viene ya salga y no procese nada
            validarADMIN_ROLE_o_MismoUsuario , //valido que tenga roles de ADMIN_ROLE, o que es caso de ser el propio usuario lo deje modificar su propio perfil y no el de otro.
            check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(), //valido que el campo nombre no este vacio
            check( 'email', 'El email es obligatorio' ).isEmail(), //valido que el campo email sea un email
            check( 'role', 'El role es obligatorio' ).not().isEmpty(),
            validarCampos,
            
        
        ],
        actualizarUsuario );

router.delete('/:id', [ validarJWT, validarADMIN_ROLE], borrarUsuario )



module.exports = router