import { useEffect, useState } from "react";

import {
  getClientes,
  crearCliente,
  borrarCliente,
} from "../../services/clienteService";

import {
  getPedidosCliente,
  crearPedido,
  borrarPedido,
} from "../../services/pedidoService";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [importe, setImporte] = useState("");
  const [estado, setEstado] = useState("");

  const cargarClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const verPedidos = async (cliente) => {
    const data = await getPedidosCliente(cliente.id);

    setPedidos(Array.isArray(data) ? data : []);

    setClienteSeleccionado(cliente);
  };

  const guardarCliente = async () => {
    await crearCliente({
      nombre,
      email,
      telefono,
    });

    setNombre("");
    setEmail("");
    setTelefono("");

    cargarClientes();
  };

  const eliminarCliente = async (id) => {
    await borrarCliente(id);
    cargarClientes();
  };

  const guardarPedido = async () => {
    if (!clienteSeleccionado) return;

    await crearPedido(clienteSeleccionado.id, {
      producto,
      cantidad: Number(cantidad),
      importe: Number(importe),
      estado,
    });

    setProducto("");
    setCantidad("");
    setImporte("");
    setEstado("");

    verPedidos(clienteSeleccionado);
  };

  const eliminarPedido = async (id) => {
    await borrarPedido(id);

    verPedidos(clienteSeleccionado);
  };

  return (
    <div>
      <h2>Clientes</h2>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <button onClick={guardarCliente}>
        Crear Cliente
      </button>

      <hr />

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            <strong>{cliente.nombre}</strong>

            {" - "}

            {cliente.email}

            <button
              onClick={() => verPedidos(cliente)}
            >
              Ver pedidos
            </button>

            <button
              onClick={() => eliminarCliente(cliente.id)}
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>

      {clienteSeleccionado && (
        <div>
          <hr />

          <h3>
            Pedidos de {clienteSeleccionado.nombre}
          </h3>

          <table border="1">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Importe</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.producto}</td>

                  <td>{pedido.cantidad}</td>

                  <td>{pedido.importe} €</td>

                  <td>{pedido.estado}</td>

                  <td>
                    <button
                      onClick={() =>
                        eliminarPedido(pedido.id)
                      }
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Nuevo Pedido</h4>

          <input
            placeholder="Producto"
            value={producto}
            onChange={(e) =>
              setProducto(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) =>
              setCantidad(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Importe"
            value={importe}
            onChange={(e) =>
              setImporte(e.target.value)
            }
          />

          <input
            placeholder="Estado"
            value={estado}
            onChange={(e) =>
              setEstado(e.target.value)
            }
          />

          <button onClick={guardarPedido}>
            Crear Pedido
          </button>

          <br />
          <br />

          <button
            onClick={() => {
              setClienteSeleccionado(null);
              setPedidos([]);
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default Clientes;