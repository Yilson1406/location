const express = require('express');
const ruta = express.Router();
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt');
const joi = require('@hapi/joi');
const verificartoken = require('../middlewares/auth');

//validar los datos del post
const schema = joi.object({
    nombres:joi.string().required(),
    telefono:joi.number().required(),
    email: joi.string().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ec', 'net']
        }
    }).required()
})


// rutas
ruta.get('/',verificartoken,(req, res)=>{
    let users = getusers();
    users.then(users=>{
        res.json(users);
    }).catch(error=>{
        res.status(400).json(error);
    })
    
});

ruta.get('/:placa',(req, res)=>{

    let userid= getusersplaca (req.params.placa);
    userid.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    });
})

ruta.post('/',(req, res)=>{

    const {error, value} = schema.validate({
        nombres:req.body.nombres,
        email:req.body.email,
        telefono:req.body.telefono
    });
    if (!error) {
        let users = adduser(req.body);
        users.then(user=>{
            res.json(user)
        }).catch(error=>{
            res.status(400).json(error)
        })        
    }else{
        res.json({
            error:error
        })
    }




});

//ruta para editar user
ruta.put('/:placa',(req, res)=>{

    let usuario = updateuser(req.params.placa, req.body);
    usuario.then(user=>{
        res.json(user)
    }).catch(error=>{
        res.status(400).json(error);
    });
});

//eliminar usuario
ruta.delete('/:placa',(req, res)=>{
    let usuario = deleteuser(req.params.placa);
    usuario.then(datos=>{
        res.json(datos)
    }).catch(error =>{
        res.status(400).json(error)
    })

});

// functiones

//agregar usuarios
async function adduser(body){
    let users = new Usuarios({
        nombres :body.nombres,
        email   :body.email,
        telefono:body.telefono,
        placa   :body.placa,
        password: bcrypt.hashSync(body.password, 10)
    });
    return await users.save();
}

//consultar todos los usuarios
async function getusers(){
    let usuario = await Usuarios.find({"estado":true})
    .select({nombres:1, email:1, placa:1, estado:1, telefono:1});
    return usuario;

}

//consultar todos los usuarios por id
async function getusersplaca(placa){
    let usuario = await Usuarios.findOne({'placa':placa})
    .select({nombres:1, email:1, placa:1, estado:1, telefono:1});
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

//validar si existe placa
// async function validarplaca(placa){
//      let usuario = await Usuarios.findOne({'placa':placa})
//     .select({nombres:1, email:1, placa:1, estado:1, telefono:1});
//     return usuario;
// }


module.exports = ruta

