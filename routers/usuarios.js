const express = require('express');
const ruta = express.Router();
const Usuario = require('../models/usuarios.model');
const verificartoken = require('../middlewares/auth');
const Location = require('../models/locations.model');
const joi = require('@hapi/joi');

//validar los datos del post
const schema = joi.object({
    latitud:joi.number().required(),
    longitud:joi.number().required()
})

//consultar location por token:id
ruta.get('/location',verificartoken,(req, res)=>{

    let userid= getlocationid(req.usuario.id);
    userid.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    });
});

//consultar un solo usuario por token:id
ruta.get('/',verificartoken,(req, res)=>{


    let userid= getusersid(req.usuario.id);
    userid.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    });
})

//post de location por placa
ruta.post('/location/:placa',(req, res)=>{

    let user =  Usuario.findOne({'placa':req.params.placa})
    user.then(datos=>{
        if (datos) {
                let id = datos._id
                // res.json(id)

            const {error, value} = schema.validate({
                latitud:req.body.latitud,
                longitud:req.body.longitud,
            });
            if (!error) {
                let location = addlocation(req.body, id);
                location.then(loca=>{
                    res.json(loca)
                }).catch(error=>{
                    res.status(400).json(error)
                })        
            }else{
                res.json({
                    error:error
                })
            }
        } else {
            res.status(400).json({
                Error:'Ok',
                Mensaje:'La placa del vehiculo no existe'
            })
        }



    }).catch(error=>{
        console.log(error);
    })



});

// functiones
//agregar new location
async function addlocation(body, id){
    let users = new Location({
        longitud:body.longitud,
        latitud:body.latitud,
        foto:body.foto,
        user:id

    });
    return await users.save();
}

//consultar un solo usuario
async function getusersid(id){
    let usuario = await Usuario.findOne({'_id':id})
    return usuario;
}
//consultar mis locationes

async function getlocationid(id){   
    let locations = Location.find({'user':id})
    return locations
}

module.exports = ruta

