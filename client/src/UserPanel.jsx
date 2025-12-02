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
        try {
            const r = await fetch("https://proyectofinal-ncbf.onrender.com/api/especies");
            const datos = await r.json();
            setEspecies(datos);
        } catch (error) {
            console.error("Error cargando especies:", error);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    const agregarCarrito = (especie, kilos) => {
        if (!kilos || kilos <= 0) {
            alert("⚠️ Ingresa una cantidad de kilos válida.");
            return;
        }

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
            alert("❗ El carrito está vacío");
            return;
        }

        const pedido = {
            codigo_cpr: usuario.codigo_cpr,
            compras: carrito
        };

        try {
            const res = await fetch("https://proyectofinal-ncbf.onrender.com/api/compras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido)
            });

            if (res.ok) {
                alert("Pedido realizado correctamente ✔");
                setCarrito([]);
            } else {
                alert("Error al registrar el pedido");
            }
        } catch (error) {
            alert("❌ Error de conexión");
        }
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>SISTEMA LONJA ⚓</div>

                <button
                    style={styles.headerBtnCenter}
                    onClick={() => navigate("/mis-pedidos")}
                >
                    Mis pedidos
                </button>

                <button style={styles.headerBtnRight} onClick={cerrarSesion}>
                    Cerrar sesión 🚪
                </button>
            </header>

            <div style={styles.mainContent}>
                <h2 style={styles.pageTitle}>Especies disponibles</h2>

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

                {carrito.length > 0 && (
                    <div style={styles.carrito}>
                        <h2>Carrito ({carrito.length})</h2>

                        {carrito.map((c, i) => (
                            <div key={i} style={{ marginBottom: "5px" }}>
                                {c.nombre} — {c.kilos} kg — <b>${c.precio_total.toLocaleString()}</b>
                            </div>
                        ))}

                        <button onClick={realizarPedido} style={styles.btnGreen}>
                            Realizar pedido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        background: "#f4f6f9",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        width: "100%"
    },

    header: {
        width: "100%",
        background: "#023e8a",
        color: "white",
        padding: "12px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 10
    },

    headerLeft: {
        fontSize: "20px",
        fontWeight: "bold"
    },

    headerBtnCenter: {
        background: "#0077b6",
        padding: "10px 18px",
        border: "none",
        borderRadius: 6,
        color: "white",
        cursor: "pointer",
        fontSize: "15px"
    },

    headerBtnRight: {
        background: "#d00000",
        padding: "10px 18px",
        border: "none",
        borderRadius: 6,
        color: "white",
        cursor: "pointer",
        fontSize: "15px"
    },

    mainContent: {
        padding: "0px 25px",
        width: "100%",
        boxSizing: "border-box"
    },

    pageTitle: {
        color: "#023e8a",
        marginBottom: 20,
        fontSize: "26px",
        borderBottom: "2px solid #ddd",
        paddingBottom: 10
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20,
        paddingBottom: 40,
        width: "100%"
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
        width: "90%",
        padding: 8,
        borderRadius: 5,
        border: "1px solid #ccc"
    },

    carrito: {
        marginTop: 30,
        padding: 20,
        background: "white",
        borderRadius: 10,
        width: "90%",
        maxWidth: 450,
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
        width: "100%",
        borderRadius: 5,
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: 20
    }
};

export default UserPanel;
