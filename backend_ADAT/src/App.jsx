import "./css/App.css";

import Clientes
from "./components/Cliente/Clientes";

import Pedidos
from "./components/Pedido/Pedidos";

function App() {

    return (

        <div className="container">

            <h1>
                Gestión Clientes y Pedidos
            </h1>

            <Clientes />

            <hr />

            <Pedidos />

        </div>
    );
}

export default App;