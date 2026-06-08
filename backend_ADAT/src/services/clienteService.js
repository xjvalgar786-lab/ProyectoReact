const URL = "http://localhost:8080/clientes";

export async function getClientes() {

    const response = await fetch(URL);

    console.log("Status:", response.status);

    const texto = await response.text();

    console.log("Respuesta backend:", texto);

    return texto ? JSON.parse(texto) : [];
}

export async function crearCliente(cliente) {

    const response = await fetch(URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(cliente)
    });

    return response.json();
}

export async function borrarCliente(id) {

    await fetch(`${URL}/${id}`, {

        method: "DELETE"
    });
}

export async function actualizarCliente(id, cliente) {

    const response =
        await fetch(`${URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(cliente)
        });

    return response.json();
}