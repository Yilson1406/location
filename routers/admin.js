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
    color_vehiculo:joi.string().required(),
    tipo_vehiculo:joi.string().required(),
    rol:joi.string().required(),
    placa:joi.string().required()
})


// rutas de usuarios

//todos los usuarios
ruta.get('/users',verificartoken,(req, res)=>{


    let Rol = req.usuario.Rol
    if (Rol === 'ADMIN') {
        let activo= req.usuario.Estado
        if (activo) {
            let location = getusers();
            location.then(loca=>{
                res.json(loca);
            }).catch(error=>{
                res.status(400).json(error);
            })                   
        } else {
            res.status(400).json({Mensaje:'Acceso Denegado, Usuario no Existe'})            
        }
 
    } else {
        res.status(400).json({Mensaje:'Acceso Denegado, Usted no es administrador'})
    }

    
});

//agregar nuevo user
ruta.post('/save-user',verificartoken,(req, res)=>{


    let Rol = req.usuario.Rol
    if (Rol === 'ADMIN') {
        let activo= req.usuario.Estado
        if (activo) {

    const {error, value} = schema.validate({
        nombres:req.body.nombres,
        email:req.body.email,
        telefono:req.body.telefono,
        color_vehiculo:req.body.color_vehiculo,
        tipo_vehiculo:req.body.tipo_vehiculo,
        placa:req.body.placa,
        rol:req.body.rol


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
} else {
    res.status(400).json({Mensaje:'Acceso Denegado, Usuario no Existe'})            
}

} else {
res.status(400).json({Mensaje:'Acceso Denegado, Usted no es administrador'})
}
});

//elinimar usuario
ruta.delete('/delete-user/:placa',verificartoken,(req, res)=>{
    let Rol = req.usuario.Rol
    if (Rol === 'ADMIN') {
        let activo= req.usuario.Estado
        if (activo) {
            let vaplaca = validarplaca(req.params.placa)
            vaplaca.then(datos=>{
                if(datos){
                    let usuario = deleteuser(req.params.placa);
                    usuario.then(datos=>{
                        res.json(datos)
                    }).catch(error =>{
                        res.status(400).json(error)
                    })
                }else{
                    res.status(400).json({Mensaje:'La placa no existe'})                                
                }

            }).catch(error=>{
                res.status(400).json(error)
            })

        } else {
            res.status(400).json({Mensaje:'Acceso Denegado, Usuario no Existe'})            
        }

    } else {
    res.status(400).json({Mensaje:'Acceso Denegado, Usted no es administrador'})
    }

});

// consultar usuario por placa
ruta.get('/user/:placa',verificartoken,(req, res)=>{
 
    let Rol = req.usuario.Rol
    if (Rol === 'ADMIN') {
        let activo= req.usuario.Estado
        
        if (activo) {

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
    } else {
        res.status(400).json({Mensaje:'Acceso Denegado, Usuario no Existe'})            
    }
    
    } else {
    res.status(400).json({Mensaje:'Acceso Denegado, Usted no es administrador'})
    }
});

//para editar user
ruta.put('/update-user/:id',verificartoken,(req, res)=>{
    let Rol = req.usuario.Rol
    if (Rol === 'ADMIN') {
        let activo= req.usuario.Estado
        if (activo) {
            let user = validaruser_id(req.params.id);
            user.then(d=>{
                if(d){
                    // res.json(d)
                    let usuario = updateuser(req.params.id, req.body);
                    usuario.then(user=>{
                        res.json(user)
                    }).catch(error=>{
                        res.status(400).json(error);
                    });
                }else{
                    res.status(400).json({Mensaje:'Usuario no existe'})                                
                }
            })

        } else {
            res.status(400).json({Mensaje:'Acceso Denegado, Usuario no Existe'})            
        }

    } else {
    res.status(400).json({Mensaje:'Acceso Denegado, Usted no es administrador'})
    }
});
//fin de rutas de usuarios


//rutas de locations

// todas las locations
ruta.get('/locations',verificartoken,(req, res)=>{
    let Rol = req.usuario.Rol
    if (Rol === 'ADMIN') {
        let activo= req.usuario.Estado
        if (activo) {
    let locations = getlocations();
    locations.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    })
} else {
    res.status(400).json({Mensaje:'Acceso Denegado, Usuario no Existe'})            
}

} else {
res.status(400).json({Mensaje:'Acceso Denegado, Usted no es administrador'})
}
})

// location por id de usuario
ruta.get('/location/:id',verificartoken,(req, res)=>{
    let Rol = req.usuario.Rol
    if (Rol === 'ADMIN') {
        let activo= req.usuario.Estado
        if (activo) {
    let locations = getlocationid(req.params.id);
    locations.then(datos=>{
        res.json(datos)
    }).catch(error=>{
        res.status(400).json(error)
    })
} else {
    res.status(400).json({Mensaje:'Acceso Denegado, Usuario no Existe'})            
}

} else {
res.status(400).json({Mensaje:'Acceso Denegado, Usted no es administrador'})
}
})


//functiones de las locations

//todas las lacaciones
async function getlocations(){
    let locations= await Location.find({}).populate('user');
    return locations; 

}
//locacion por id de usuario
async function getlocationid(id){
    let location = await Location.find({'user':id})
    return location;
}


// functiones de usuarios
//validar si usuario existe
async function validaruser_id(id){
    let user = await Usuarios.findOne({'_id':id});
    return user;
}
//function para obtener todos los usuarios
async function getusers(){
    let users = await Usuarios.find({});
    return users;
}
//funcion para obtener user por placa
async function userplaca(placa){
    let usuario = await Usuarios.findOne({'placa':placa})
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
        tipo_vehiculo   :body.tipo_vehiculo,
        password: bcrypt.hashSync(body.password, 10),
        rol             :body.rol
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
            color_vehiculo:body.color_vehiculo,
            placa:  body.placa
        }
    },{new:true});
    return usuario;
    
    // let usuario = await Usuarios.findOneAndUpdate({"_id":id}, {
    //     $set:{
    //         rol:    body.rol,
    //         nombres :body.nombres,
    //         email   :body.email,
    //         telefono:body.telefono,
    //         password:bcrypt.hashSync(body.password, 10),
    //         color_vehiculo:body.color_vehiculo,
    //         placa:  body.placa

    //     }
    // },{new:true});
    // return usuario;
}


module.exports = ruta

