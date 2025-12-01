import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const [vista, setVista] = useState('ventas');
    const [datos, setDatos] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(true);
    
    // ESTADO PARA EL MODAL DE DETALLES
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        cargarDatos();
    }, [vista]);

    const cargarDatos = async () => {
        setDatos([]); 
        try {
            let url = '';
            // URLs apuntando a tu servidor en Render
            if (vista === 'ventas') url = 'https://proyectofinal-ncbf.onrender.com/api/compras-admin';
            if (vista === 'compradores') url = 'https://proyectofinal-ncbf.onrender.com/api/compradores';
            if (vista === 'inventario') url = 'https://proyectofinal-ncbf.onrender.com/api/especies'; 

            const respuesta = await fetch(url);
            if (respuesta.ok) {
                const data = await respuesta.json();
                setDatos(data);
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    // Función para abrir el modal (solo si estamos en vista de ventas)
    const clickFila = (item) => {
        if (vista === 'ventas') {
            setPedidoSeleccionado(item);
        }
    };

    return (
        <div style={styles.container}>
            
            {/* --- MENÚ LATERAL --- */}
            <div style={{ ...styles.sidebar, width: menuAbierto ? '250px' : '70px' }}>
                <div style={styles.menuHeader}>
                    {menuAbierto && <h2 style={styles.logo}>Lonja ⚓</h2>}
                    <button onClick={() => setMenuAbierto(!menuAbierto)} style={styles.toggleBtn}>
                        {menuAbierto ? '◀' : '☰'}
                    </button>
                </div>
                
                <div style={styles.menuItemsContainer}>
                    <BotonMenu activo={vista === 'ventas'} icon="📊" label="Ventas" abierto={menuAbierto} onClick={() => setVista('ventas')} />
                    <BotonMenu activo={vista === 'compradores'} icon="👥" label="Compradores" abierto={menuAbierto} onClick={() => setVista('compradores')} />
                    <BotonMenu activo={vista === 'inventario'} icon="🐟" label="Inventario" abierto={menuAbierto} onClick={() => setVista('inventario')} />
                </div>

                <div style={styles.logoutContainer}>
                    <BotonMenu activo={false} icon="🚪" label="Salir" abierto={menuAbierto} onClick={cerrarSesion} esLogout={true} />
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div style={styles.mainContent}>
                <h2 style={styles.pageTitle}>
                    {vista === 'ventas' && 'Reporte de Ventas (Clic para detalles)'}
                    {vista === 'compradores' && 'Directorio de Compradores'}
                    {vista === 'inventario' && 'Gestión de Inventario'}
                </h2>

                <div style={styles.tableWrapper}>
                    {datos.length === 0 ? (
                        <p style={{textAlign: 'center', padding: 20}}>Cargando datos o tabla vacía...</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {vista === 'ventas' && (
                                        <>
                                            <th style={styles.th}>ID</th>
                                            <th style={styles.th}>Comprador</th>
                                            <th style={styles.th}>Producto</th>
                                            <th style={styles.th}>Total</th>
                                            <th style={styles.th}>Fecha</th>
                                        </>
                                    )}
                                    {vista === 'compradores' && (
                                        <>
                                            <th style={styles.th}>Código</th>
                                            <th style={styles.th}>Nombre</th>
                                            <th style={styles.th}>Dirección</th>
                                            <th style={styles.th}>Correo</th>
                                        </>
                                    )}
                                    {vista === 'inventario' && (
                                        <>
                                            <th style={styles.th}>Especie</th>
                                            <th style={styles.th}>Tipo</th>
                                            <th style={styles.th}>Lote</th>
                                            <th style={styles.th}>Kilos</th>
                                            <th style={styles.th}>Precio</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {datos.map((item, index) => (
                                    <tr 
                                        key={index} 
                                        onClick={() => clickFila(item)}
                                        style={{
                                            cursor: vista === 'ventas' ? 'pointer' : 'default',
                                            backgroundColor: 'white',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => { if(vista==='ventas') e.currentTarget.style.background = '#f0f8ff' }}
                                        onMouseLeave={(e) => { if(vista==='ventas') e.currentTarget.style.background = 'white' }}
                                    >
                                        {vista === 'ventas' && (
                                            <>
                                                <td style={styles.td}>{item.id_cmp || item._id?.slice(-4)}</td>
                                                <td style={styles.td}>
                                                    {item.comprador_relacionado ? item.comprador_relacionado.nombre : 'Eliminado'}
                                                </td>
                                                <td style={styles.td}>{item.nombre_especie || 'N/A'}</td>
                                                <td style={styles.td}>${item.precio_total?.toLocaleString()}</td>
                                                <td style={styles.td}>{new Date(item.fecha).toLocaleDateString()}</td>
                                            </>
                                        )}
                                        {vista === 'compradores' && (
                                            <>
                                                <td style={styles.td}>{item.codigo_cpr}</td>
                                                <td style={styles.td}>{item.nombre} {item.apellido_paterno}</td>
                                                <td style={styles.td}>{item.direccion}</td>
                                                <td style={styles.td}>{item.correo}</td>
                                            </>
                                        )}
                                        {vista === 'inventario' && (
                                            <>
                                                <td style={styles.td}>{item.nombre}</td>
                                                <td style={styles.td}>{item.id_tpo?.nombre}</td>
                                                <td style={styles.td}>#{item.id_lte?.id_lte}</td>
                                                <td style={styles.td}>{item.id_lte?.kilos} kg</td>
                                                <td style={styles.td}>${item.id_lte?.precio_kilo_salida}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- MODAL (VENTANA EMERGENTE) DE DETALLES --- */}
            {pedidoSeleccionado && (
                <div style={styles.modalOverlay} onClick={() => setPedidoSeleccionado(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{color: '#023e8a', borderBottom: '2px solid #eee', paddingBottom: 10}}>
                            📦 Detalle del Pedido
                        </h2>
                        
                        <div style={styles.detalleGrid}>
                            <p><strong>ID Venta:</strong> {pedidoSeleccionado.id_cmp}</p>
                            <p><strong>Fecha:</strong> {new Date(pedidoSeleccionado.fecha).toLocaleString()}</p>
                            
                            <p><strong>Comprador:</strong> {pedidoSeleccionado.comprador_relacionado?.nombre} {pedidoSeleccionado.comprador_relacionado?.apellido_paterno}</p>
                            <p><strong>Dirección:</strong> {pedidoSeleccionado.comprador_relacionado?.direccion}</p>
                            
                            <hr style={{gridColumn: '1 / -1', width: '100%', border: 'none', borderTop: '1px dashed #ccc'}} />
                            
                            <p style={{fontSize: '18px', color: '#0077b6'}}>
                                <strong>Producto:</strong> {pedidoSeleccionado.nombre_especie || 'Desconocido'}
                            </p>
                            <p><strong>Cantidad:</strong> {pedidoSeleccionado.kilos || 0} Kg</p>
                            
                            <p><strong>Precio x Kilo:</strong> ${pedidoSeleccionado.precio_kilo_final}</p>
                            <p style={{fontSize: '20px', fontWeight: 'bold', color: '#2a9d8f'}}>
                                <strong>Total: ${pedidoSeleccionado.precio_total?.toLocaleString()}</strong>
                            </p>
                        </div>

                        <button onClick={() => setPedidoSeleccionado(null)} style={styles.closeBtn}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

const BotonMenu = ({ activo, icon, label, abierto, onClick, esLogout }) => {
    return (
        <button 
            onClick={onClick}
            style={{
                ...styles.menuItem,
                backgroundColor: esLogout ? '#d00000' : (activo ? 'rgba(255,255,255,0.2)' : 'transparent'),
                justifyContent: abierto ? 'flex-start' : 'center',
                padding: abierto ? '12px 15px' : '12px 0',
            }}
            title={label}
        >
            <span style={{ fontSize: '20px', marginRight: abierto ? '10px' : '0' }}>{icon}</span>
            {abierto && <span style={styles.label}>{label}</span>}
        </button>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', background: '#f4f6f9', overflow: 'hidden' },
    sidebar: { background: '#023e8a', color: 'white', display: 'flex', flexDirection: 'column', padding: '10px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', transition: 'width 0.3s ease', whiteSpace: 'nowrap', overflow: 'hidden' },
    menuHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', height: '40px' },
    logo: { fontSize: '20px', margin: 0, paddingLeft: '10px' },
    toggleBtn: { background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', margin: '0 auto' },
    menuItemsContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
    menuItem: { color: 'white', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', transition: '0.2s', width: '100%', overflow: 'hidden' },
    label: { fontSize: '16px' },
    logoutContainer: { marginTop: 'auto' },
    mainContent: { flex: 1, padding: '30px', overflowY: 'auto' },
    pageTitle: { color: '#023e8a', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
    
    /* --- TABLA RESPONSIVA (Aquí está la magia para celular) --- */
    tableWrapper: { 
        background: 'white', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        padding: '20px',
        overflowX: 'auto', // Permite deslizar horizontalmente
        WebkitOverflowScrolling: 'touch', // Suavidad en iPhone
        width: '100%',
        boxSizing: 'border-box'
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse', 
        minWidth: '600px' // Fuerza el ancho para que no se aplaste
    },
    th: { background: '#0077b6', color: 'white', padding: '12px', textAlign: 'left', whiteSpace: 'nowrap' },
    td: { padding: '12px', borderBottom: '1px solid #eee', color: '#555' },

    /* --- ESTILOS DEL MODAL --- */
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modalContent: {
        background: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '400px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s'
    },
    detalleGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px'
    },
    closeBtn: {
        marginTop: '20px', width: '100%', padding: '10px', background: '#333',
        color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px'
    }
};

export default AdminPanel;