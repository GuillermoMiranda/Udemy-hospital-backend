//este helper lo uso para generar el menu del sidebar que esta en el frontend desde el backend. Dependera del rol del usuario por ejemplo para mostrar ciertas parte de ese menu

const getMenuFrontEnd = (role = 'USER_ROLE') =>{ //defno valor pro defecto

    const menu =  [
        {
          Titulo: 'Principal!!!',
          Icono: 'mdi mdi-gauge',
          Submenu: [
            { Titulo: 'Main', url: '/' },
            { Titulo: 'ProgressBar', url: 'progress' },
            { Titulo: 'Graficas', url: 'grafica1' },
            { Titulo: 'Promesas', url: 'promesas' },
            { Titulo: 'Rxjs', url: 'rxjs' },
          ]
        },
    
        {
          Titulo: 'Mantenimientos',
          Icono: 'mdi mdi-folder-lock-open',
          Submenu: [
            //{ Titulo: 'Usuarios', url: 'usuarios' },
            { Titulo: 'Hospitales', url: 'hospitales' },
            { Titulo: 'Medicos', url: 'medicos' },
            
          ]
        }
      ];
    
    if (role === 'ADMIN_ROLE'){
        menu[1].Submenu.unshift( { Titulo: 'Usuarios', url: 'usuarios' })
    } //aca le estyo diciendo que si el role es de administador, agregue en la segunda posbicion del menu, y luego como primera posuicion de esa segunda posicion (Submenu) agregue lo que le estoy pasando dentro del unshift. (esto lo hago para poner condicional al role lo que tenga que ver con los mantenimietnos de los usaurios, que en el objeto menu NO lo estyo apsando
    
    return menu; //este menu lo estyo rotornando, entonces tengo que ver donde seria que este menu deberia ser enviado, y esos puntos tienen que ver con elmommento en que el usuario ingresa a la APP. Es decir, al momento de la autenticacion, por lo que debo agregarlo al momento de que se crea el usautrio, del momento en que se loguea el usuario o al momento en que se hace un renew del token. ES DECIR EN TODOS LOS LUHGARES EN DONDE SE REGRTESA EL TOKEN SE DDEBE REGRESAR ESTE MENU. Si voy a las rutas, veo que los controladores son el "login", "googleSignIn" y en "renewToken", y tods estos estan en los controladores del auth (si veo las importaciones). entonces voy a ese controller y debo devolver esta funcion "getMenuFrontEnd" en esos puntos. cada vez que alguno de esos controllers sea llamado por un usuario que tiene el role de administrados me mandara el MENU mas la parte de mantenimiento de usuarios, y si NO es administrador no mandara lo de los usuarios.
}

module.exports = {
    getMenuFrontEnd
}