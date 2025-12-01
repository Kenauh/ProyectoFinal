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
            // URL de producción (Render)
            const r = await fetch(`https://proyectofinal-ncbf.onrender.com/api/compras/${usuario.codigo_cpr}`);
            const datos = await r.json();
            setCompras(datos);
        } catch (error) {
            console.error("Error cargando pedidos:", error);
        }
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <strong style={styles.headerLeft}>PEDIDOS</strong>
                <strong style={styles.headerRight}>SISTEMA LONJA</strong>
            </header>

            {/* BOTÓN SUPERIOR */}
            <div style={styles.buttons}>
                <button onClick={() => navigate("/comprar")} style={styles.btnBlue}>
                    ← Regresar a compras
                </button>
            </div>

            <h2 style={styles.title}>Mis pedidos</h2>

            {/* TABLA CON SCROLL HORIZONTAL (Responsive) */}
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
                                        {c.nombre_especie || 'Variado'} <br/>
                                        <small style={{color:'#666'}}>({c.kilos} kg)</small>
                                    </td>
                                    <td style={styles.td}>${c.precio_kilo_final}</td>
                                    <td style={styles.td}>${c.precio_total?.toLocaleString()}</td>
                                    <td style={styles.td}>{new Date(c.fecha).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

/* ================================
   ESTILOS RESPONSIVOS
================================= */
const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        background: "#f5f6fa",
        minHeight: "100vh",
        paddingBottom: "40px"
    },

    /* ==== HEADER ==== */
    header: {
        background: "#023e8a",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "20px"
    },

    headerLeft: { fontWeight: "bold" },
    headerRight: { fontWeight: "bold", fontSize: "14px" },

    /* ==== TÍTULO ==== */
    title: {
        textAlign: "center",
        marginTop: 25,
        fontSize: "26px",
        fontWeight: "bold",
        color: "#023e8a"
    },

    /* ==== BOTÓN SUPERIOR ==== */
    buttons: {
        display: "flex",
        justifyContent: "center",
        marginTop: 20
    },

    btnBlue: {
        background: "#0077b6",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: "15px"
    },

    /* ==== TABLA RESPONSIVA (Aquí está la magia) ==== */
    tableWrapper: {
        // En celular usa casi todo el ancho (95%), en PC se limita a 1000px
        width: "95%",
        maxWidth: "1000px",
        margin: "30px auto",
        
        // Esto permite el scroll horizontal
        display: "block", 
        overflowX: "auto", 
        
        background: "white",
        borderRadius: 10,
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
        // Esto fuerza a la tabla a no aplastarse, activando el scroll
        minWidth: "600px" 
    },

    th: {
        padding: "12px",
        background: "#023e8a",
        color: "white",
        fontWeight: "bold",
        fontSize: "16px",
        whiteSpace: "nowrap" // Evita que los títulos se partan
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #ddd",
        fontSize: "15px"
    },

    noData: {
        textAlign: "center",
        width: "100%",
        fontSize: "18px",
        color: "#555",
        padding: "20px"
    }
};

export default MisPedidos;