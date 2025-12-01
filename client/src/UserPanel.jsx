import { useEffect, useState } from "react";

function UserPanel() {
    const [especies, setEspecies] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        cargarEspecies();
    }, []);

    const cargarEspecies = async () => {
        const r = await fetch("http://localhost:3000/api/especies");
        const datos = await r.json();
        setEspecies(datos);
    };

    const agregarCarrito = (especie, kilos) => {
        if (kilos <= 0) return;

        const precioKilo = especie.id_lte?.precio_kilo_salida || 0;
        const total = kilos * precioKilo;

        const nuevo = {
            id_cmp: Math.floor(Math.random() * 1000000),
            nombre: especie.nombre,
            kilos,
            precio_kilo_final: precioKilo,
            precio_total: total
        };

        setCarrito([...carrito, nuevo]);
        alert("Añadido al carrito");
    };

    const realizarPedido = async () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        const pedido = {
            codigo_cpr: usuario.codigo_cpr, // lo necesitas incluir al registrar comprador
            compras: carrito
        };

        const r = await fetch("http://localhost:3000/api/compras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        const datos = await r.json();

        if (r.ok) {
            alert("Pedido generado correctamente");
            setCarrito([]);
        } else {
            alert("Error: " + datos.error);
        }
    };

    const irPedidos = () => {
        window.location.href = "/mis-pedidos";
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Bienvenido, {usuario.nombre}</h1>

            <button onClick={irPedidos} style={{ marginBottom: "20px", padding: "10px" }}>
                Ver mis pedidos
            </button>

            <h2>Especies disponibles</h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px"
            }}>
                {especies.map(e => (
                    <div key={e.id_epe} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
                        <h3>{e.nombre}</h3>
                        <p>Tipo: {e.id_tpo?.nombre}</p>
                        <p>Precio/Kilo: <b>${e.id_lte?.precio_kilo_salida}</b></p>

                        <input
                            type="number"
                            min="1"
                            placeholder="Kilos"
                            id={`kilos-${e.id_epe}`}
                        />

                        <button
                            onClick={() => {
                                const kilos = Number(document.getElementById(`kilos-${e.id_epe}`).value);
                                agregarCarrito(e, kilos);
                            }}
                            style={{ marginTop: "10px", padding: "8px", width: "100%" }}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                ))}
            </div>

            {carrito.length > 0 && (
                <div style={{ marginTop: "30px" }}>
                    <h2>Carrito</h2>
                    <ul>
                        {carrito.map((c, i) => (
                            <li key={i}>
                                {c.nombre} — {c.kilos} kg — Total: ${c.precio_total}
                            </li>
                        ))}
                    </ul>

                    <button onClick={realizarPedido} style={{ padding: "10px", marginTop: "10px", background: "green", color: "white" }}>
                        Realizar Pedido
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserPanel;
