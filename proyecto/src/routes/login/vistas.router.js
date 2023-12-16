const { Router } = require('express');
const router = Router();

const vistasRouter = Router();


const auth=(req, res, next)=>{
    if(!req.session.usuario){
        res.redirect('/login')
    }

    next()
}

router.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.status(200).render('homeLogin')
})

router.get('/registro',(req,res)=>{

    let {error}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('registro', {error})
})

router.get('/login',(req,res)=>{

    let {error, mensaje}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, mensaje})
})

router.get('/perfil', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.setHeader('Content-Type','text/html')
    res.status(200).render('perfil', {usuario})
})

module.exports = { router: vistasRouter };