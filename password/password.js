const express = require('express');
const ruta = express.Router();
const bcrypt = require('bcrypt');
const Usuarios = require('../models/usuarios.model')
const verificartoken = require('../middlewares/auth');


//update password
ruta.put('/',verificartoken,(req, res)=>{
   
    // res.json({
    //     user: req.usuario.id
    // })

    let user = getusersid(req.usuario.id);
    user.then(datos=>{
       let pascom = bcrypt.compareSync(req.body.passback, datos.password)
        if (pascom == false) {
          res.status(400).json({
              Error:'Ok',
              Mensaje:'Contraseña invalida'
          }) 
        }else{
        let usuario = updatepasword(req.usuario.id,req.body);
        usuario.then(datos =>{
            res.status(200).json(datos)
            //eliminar usuario
        }).catch(error =>{
            res.status(400).json(error)    
        })
        }
    }).catch(error=>{
       res.status(400).json(error)
    })
})

//consultar todos los usuarios por id
async function getusersid(id){
    let usuario = await Usuarios.findOne({'_id':id})
    return usuario;
}
//update password
async function updatepasword(id,body){
    let usuario = await Usuarios.findOneAndUpdate({"_id":id}, {
        $set:{
            password:bcrypt.hashSync(body.password, 10)
        }

    },{new:true});
    return usuario;
}

module.exports = ruta;