/* 
Raiz de esta ruta: /api/todo

//aca estaran todas las rutas que tengan que ver con las busquedas que voy a hacer en todas las colecciones que tenga. es decir, pongo una palabra y buscara en todas las bases

 */
const { Router } = require('express');
const{ getTodo, getDocumentosColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

//iniciliza la ruta
const router = Router();

//en esta ruta voy a buscar por el termino "busqueda" en todas las colecciones que tenga definidas en el cotnrolar "getTodo"
router.get('/:busqueda',validarJWT, getTodo)

//esta segunda ruta lo que hace es buscar en un coleccion particular el termino que le indiquemos
router.get('/coleccion/:tabla/:busqueda',validarJWT, getDocumentosColeccion) //"tabla" representa la coleccion en la que quiero buscar el termino "busqueda"

module.exports = router;