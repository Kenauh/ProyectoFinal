import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Petición al Backend
      const respuesta = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña: password })
      });

      // Intentamos leer la respuesta del servidor
      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Guardar sesión (opcional)
        localStorage.setItem('usuario', JSON.stringify(datos));
        
        // Redireccionar según rol
        if (datos.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/comprar');
        }
      } else {
        // Si el usuario/contraseña están mal
        setError(datos.mensaje || 'Error al iniciar sesión');
      }
    } catch (err) {
      // Si el servidor está apagado
      console.error(err);
      setError('Error de conexión: Asegúrate de que el Backend esté corriendo en el puerto 3000');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{textAlign: 'center', color: '#333'}}>Sistema Lonja</h2>
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
          {error && <p style={{color: 'red', textAlign: 'center', fontSize: '14px'}}>{error}</p>}
          <button type="submit" style={styles.button}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' },
  button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default Login;