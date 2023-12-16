const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');


// const connectMongo = require('connect-mongo');

const { router: vistasRouter } = require('./routes/login/vistas.router.js');
const { router: sessionRouter } = require('./routes/login/session.router.js');

const PORT=3000; //Diferente port a app.js 

const app=express();
const fileStore=FileStore(session)

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session(
    {
        store: new FileStore({
            path:'./src/sessions', ttl: 3600, retries: 0
        }),
        secret: 'coder123',
        resave: true, 
        saveUninitialized: true
        
    }
))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/', vistasRouter)
app.use('/api/sessions', sessionRouter)


// app.get('/', (req, res) => {
//     console.log('Session Object:', req.session);
  
//     let mensaje = 'Bienvenido';
//     if (req.session.contador) {
//       req.session.contador++;
//       mensaje += `. Visitas a esta ruta: ${req.session.contador}`;
//     } else {
//       req.session.contador = 1;
//     }
//     if (req.query.nombre) {
//       mensaje = `Bienvenido ${req.query.nombre}`;
//       if (req.session.usuario) {
//         let indice = req.session.usuario.findIndex(
//           (u) => u.nombre === req.query.nombre
//         );
//         if (indice === -1) {
//           req.session.usuario.push({
//             nombre: req.query.nombre,
//             visitas: 1,
//           });
//         } else {
//           req.session.usuario[indice].visitas++;
//           mensaje += `. Usted ha ingresado a esta ruta en ${req.session.usuario[indice].visitas} oportunidades`;
//         }
//       } else {
//         req.session.usuario = [
//           {
//             nombre: req.query.nombre,
//             visitas: 1,
//           },
//         ];
//       }
//     }
  
//     res.setHeader('Content-Type', 'text/plain');
//     res.status(200).send(mensaje);
//   });
  
//   app.get('/reset', (req, res) => {
//     console.log('Session before destroy:', req.session);
  
//     req.session.destroy((error) => {
//       if (error) {
//         console.error('Error destroying session:', error);
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(500).json({
//           error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
//         });
//       }
//     });
  
//     console.log('Session after destroy:', req.session);
  
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json({
//       resultado: 'Session reiniciada',
//     });
//   });
  
// let usuarios=[
//     {
//         nombre:'Pedro', password:'123', 
//         rol: 'usuario'
//     },
//     {
//         nombre:'Matías', password:'123', 
//         rol: 'usuario'
//     },
//     {
//         nombre:'Admin', password:'codercoder', 
//         rol: 'admin'
//     },
// ]

// app.get('/logout',(req,res)=>{
    
//     req.session.destroy(error=>{
//         if(error){
//             res.setHeader('Content-Type','application/json');
//             return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
//         }
//     })

//     res.setHeader('Content-Type','application/json');
//     res.status(200).json({
//         logout:"Loguot correcto"        
//     });
// });

// app.get('/login',(req,res)=>{
    
//     let {nombre, password}=req.query
//     if(!nombre || !password){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`Complete nombre y password`})
//     }

//     let usuario=usuarios.find(u=>u.nombre===nombre && u.password===password)
//     if(!usuario){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`Ha ingresado credenciales inválidas`})
//     }

//     req.session.usuario=usuario

//     res.setHeader('Content-Type','application/json');
//     res.status(200).json({
//         resultado:`Login correcto para ${usuario.nombre}`
//     });
// });

// const auth=(req, res, next)=>{
//     if(!req.session.usuario){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`No existen usuarios logueados, ingrese a /login`})
//     }

//     next()
// }

// app.get('/datos', auth, (req,res)=>{
    
//     res.setHeader('Content-Type','application/json');
//     res.status(200).json({
//         datos:"Datos confidenciales"
//     });
// });

// app.get('/', auth, (req,res)=>{
    
//     res.setHeader('Content-Type','application/json');
//     res.status(200).json({
//         datos:"Home Page"
//     });
// });

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});