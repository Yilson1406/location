const express = require('express');
const ruta = express.Router();
const Location = require('../models/locations.model');
const joi = require('@hapi/joi');
const verificartoken = require('../middlewares/auth');
const Usuario= require('../models/usuarios.model')

//validar los datos del post
const schema = joi.object({
    latitud:joi.number().required(),
    longitud:joi.number().required()
})


// rutas
ruta.get('/',(req, res)=>{

    let location = getlocation();
    location.then(loca=>{
        res.json(loca);
    }).catch(error=>{
        res.status(400).json(error);
    })
    
});

ruta.get('/one',verificartoken,(req, res)=>{

    let userid= getusersid(req.usuario.id);
    userid.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    });
})


ruta.post('/:placa',(req, res)=>{

    let user =  Usuario.findOne({'placa':req.params.placa})
    user.then(datos=>{
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


    }).catch(error=>{
        console.log(error);
    })



});

//ruta para editar user
ruta.put('/:placa',verificartoken,(req, res)=>{

    let usuario = updateuser(req.params.placa, req.body);
    usuario.then(user=>{
        res.json(user)
    }).catch(error=>{
        res.status(400).json(error);
    });
});


ruta.delete('/:placa',verificartoken,(req, res)=>{

    let usuario = deleteuser(req.params.placa);
    usuario.then(datos=>{
        res.json(datos)
    }).catch(error =>{
        res.status(400).json(error)
    })

});

// functiones

//agregar usuarios
async function addlocation(body, id){
    let users = new Location({
        longitud:body.longitud,
        latitud:body.latitud,
        foto:body.foto,
        user:id

    });
    return await users.save();
}

//consultar todos los usuarios
async function getlocation(){
    let usuario = await Location.find().populate('user')

    return usuario;

}
async function getusersid(id){
    let usuario = await Usuarios.findOne({'_id':id})
    return usuario;
}

//update de usuario
async function updateuser(placa,body){
    
    let usuario = await Usuarios.findOneAndUpdate({"placa":placa}, {
        $set:{
            nombres :body.nombres,
            email   :body.email,
            telefono:body.telefono
        }
    },{new:true});
    return usuario;
}

//eliminar usuario
async function deleteuser(placa){
    let usuario = await Usuarios.findOneAndUpdate({"placa":placa}, {
        $set:{
            estado:false
        }
    },{new:true});
    return usuario;
}
//validar password
async function validarpasswor(id){
    let usuario = Usuario.findOne({"_id": id});
    return usuario;
}
//validar si existe placa
// async function validarplaca(placa){
//      let usuario = await Usuarios.findOne({'placa':placa})
//     .select({nombres:1, email:1, placa:1, estado:1, telefono:1});
//     return usuario;
// }


module.exports = ruta

