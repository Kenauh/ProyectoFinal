import { useEffect, useState } from "react";

function MisPedidos() {
    const [compras, setCompras] = useState([]);
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        const r = await fetch(`http://localhost:3000/api/compras/${usuario.codigo_cpr}`);
        const datos = await r.json();

        // Asegurar que compras sea siempre arreglo
        setCompras(Array.isArray(datos) ? datos : []);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Mis pedidos</h1>

            {compras.length === 0 ? (
                <p>No has realizado compras aún.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Precio/Kilo</th>
                            <th>Total</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.map(c => (
                            <tr key={c.id_cmp}>
                                <td>{c.id_cmp}</td>
                                <td>${c.precio_kilo_final}</td>
                                <td>${c.precio_total}</td>
                                <td>{new Date(c.fecha).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MisPedidos;
