const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();

//requerimos las rutas
const usuarios = require('./routers/usuarios');
const auth = require('./auth/auth')

// millwared para recibir datos json y por url
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//milwared de rutas
app.use('/api/users', usuarios);
app.use('/api/auth',auth);



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

