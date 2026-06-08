import { useEffect, useState } from "react";

import { getPedidos }
from "../../services/pedidoService";

function Pedidos() {

    const [pedidos, setPedidos] =
        useState([]);

    async function cargarPedidos() {

        const data =
            await getPedidos();

        setPedidos(data);
    }

    useEffect(() => {

        cargarPedidos();

    }, []);

    return (

        <div>

            <h2>Pedidos</h2>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Importe</th>

                    </tr>

                </thead>

                <tbody>

                    {pedidos.map(pedido => (

                        <tr key={pedido.id}>

                            <td>{pedido.id}</td>

                            <td>
                                {pedido.producto}
                            </td>

                            <td>
                                {pedido.cantidad}
                            </td>

                            <td>
                                {pedido.importe}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Pedidos;