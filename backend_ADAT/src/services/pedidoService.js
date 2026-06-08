const URL = "http://localhost:8080/pedidos";

export async function getPedidos() {

    const response =
        await fetch(URL);

    return response.json();
}

export async function getPedidosCliente(id){

    const response =
        await fetch(`${URL}/cliente/${id}`);

    return response.json();
}

export async function crearPedido(clienteId, pedido) {

    const response =
        await fetch(

            `${URL}/cliente/${clienteId}`,

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(pedido)
            }
        );

    return response.json();
}

export async function borrarPedido(id) {

    await fetch(`${URL}/${id}`, {

        method: "DELETE"
    });
}

export async function actualizarPedido(id, pedido) {

    const response =
        await fetch(`${URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pedido)
        });

    return response.json();
}