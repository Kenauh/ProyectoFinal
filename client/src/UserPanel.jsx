import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserPanel() {
    const [especies, setEspecies] = useState([]);
    const [carrito, setCarrito] = useState([]);

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const navigate = useNavigate();

    useEffect(() => {
        cargarEspecies();
    }, []);

    const cargarEspecies = async () => {
        const r = await fetch("https://proyectofinal-ncbf.onrender.com/api/especies");
        const datos = await r.json();
        setEspecies(datos);
    };

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    const agregarCarrito = (especie, kilos) => {
        if (kilos <= 0) return;

        const precioKilo = especie.id_lte?.precio_kilo_salida || 0;
        const total = kilos * precioKilo;

        const nuevo = {
            id_cmp: Math.floor(Math.random() * 999999),
            nombre: especie.nombre,
            kilos,
            precio_kilo_final: precioKilo,
            precio_total: total
        };

        setCarrito([...carrito, nuevo]);
        alert("Añadido al carrito ✔");
    };

    const realizarPedido = async () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        const pedido = {
            codigo_cpr: usuario.codigo_cpr,
            compras: carrito
        };

        const r = await fetch("https://proyectofinal-ncbf.onrender.com/api/compras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        if (r.ok) {
            alert("Pedido generado correctamente ✔");
            setCarrito([]);
        } else {
            alert("Error al registrar pedido");
        }
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <strong style={styles.headerLeft}>VENTA</strong>
                <strong style={styles.headerRight}>SISTEMA LONJA</strong>
            </header>

            {/* BOTÓN SUPERIOR */}
            <div style={styles.topButtons}>
                <button onClick={() => navigate("/mis-pedidos")} style={styles.btnGray}>
                    Ver mis pedidos
                </button>
            </div>

            <h2 style={styles.title}>Especies disponibles</h2>

            {/* GRID DE PECES */}
            <div style={styles.grid}>
                {especies.map(e => (
                    <div key={e.id_epe} style={styles.card}>
                        <img
                            src={`https://proyectofinal-ncbf.onrender.com/img/${e.imagen}`}
                            style={styles.img}
                            alt={e.nombre}
                        />

                        <h3>{e.nombre}</h3>
                        <p><b>Tipo:</b> {e.id_tpo?.nombre}</p>
                        <p><b>Precio/Kilo:</b> ${e.id_lte?.precio_kilo_salida}</p>

                        <input
                            id={`k-${e.id_epe}`}
                            type="number"
                            min="1"
                            placeholder="Kilos"
                            style={styles.input}
                        />

                        <button
                            style={styles.btnBlue}
                            onClick={() => {
                                const kilos = Number(document.getElementById(`k-${e.id_epe}`).value);
                                agregarCarrito(e, kilos);
                            }}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                ))}
            </div>

            {/* CARRITO */}
            {carrito.length > 0 && (
                <div style={styles.carrito}>
                    <h2>Carrito</h2>

                    {carrito.map((c, i) => (
                        <div key={i}>
                            {c.nombre} — {c.kilos} kg — <b>${c.precio_total}</b>
                        </div>
                    ))}

                    <button onClick={realizarPedido} style={styles.btnGreen}>
                        Realizar pedido
                    </button>
                </div>
            )}

            {/* BOTÓN DE CERRAR SESIÓN ABAJO Y CENTRADO */}
            <div style={styles.logoutContainer}>
                <button onClick={cerrarSesion} style={styles.btnRedBottom}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}

/* ================================
   ESTILOS
================================= */
const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        paddingBottom: "60px"
    },

    header: {
        background: "#023e8a",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "20px"
    },

    headerLeft: { fontWeight: "bold" },
    headerRight: { fontWeight: "bold" },

    title: { textAlign: "center", marginTop: 20 },

    topButtons: {
        display: "flex",
        justifyContent: "center",
        marginTop: 20
    },

    grid: {
        padding: 20,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20
    },

    card: {
        background: "white",
        padding: 15,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        textAlign: "center"
    },

    img: {
        width: "100%",
        height: 150,
        objectFit: "cover",
        borderRadius: 10,
        marginBottom: 10
    },

    input: {
        marginTop: 10,
        width: "100%",
        padding: 8,
        borderRadius: 5,
        border: "1px solid #ccc"
    },

    carrito: {
        marginTop: 30,
        padding: 20,
        background: "#f8f9fa",
        borderRadius: 10,
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    },

    btnBlue: {
        background: "#0077b6",
        color: "white",
        border: "none",
        padding: 10,
        width: "100%",
        borderRadius: 5,
        cursor: "pointer",
        marginTop: 10
    },

    btnGreen: {
        background: "#2a9d8f",
        color: "white",
        border: "none",
        padding: 12,
        borderRadius: 5,
        cursor: "pointer",
        marginTop: 20,
        width: "100%"
    },

    btnGray: {
        background: "#6c757d",
        color: "white",
        border: "none",
        padding: 10,
        borderRadius: 5,
        cursor: "pointer",
        minWidth: "150px"
    },

    logoutContainer: {
        marginTop: 40,
        textAlign: "center"
    },

    btnRedBottom: {
        background: "#d00000",
        color: "white",
        border: "none",
        padding: "12px 25px",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: "16px"
    }
};

export default UserPanel;
