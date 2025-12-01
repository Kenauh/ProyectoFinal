import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const r = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contraseña: password })
            });

            const datos = await r.json();

            if (!r.ok) {
                setError(datos.mensaje || "Error al iniciar sesión");
                return;
            }

            localStorage.setItem("usuario", JSON.stringify(datos));

            if (datos.rol === "admin") navigate("/admin");
            else navigate("/comprar");

        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <strong style={styles.headerLeft}>LOGIN</strong>
                <strong style={styles.headerRight}>SISTEMA LONJA</strong>
            </header>

            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Bienvenido</h2>

                    <form onSubmit={manejarLogin} style={styles.form}>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            style={styles.input}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />

                        {error && <p style={styles.error}>{error}</p>}

                        <button type="submit" style={styles.btnBlue}>
                            Entrar
                        </button>

                        <p
                            style={styles.registerLink}
                            onClick={() => navigate("/register")}
                        >
                            Crear cuenta
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ================================
   ESTILOS
================================= */
const styles = {
    page: {
        background: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif"
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

    container: {
        display: "flex",
        justifyContent: "center",
        marginTop: 60
    },

    card: {
        background: "white",
        padding: "30px",
        borderRadius: 12,
        width: "330px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
    },

    title: {
        textAlign: "center",
        fontSize: "24px",
        marginBottom: "20px",
        color: "#023e8a",
        fontWeight: "bold"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    input: {
        padding: "12px",
        borderRadius: 6,
        border: "1px solid #ccc",
        fontSize: "16px"
    },

    btnBlue: {
        background: "#0077b6",
        color: "white",
        border: "none",
        padding: "12px",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "5px"
    },

    registerLink: {
        marginTop: "10px",
        textAlign: "center",
        color: "#0077b6",
        cursor: "pointer",
        fontWeight: "bold",
        textDecoration: "underline"
    },

    error: {
        color: "red",
        fontSize: "14px",
        textAlign: "center"
    }
};

export default Login;
