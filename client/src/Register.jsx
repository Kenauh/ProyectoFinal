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

        const r = await fetch("http://localhost:3000/api/register", {
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
                <strong style={styles.headerRight}>SISTEMA LONJA</strong>
            </header>

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

/* ESTILOS (mismos que LOGIN) */
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
        marginTop: 50
    },

    card: {
        background: "white",
        padding: "30px",
        borderRadius: 12,
        width: "350px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
    },

    title: {
        textAlign: "center",
        marginBottom: 20,
        color: "#023e8a",
        fontSize: "24px",
        fontWeight: "bold"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    input: {
        padding: "12px",
        borderRadius: 6,
        border: "1px solid #ccc",
        fontSize: "15px"
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
        cursor: "pointer",
        color: "#0077b6",
        fontWeight: "bold",
        textDecoration: "underline"
    },

    error: {
        color: "red",
        textAlign: "center",
        fontSize: "14px"
    }
};

export default Register;
