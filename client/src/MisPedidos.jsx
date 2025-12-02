import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MisPedidos() {
    const [compras, setCompras] = useState([]);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const navigate = useNavigate();

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        try {
            const r = await fetch(
                `https://proyectofinal-ncbf.onrender.com/api/compras/${usuario.codigo_cpr}`
            );
            const datos = await r.json();
            setCompras(datos);
        } catch (error) {
            console.error("Error cargando pedidos:", error);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>SISTEMA LONJA ⚓</div>

                <button
                    style={styles.headerBtnCenter}
                    onClick={() => navigate("/comprar")}
                >
                    Tienda
                </button>

                <button
                    style={styles.headerBtnRight}
                    onClick={cerrarSesion}
                >
                    Cerrar sesión 🚪
                </button>
            </header>

            <div style={styles.content}>
                <h2 style={styles.title}>Mis pedidos</h2>

                <div style={styles.tableWrapper}>
                    {compras.length === 0 ? (
                        <p style={styles.noData}>No has realizado compras aún.</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Producto</th>
                                    <th style={styles.th}>Precio/Kilo</th>
                                    <th style={styles.th}>Total</th>
                                    <th style={styles.th}>Fecha</th>
                                </tr>
                            </thead>

                            <tbody>
                                {compras.map((c) => (
                                    <tr key={c.id_cmp}>
                                        <td style={styles.td}>
                                            {c.nombre_especie || "Variado"}
                                            <br />
                                            <small style={{ color: "#666" }}>
                                                ({c.kilos} kg)
                                            </small>
                                        </td>
                                        <td style={styles.td}>${c.precio_kilo_final}</td>
                                        <td style={styles.td}>
                                            ${c.precio_total?.toLocaleString()}
                                        </td>
                                        <td style={styles.td}>
                                            {new Date(c.fecha).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        background: "#f5f6fa",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box"
    },

    header: {
        width: "100%",
        background: "#023e8a",
        color: "white",
        padding: "12px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxSizing: "border-box"
    },

    headerLeft: {
        fontWeight: "bold",
        fontSize: "20px",
    },

    headerBtnCenter: {
        background: "#0077b6",
        padding: "10px 18px",
        border: "none",
        borderRadius: 6,
        color: "white",
        fontSize: "15px",
        cursor: "pointer",
    },

    headerBtnRight: {
        background: "#d00000",
        padding: "10px 18px",
        border: "none",
        borderRadius: 6,
        color: "white",
        fontSize: "15px",
        cursor: "pointer",
    },

    content: {
        width: "100%",
        padding: "20px 25px",
        boxSizing: "border-box"
    },

    title: {
        textAlign: "center",
        marginTop: 15,
        fontSize: "26px",
        fontWeight: "bold",
        color: "#023e8a",
    },

    tableWrapper: {
        width: "100%",
        maxWidth: "1000px",
        margin: "30px auto",
        background: "white",
        borderRadius: 10,
        overflowX: "auto",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        boxSizing: "border-box"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "600px",
    },

    th: {
        padding: "12px",
        background: "#023e8a",
        color: "white",
        fontWeight: "bold",
        whiteSpace: "nowrap",
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #ddd",
        fontSize: "15px",
        textAlign: "center",
    },

    noData: {
        padding: "20px",
        textAlign: "center",
        fontSize: "18px",
        color: "#555",
    },
};

export default MisPedidos;
