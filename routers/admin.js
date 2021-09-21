const express = require('express');
const ruta = express.Router();
const Location = require('../models/locations.model');
const joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const verificartoken = require('../middlewares/auth');
const Usuarios= require('../models/usuarios.model');


//validar los datos del post
const schema = joi.object({
    nombres:joi.string().required(),
    telefono:joi.number().required(),
    email: joi.string().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ec', 'net']
        }
    }).required(),
    color_vehiculo:joi.string().required()
})


// rutas de usuarios

//todos los usuarios
ruta.get('/users',verificartoken,(req, res)=>{

    let location = getusers();
    location.then(loca=>{
        res.json(loca);
    }).catch(error=>{
        res.status(400).json(error);
    })
    
});

//agregar nuevo user
ruta.post('/save-user',verificartoken,(req, res)=>{

    const {error, value} = schema.validate({
        nombres:req.body.nombres,
        email:req.body.email,
        telefono:req.body.telefono,
        color_vehiculo:req.body.color_vehiculo
    });
    if (!error) {
        let valplaca = validarplaca(req.body.placa);
        valplaca.then(datos=>{
            if (datos) {
                res.json({Mensaje:'Placa ya existe'})

            }else{
                let users = adduser(req.body);
                users.then(user=>{
                    res.json(user)
                }).catch(error=>{
                    res.status(400).json({error:error})
                })        
            }
        }).catch(error=>{
            res.status(400).json(error)
        })

    }else{
        res.json({
            error:error
        })
    }
});

//elinimar usuario
ruta.delete('/delete-user/:placa',verificartoken,(req, res)=>{

    let usuario = deleteuser(req.params.placa);
    usuario.then(datos=>{
        res.json(datos)
    }).catch(error =>{
        res.status(400).json(error)
    })

});

// consultar usuario por placa
ruta.get('/user/:placa',verificartoken,(req, res)=>{
 
    let pla = validarplaca(req.params.placa)
        pla.then(datos=>{
            if (datos) {
            let user = userplaca(req.params.placa);
            user.then(datos=>{
                res.json(datos)
            }).catch(error=>{
                res.status(400).json(error)
            })
            } else {
                res.status(400).json({
                    Mensaje:'La placa no existe'
                })
            }
        }).catch(error =>{
            console.log(error);
        })
})

//para editar user
ruta.put('/update-user/:id',verificartoken,(req, res)=>{

    let usuario = updateuser(req.params.id, req.body);
    usuario.then(user=>{
        res.json(user)
    }).catch(error=>{
        res.status(400).json(error);
    });
});
//fin de rutas de usuarios


//rutas de locations

// todas las locations
ruta.get('/locations',verificartoken,(req, res)=>{
    let locations = getlocations();
    locations.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    })
})

// location por id de usuario
ruta.get('/location/:id',verificartoken,(req, res)=>{
    let locations = getlocationid(req.params.id);
    locations.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    })
})


//functiones de las locations
//todas las lacaciones
async function getlocations(){
    let locations= Location.find({}).populate('user');
    return locations; 

}
//locacion por id de usuario
async function getlocationid(id){
    let location = Location.find({'user':id})
    return location;
}


// functiones de usuarios
//function para obtener todos los usuarios
async function getusers(){
    let users = Usuarios.find({});
    return users;
}
//funcion para obtener user por placa
async function userplaca(placa){
    let usuario = Usuarios.findOne({'placa':placa})
    return usuario;
}
//function eliminar usuario
async function deleteuser(placa){
    let usuario = await Usuarios.findOneAndUpdate({"placa":placa}, {
        $set:{
            estado:false
        }
    },{new:true});
    return usuario;
}
//agregar usuarios
async function adduser(body){

    let users = new Usuarios({
        nombres         :body.nombres,
        email           :body.email,
        telefono        :body.telefono,
        placa           :body.placa,
        color_vehiculo  :body.color_vehiculo,
        password: bcrypt.hashSync(body.password, 10)
    });
    return await users.save();
    // return body
}
//function para poder agregar usuario

//validar placa
async function validarplaca(placa){
    let user = Usuarios.findOne({'placa':placa})
    return user;
}
//update de usuario
async function updateuser(id,body){
    
    let usuario = await Usuarios.findOneAndUpdate({"_id":id}, {
        $set:{
            rol:    body.rol,
            nombres :body.nombres,
            email   :body.email,
            telefono:body.telefono,
            password:bcrypt.hashSync(body.password, 10),
            color_vehiculo:body.color_vehiculo,
            placa:  body.placa

        }
    },{new:true});
    return usuario;
}


module.exports = ruta

