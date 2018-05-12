 // Requires
 var express = require('express');
 // Inicializar variables
 var app = express();
 var bcrypt = require('bcrypt');
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

 app.put('/:id', (req, res) => {

     var id = req.params.id;
     var body = req.body;

     Usuario.findById(id, (err, usuario) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al buscar el usuario',
                 errors: err
             });
         }
         if (!usuario) {
             return res.status(400).json({
                 ok: false,
                 mensaje: `El usuario con el ${id}no existe`,
                 errors: { message: 'No existe un usuario con ese ID' }
             });
         }

         usuario.nombre = body.nombre;
         usuario.email = body.email;
         usuario.role = body.role;

         usuario.save((err, usuarioGuardado) => {
             if (err) {
                 return res.status(400).json({
                     ok: false,
                     mensaje: 'Error al actualizar el usuario',
                     errors: err
                 });
             }
             usuarioGuardado.password = ":)";
             res.status(200).json({
                 ok: true,
                 mensaje: `Usuario acuatizado correctamente`,
                 usuario: usuarioGuardado
             });

         })

     });
 });

 app.post('/', (req, res) => {

     var body = req.body;

     var usuario = new Usuario({
         nombre: body.nombre,
         email: body.email,
         password: bcrypt.hashSync(body.password, 10),
         img: body.img,
         role: body.role,
     });

     usuario.save((err, usuarioGuardado) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'Error al cargar usuario',
                 errors: err
             });
         }

         usuarioGuardado.password = ":)";

         res.status(201).json({
             ok: true,
             body: usuarioGuardado
         });

     });

 });

 app.delete('/:id', (req, res) => {
     var id = req.params.id;

     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al borrar usuario',
                 errors: err
             });
         }

         if (!usuarioBorrado) {
             return res.status(400).json({
                 ok: false,
                 mensaje: `El usuario con el ${id}no existe`,
                 errors: { message: 'No existe un usuario con ese ID' }
             });
         }

         usuarioBorrado.password = ":)";

         res.status(200).json({
             ok: true,
             usuario: usuarioBorrado
         });

     });
 });


 module.exports = app;