import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const [compras, setCompras] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/compras');
            if (respuesta.ok) {
                const datos = await respuesta.json();
                setCompras(datos);
            }
        } catch (error) {
            console.error("Error cargando compras:", error);
        }
    };

    const cerrarSesion = () => {
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Panel de Administrador 👨‍💼</h1>
                <button onClick={cerrarSesion} style={styles.logoutBtn}>Salir</button>
            </header>

            <div style={styles.content}>
                <h3>Reporte de Ventas Diarias</h3>
                
                {compras.length === 0 ? (
                    <p>No hay ventas registradas aún.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID Venta</th>
                                <th style={styles.th}>Comprador</th>
                                <th style={styles.th}>Precio/Kilo</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compras.map((venta) => (
                                <tr key={venta._id}>
                                    <td style={styles.td}>{venta.id_cmp}</td>
                                    <td style={styles.td}>
                                        {venta.comprador_relacionado ? 
                                            `${venta.comprador_relacionado.nombre} ${venta.comprador_relacionado.apellido_paterno}` 
                                            : 'Desconocido'}
                                    </td>
                                    <td style={styles.td}>${venta.precio_kilo_final}</td>
                                    <td style={styles.td}>${venta.precio_total}</td>
                                    <td style={styles.td}>{new Date(venta.fecha).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// Estilos CSS
const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' },
    // CORRECCIÓN AQUÍ: 'white' ahora tiene comillas
    logoutBtn: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
    content: { marginTop: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' },
    td: { border: '1px solid #ddd', padding: '8px' }
};

export default AdminPanel;