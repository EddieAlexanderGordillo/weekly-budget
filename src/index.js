// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//eventos
eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', pregunarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
}

//clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }
  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }
  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }
  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id != id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    //extrayendo los valores
    const { presupuesto, restante } = cantidad;
    //agragando al html
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }
  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('alerta');
    if (tipo === 'error') {
      divMensaje.classList.add('alerta-error');
    } else {
      divMensaje.classList.add('alerta-exito');
    }
    //agregar mensaje
    divMensaje.textContent = mensaje;
    document
      .querySelector('.contenido-primario')
      .insertBefore(divMensaje, formulario);
    //quitar mensaje despues de 3 sg
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
  mostrarGasto(gastos) {
    //elimina el html previo
    this.limpiarHtml();
    //iterar sobre los gstos
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;
      //crear un li
      const nuevoGasto = document.createElement('li');
      nuevoGasto.classList.add = '"gastos__lista';
      nuevoGasto.setAttribute('data-id', id);
      //agregar el html del gasto
      nuevoGasto.innerHTML = `${nombre}<span class='gasto-span'>$ ${cantidad} </span>`;
      //boton para borrar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btnborrar');
      btnBorrar.innerHTML = 'Borrar &times';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);
      //agregar el html
      gastoListado.appendChild(nuevoGasto);
    });
  }
  limpiarHtml() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }
  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }
  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector('.presupuesto__restante');
    //comprobar 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove('alerta-exito', 'alerta-advertencia');
      restanteDiv.classList.add('alerta-error');
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove('alerta-exito', 'alerta-error');
      restanteDiv.classList.add('alerta-advertencia');
    } else {
      restanteDiv.classList.remove('alerta-error', 'alerta-advertencia');
      restanteDiv.classList.add('alerta-exito');
    }
    //si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    } else {
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }
}
//instanciar
const ui = new UI();
let presupuestoPromt;
//funciones
function pregunarPresupuesto() {
  const presupuestoUsuario = prompt('¿Cuual es tu presupuesto?');
  if (
    presupuestoUsuario === '' ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }
  //presupuesto valido
  presupuestoPromt = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuestoPromt);
}
// Añade Gastos
function agregarGasto(e) {
  e.preventDefault();
  //leer datos formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);
  //validar
  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no válida', 'error');
    return;
  }
  //generar un objeto con el gasto
  const gasto = {
    nombre: nombre,
    cantidad: cantidad,
    id: Date.now(),
  };
  //añade un nuevo gasto
  presupuestoPromt.nuevoGasto(gasto);
  //mensaje de correcto
  ui.imprimirAlerta('Gasto agregado correctamente');
  //imprimir los gastos
  const { gastos, restante } = presupuestoPromt;
  ui.mostrarGasto(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuestoPromt);
  //reinicia el formulario
  formulario.reset();
}
function eliminarGasto(id) {
  //elimina del objeto
  presupuestoPromt.eliminarGasto(id);
  //elimina los gstos del html
  const { gastos, restante } = presupuestoPromt;
  ui.mostrarGasto(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuestoPromt);
}
