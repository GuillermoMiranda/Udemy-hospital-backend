//este helper se usa para no poner odo el codigo que toma el token de google y extrae toda la informacion en el controller que se creo para la ruta de login/google

//importo el paquete / esto sale del tutorial d3e google/ "https://developers.google.com/identity/sign-in/web/backend-auth" 
const {OAuth2Client} = require('google-auth-library');

//donde decia CLIENTE_ID lo reemplazo por el GOOGLE?ID que se me genero cuando cree las credenciales .
const client = new OAuth2Client(process.env.GOOGLE_ID);

//esta funcion verifica el token, por eso debo recibier el token cmo argumento de la funcion
const googleVerify = async (token)=> {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  console.log(payload)

  ///el payload del token de google trae mucha informacion. Yo de ahi solo necesityo algunos datos, por eso hago la desestructuracion y saco los datos que me interesan para hacer el login de mi aplicacion y lo retorno

  const {name, email, picture} = payload

  return {name, email, picture}

}

module.exports = {
    googleVerify
}