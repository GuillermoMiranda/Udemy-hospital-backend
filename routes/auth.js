/* 
Raiz de esta ruta: /api/login

//aca estaran todas las rutas que tengan que ver con el loguin de los usuarios

 */
const { Router } = require('express');
const { check } = require('express-validator');
const{ login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

//iniciliza la ruta
const router = Router();

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos

    ],
    login)








module.exports = router ;