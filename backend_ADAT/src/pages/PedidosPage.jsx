import { useEffect, useState } from "react";

import {

    getPedidos,
    crearPedido,
    borrarPedido

} from "../../services/pedidoService";

function Pedidos() {

    const [pedidos, setPedidos] =
        useState([]);

    const [clienteId, setClienteId] =
        useState("");

    const [producto, setProducto] =
        useState("");

    const [cantidad, setCantidad] =
        useState("");

    const [importe, setImporte] =
        useState("");

    const cargarPedidos = async () => {

        const data =
            await getPedidos();

        setPedidos(data);
    };

    useEffect(() => {

        cargarPedidos();

    }, []);

    const guardarPedido = async () => {

        await crearPedido(clienteId, {

            producto,
            cantidad,
            importe,
            estado: "PENDIENTE"
        });

        cargarPedidos();
    };

    const eliminarPedido = async (id) => {

        await borrarPedido(id);

        cargarPedidos();
    };

    return (

        <div>

            <h2>Pedidos</h2>

            <input
                placeholder="ID Cliente"
                value={clienteId}
                onChange={(e) =>
                    setClienteId(e.target.value)}
            />

            <input
                placeholder="Producto"
                value={producto}
                onChange={(e) =>
                    setProducto(e.target.value)}
            />

            <input
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) =>
                    setCantidad(e.target.value)}
            />

            <input
                placeholder="Importe"
                value={importe}
                onChange={(e) =>
                    setImporte(e.target.value)}
            />

            <button onClick={guardarPedido}>
                Crear Pedido
            </button>

            <ul>

                {pedidos.map(pedido => (

                    <li key={pedido.id}>

                        {pedido.producto}

                        {" - "}

                        {pedido.importe} €

                        <button
                            onClick={() =>
                                eliminarPedido(pedido.id)}>

                            Borrar

                        </button>

                    </li>

                ))}

            </ul>

        </div>
    );
}

export default Pedidos;