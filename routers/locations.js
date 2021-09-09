const express = require('express');
const ruta = express.Router();
const Locations = require('../models/locations.model');
const joi = require('@hapi/joi');
const verificartoken = require('../middlewares/auth')

//validar los datos del post
const schema = joi.object({
    latitud:joi.string().required(),
    longitud:joi.number().required(),
    
})

// rutas
ruta.get('/',verificartoken,(req, res)=>{
    let location = getlocation();
    location.then(locations=>{
        res.json(locations);
    }).catch(error=>{
        res.status(400).json(error);
    })
    
});

ruta.get('/:placa',verificartoken,(req, res)=>{

    let userid= getusersplaca (req.params.placa);
    userid.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    });
})

ruta.post('/',(req, res)=>{

    const {error, value} = schema.validate({
        longitud:req.body.longitud,
        latitud:req.body.latitud,

    });
    if (!error) {
        let location = addlocation(req.body);
        location.then(location=>{
            res.json(location)
        }).catch(error=>{
            res.status(400).json(error)
        })        
    }else{
        res.json({
            error:error
        })
    }




});

// functiones

//agregar usuarios
async function addlocation(body){
    let location = new Locations({
        latitud :body.latitud,
        longitud:body.longitud,
        foto    :body.foto
    });
    return await location.save();
}

//consultar todos los usuarios
async function getlocation(){
    let location = await Locations.find({});
    return location;

}

//consultar todos los usuarios por id
async function getlocationplaca(placa){
    let location = await Location.findOne({'placa':placa});

    return location;
}

module.exports = ruta;