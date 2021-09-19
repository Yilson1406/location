const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();

//requerimos las rutas
const usuarios = require('./routers/usuarios');
const auth = require('./auth/auth');
const password = require('./password/password');
const admin = require('./routers/admin')

// millwared para recibir datos json y por url
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
    })

//milwared de rutas
app.use('/api/auth',auth);
app.use('/api/password',password);
app.use('/api/admin/',admin);
app.use('/api/users', usuarios);



//conexion a base de datos
mongoose.connect(config.get('configDB.HOST'),{useNewUrlParser:true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Api Conectado a la base de datos con éxito');})
    .catch(error=>{
        console.log('Error al conectarse a la base de datos', error);
    });

//abrimos el puerto por donde vamos a escuchar
const port = process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log('Api escuchando por el puerto', port);
})

