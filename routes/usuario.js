 // Requires
 var express = require('express');
 // Inicializar variables
 var app = express();

 var Usuario = require('../models/usuario');

 // Rutas
 app.get('/', (req, res, next) => {
     // Regresar unicamente el nombre
     Usuario.find({}, 'nombre email img role')
         .exec((err, usuarios) => {
             if (err) {
                 return res.status(500).json({
                     ok: false,
                     mensaje: 'Error cargando usuarios',
                     errors: err
                 });
             }
             res.status(200).json({
                 ok: true,
                 usuarios: usuarios
             });
         });
 });

 app.post('/', (req, res) => {

     var body = req.body;

     var usuario = new Usuario({
         nombre: body.nombre,
         email: body.email,
         password: body.password,
         img: body.img,
         role: body.role,
     });

     usuario.save((err, usuarioGuardado) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al cargar usuario',
                 errors: err
             });
         }
         res.status(201).json({
             ok: true,
             body: usuarioGuardado
         });

     });

 });

 module.exports = app;