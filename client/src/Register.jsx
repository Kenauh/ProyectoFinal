import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        direccion: "",
        correo: "",
        contraseña: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const registrar = async (e) => {
        e.preventDefault();
        setError("");

        const r = await fetch("https://proyectofinal-ncbf.onrender.com/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await r.json();

        if (!r.ok) {
            setError(data.mensaje);
            return;
        }

        alert("Cuenta creada correctamente ✔");
        navigate("/");
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <strong style={styles.headerLeft}>REGISTRO</strong>
                <strong style={styles.headerRight}>SISTEMA LONJA ⚓</strong>
            </header>

            {/* === CONTENEDOR CENTRADO === */}
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Crear cuenta</h2>

                    <form onSubmit={registrar} style={styles.form}>
                        <input name="nombre" placeholder="Nombre" onChange={handleChange} style={styles.input} required />
                        <input name="apellido_paterno" placeholder="Apellido paterno" onChange={handleChange} style={styles.input} required />
                        <input name="apellido_materno" placeholder="Apellido materno" onChange={handleChange} style={styles.input} required />
                        <input name="direccion" placeholder="Dirección" onChange={handleChange} style={styles.input} required />

                        <input name="correo" type="email" placeholder="Correo" onChange={handleChange} style={styles.input} required />
                        <input name="contraseña" type="password" placeholder="Contraseña" onChange={handleChange} style={styles.input} required />

                        {error && <p style={styles.error}>{error}</p>}

                        <button type="submit" style={styles.btnBlue}>Registrar</button>

                        <p style={styles.registerLink} onClick={() => navigate("/")}>
                            ¿Ya tienes cuenta? Iniciar sesión
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
        flexDirection: "column"
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

    /* === CENTRAR VERTICAL + HORIZONTAL === */
    container: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "60px"
    },

    /* === TARJETA AZUL === */
    card: {
        background: "rgba(0, 119, 182, 0.92)",
        padding: "35px",
        borderRadius: 12,
        width: "360px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        color: "white"
    },

    title: {
        textAlign: "center",
        marginBottom: 20,
        fontSize: "24px",
        fontWeight: "bold",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    input: {
        padding: "12px",
        borderRadius: 6,
        border: "none",
        fontSize: "15px"
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
        cursor: "pointer",
        color: "white",
        fontWeight: "bold",
        textDecoration: "underline"
    },

    error: {
        color: "#ffcccc",
        textAlign: "center",
        fontSize: "14px"
    }
};

export default Register;
