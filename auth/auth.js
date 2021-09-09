const express = require('express');
const jwt = require('jsonwebtoken');
const rutas = express.Router();
const config = require('config');
const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcrypt');
const ruta = require('../routers/usuarios');

rutas.post('/',(req, res)=>{

    Usuario.findOne({email:req.body.email}).then(user=>{
        if (user) {
            const validarpassword = bcrypt.compareSync(req.body.password, user.password);

            if (!validarpassword) res.status(400).json({Error:'OK',Mensaje:'El usuario o contraseña son incorrectas'});

            const jsontoken = jwt.sign({
                User:{
                    Nombres: user.nombres,
                    Email:user.email,
                    Telefono: user.telefono,
                    Placa: user.placa,
                    Estado:user.estado,
                    Tipo_Vehiculo:user.tipo_vehiculo,
                    Color_Vehiculo:user.color_vehiculo
                }}, config.get('configToken.SEED'), {expiresIn: config.get('configToken.expiration')});

            res.json({
                User:{
                    Nombres: user.nombres,
                    Email:user.email,
                    Telefono: user.telefono,
                    Placa: user.placa,
                    Estado:user.estado,
                    Tipo_Vehiculo:user.tipo_vehiculo,
                    Color_Vehiculo:user.color_vehiculo
                },Token:jsontoken
            })

        }else {
              res.status(400).json({
                  Error: 'OK',
                  Mensaje: 'El usuario o contraseña son incorrectas'
              })  
        }
    }).catch(error =>{
        res.status(400).json(error)
    })

})

module.exports = rutas;