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
            const r = await fetch("https://proyectofinal-ncbf.onrender.com/api/login", {
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
            <header style={styles.header}>
                <strong style={styles.headerLeft}>SISTEMA LONJA ⚓</strong>
                <strong style={styles.headerRight}>LOGIN</strong>
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

const styles = {
    page: {
        background: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
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
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "60px",
    },

    card: {
        background: "rgba(0, 119, 182, 0.92)",
        padding: "35px",
        borderRadius: 12,
        width: "330px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        color: "white"
    },

    title: {
        textAlign: "center",
        fontSize: "24px",
        marginBottom: "20px",
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
        border: "none",
        fontSize: "16px"
    },

    btnBlue: {
        background: "#03045e",
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
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
        textDecoration: "underline"
    },

    error: {
        color: "#ffcccc",
        fontSize: "14px",
        textAlign: "center"
    }
};

export default Login;
