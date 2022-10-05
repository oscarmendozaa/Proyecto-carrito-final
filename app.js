//DOM - cards del contairner - Card de Bootstrap - 
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('templateCard').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
const btn1 = document.getElementById('btn1')


const logocarrito = document.getElementsByClassName("count-product")
const sumaaa = document.getElementById("sumaaa")


//coleccion de objetos vacio
let carrito = {}

//evento click al comprar
cards.addEventListener('click', e =>{
    addCarrito(e)
})

//evento para agregar o quitar del carrito
items.addEventListener('click', e =>{
    btnAccion(e)
})


//Capturar datos del JSON al cargar la pagina
document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
const fetchData = async () => {
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}
//Rellenar cada tarjeta de Bootstrap con la data del api.JSON
const pintarCards = data =>{
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title 
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id


        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}



//funcion que agrega los elementos a setCarrito
const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    
    e.stopPropagation()
}


//mandar a un objeto los datos segun la tarjeta que se clickee
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    Toastify({
        text: "Agregado al carrito de compras",
        duration:3000,
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
    //if en caso de que se seleccione el mismo objeto y se acumule
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}



//Mandar los elementos seleccionados del objeto al template de carrito
const pintarCarrito = () =>{
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-success').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()

    //LocalStorage
    localStorage.setItem('carrito', JSON.stringify(carrito))
}


//Mandar la info al banner footer 
const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    document.getElementById("conteo").innerHTML = nCantidad


    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', ()=>{
        carrito = {}
        swal("Carrito Vaciado", "", "success");
        pintarCarrito()
        document.getElementById("conteo").innerHTML = 0
    })
}


//Botones de agregar y restar elementos
const btnAccion = e => {
    if(e.target.classList.contains('btn-success')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto}
                Toastify({
                text: "Agregado al carrito de compras",
                duration:3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right", 
                stopOnFocus: true, 
                style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
            }).showToast();
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
            document.getElementById("conteo").innerHTML = 0
        }
        Toastify({
            text: "Eliminado del carrito de compras",
            duration:3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right", 
            stopOnFocus: true, 
            style: {
            background: "linear-gradient(to right, #c9ad72, #d6684c)",
            },
        }).showToast();
        pintarCarrito()
    }
    e.stopPropagation()
}




