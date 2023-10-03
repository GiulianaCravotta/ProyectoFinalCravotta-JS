//Variables
const listado = document.querySelector('#lista-productos');
const abrirCarrito = document.querySelector('.abrirCarrito');
const cerrarCarrito = document.querySelector('.cerrarCarrito');
const body = document.querySelector("body");
const overlay = document.getElementById("overlay");
const carrito = document.getElementById("carrito");
const total = document.querySelector('.total');
const cantidad = document.querySelector('.cantidad-carrito');
const listaCarrito = document.querySelector('.lista-carrito');
const btnFin = document.getElementById('btn-fin')

let listaCarritoItems = [];
let data;

//Carga de datos del JSON
fetch("https://raw.githubusercontent.com/GiulianaCravotta/ProyectoFinalCravotta-JS/master/js/productos.json")
    .then(response => response.json())
    .then(dataResponse => {
        data = dataResponse;
        data.forEach((producto, indiceProducto) => {
            const fila = document.createElement('div');
            fila.innerHTML = `
                <div class="card text-center">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">$${producto.precio.toLocaleString()}</p>
                        <button href="#" onclick="agregarAlCarrito(${indiceProducto})" class="btn rounded-0 agregar-al-carrito" data-producto-index="${producto.id}">Agregar al carrito</button>
                    </div>
                </div>
            `;

            listado.appendChild(fila);

        });
    })



//Abrir el carrito
abrirCarrito.addEventListener("click", () => {
    body.classList.add("active")
    overlay.style.display = "block";
    carrito.style.display = "block";
})
//Cerrar el carrito
cerrarCarrito.addEventListener("click", () => {
    body.classList.remove("active")
    overlay.style.display = "none";
    carrito.style.display = "none";
})

//Agregar un nuevo producto al carrito
const agregarAlCarrito = (indiceProducto) => {
    const producto = data[indiceProducto];
    const productoEnCarrito = listaCarritoItems.find((item) => item.id === producto.id);

    if (!productoEnCarrito) {
        listaCarritoItems.push({
            ...producto,
            cantidad: 1
        });
        showToast("Producto agregado al carrito!")
    } else {
        showToast("El producto ya se encuentra en el carrito😊")
    }
    actualizarCarrito();
}


//Libreria Toastify
function showToast(notif) {
    Toastify({
        text: notif,
        duration: 3500,
        style: {
            background: '#d560a0'
        },
        close: true
    }).showToast();

}
//Actualizar el contenido del carrito
const actualizarCarrito = () => {
    listaCarrito.innerHTML = "";
    let contador = 0;
    let precioTotal = 0;

    listaCarritoItems.forEach((producto, indiceProducto) => {
        if (producto != null) {
            let fila = document.createElement('li');
            fila.innerHTML = `
                <div class="carrito-imagen"><img src="${producto.imagen}" alt="${producto.nombre}"></div>
                <div class="carrito-info">
                    <div class="producto-nombre"><strong>${producto.nombre}</strong></div>
                    <div class="producto-bottom">$${producto.precio.toLocaleString()}</div>
                    <div class="carrito-controles">
                        <button class="btn-cantidad" onclick="cambioDeCantidad(${indiceProducto}, ${producto.cantidad - 1})">—</button>
                        <div class="producto-cantidad">${producto.cantidad}</div>
                        <button class="btn-cantidad" onclick="cambioDeCantidad(${indiceProducto}, ${producto.cantidad + 1})">+</button>
                    </div>
                </div>
            `;
            //agrega la fila
            listaCarrito.appendChild(fila);
            contador += producto.cantidad;
            precioTotal += producto.precio;
        }
    });
    //se actuliza el total y la cantidad
    total.innerText = "$" + precioTotal.toLocaleString();
    cantidad.innerText = contador;
}

//cambia la cantidad en el carrito
const cambioDeCantidad = (indiceProducto, cantidad) => {
    if (cantidad == 0) {
        listaCarritoItems.splice(indiceProducto, 1);
    } else {
        listaCarritoItems[indiceProducto].cantidad = cantidad
        listaCarritoItems[indiceProducto].precio = listaCarritoItems[indiceProducto].cantidad * data[indiceProducto].precio;
    }
    actualizarCarrito()
}

//Finalizar compra boton
btnFin.addEventListener('click', () => {
    if (listaCarritoItems.length !== 0) {
        Swal.fire({
            title: "Compra Finalizada!",
            text: "Gracias por tu compra!",
            icon: "success",
        }).then((reuslt) => {
            if (reuslt.isConfirmed) {
                cerrarCarrito.click()
                listaCarritoItems = []
                actualizarCarrito()
            }
        });

    } else {
        Swal.fire({
            title: "Carrito Vacío",
            text: "Tu carrito de compras está vacío. Agrega productos antes de finalizar la compra.",
            icon: "warning",
        }).then((reuslt) => {
            if (reuslt.isConfirmed) {
                cerrarCarrito.click()
            }
        });
    }
})