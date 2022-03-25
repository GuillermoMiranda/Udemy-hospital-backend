/* 
Raiz de esta ruta: /api/login

//aca estaran todas las rutas que tengan que ver con el loguin de los usuarios

 */
const { Router } = require('express');
const { check } = require('express-validator');
const{ login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

//iniciliza la ruta
const router = Router();

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos

    ],
    login)

router.post('/google', [
        check('token', 'El token de Google es obligatorio').not().isEmpty(),
    googleSignIn

    ],
    login)

module.exports = router ;