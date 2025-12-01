/* Archivo: client/src/App.jsx */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminPanel from './AdminPanel';
import UserPanel from './UserPanel';
import MisPedidos from "./MisPedidos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/comprar" element={<UserPanel />} />
        {/* Si ponen una ruta rara, regresarlos al login */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;