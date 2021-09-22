const express = require('express');
const jwt = require('jsonwebtoken');
const rutas = express.Router();
const config = require('config');
const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcrypt');

rutas.post('/',(req, res)=>{

    Usuario.findOne({email:req.body.email}).then(user=>{
        if (user) {
            const validarpassword = bcrypt.compareSync(req.body.password, user.password);

            if (!validarpassword) res.status(400).json({Error:'OK',Mensaje:'El usuario o contraseña son incorrectas'});

            const jsontoken = jwt.sign({
                usuario:{
                    id: user._id,
                    Nombres: user.nombres,
                    Email:user.email,
                    Telefono: user.telefono,
                    Placa: user.placa,
                    Estado:user.estado,
                    Rol: user.rol,
                    Tipo_Vehiculo:user.tipo_vehiculo,
                    Color_Vehiculo:user.color_vehiculo,
                    Rol: user.rol
                }}, config.get('configToken.SEED'), {expiresIn: config.get('configToken.expiration')});

            res.json( 
                {
                Token:jsontoken,
                rol: user.rol,
                estado: user.estado
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