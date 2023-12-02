console.log('Funciona');
const socket=io()
let inputMensaje=document.getElementById('mensaje')
let divMensajes=document.getElementById('mensajes')


Swal.fire({
    title:"Registrese",
    input:"text",
    text:"Ingrese su nombre",
    inputValidator: (value)=>{
        return !value && "Debe ingresar su nombre."
    },
    allowOutsideClick:false
}).then(resultado=>{
    console.log(resultado)
    socket.emit('id', resultado.value)
    inputMensaje.focus()
    document.title=resultado.value


    socket.on('nuevoUsuario', nombre=>{
        Swal.fire({
            text:`Se ha conectado ${nombre}`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on("Bienvenido",mensajes=>{
        mensajes.forEach(mensaje=>{
            let parrafo=document.createElement('p')
            parrafo.innerHTML=`<strong>${mensaje.emisor}</strong> dice: <i>${mensaje.mensaje}</i>`
            parrafo.classList.add('mensaje')
            let br=document.createElement('br')
            divMensajes.append(parrafo, br)
            divMensajes.scrollTop=divMensajes.scrollHeight   
        })
    })

    socket.on('nuevoMensaje', datos=>{
        let parrafo=document.createElement('p')
        parrafo.innerHTML=`<strong>${datos.emisor}</strong> dice: <i>${datos.mensaje}</i>`
        parrafo.classList.add('mensaje')
        let br=document.createElement('br')
        divMensajes.append(parrafo, br)
        divMensajes.scrollTop=divMensajes.scrollHeight
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: datos.user,
                message: datos.message
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });

    inputMensaje.addEventListener("keyup",(e)=>{
        console.log(e, e.target.value)
        if(e.code==="Enter" && e.target.value.trim().length>0){
            socket.emit('mensaje', { emisor: resultado.value, mensaje: e.target.value.trim() });
            e.target.value=''
        }
    })

    socket.on("usuarioDesconectado",nombre=>{
        Swal.fire({
            text:`Se ha desconectado ${nombre}`,
            toast:true,
            position:"top-right"
        })
    })

})