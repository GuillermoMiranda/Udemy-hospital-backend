/* 
Raiz de esta ruta: /api/uploads

//aca estaran todas las rutas que tengan que ver con la subida de archivos, dependiendede la coleccion

 */
const { Router } = require('express');
const expressFileUpload = require('express-fileupload'); //se instalo el paquete express/fileupload y se lo importa en la ruta

const { fileUpload, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

//iniciliza la ruta
const router = Router();

//despues de iniciliazar la ruta llamo el expressFileUpload
router.use( expressFileUpload()) 

router.put('/:tipo/:id',validarJWT, fileUpload) //"tabla" representa la coleccion en la que quiero carga el archivo, y el id el id del elemento al que le quiero actualizar laimagen o archivo

//recuperar imagen
router.get('/:tipo/:foto', retornaImagen) 

module.exports = router;