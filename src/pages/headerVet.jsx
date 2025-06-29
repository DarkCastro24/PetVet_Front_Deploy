
import React from 'react';
import { useState } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import logoHeader from '../assets/images/logoHeaderWhite.png';
import "bootstrap/dist/css/bootstrap.min.css";
import '../assets/styles/main.scss';

const HeaderVet = ({ userName = 'Usuario', onToggleSidebar, userType }) => {

  const [showLogoutModal, setShowLogoutModal] = useState(false);
const navigate = useNavigate();

const handleAvatarClick = () => {
  setShowLogoutModal(true);
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  localStorage.removeItem('admin_type_id');
  localStorage.removeItem('role_id');
  localStorage.removeItem('user');
  
  const loginRoute = userType === 'admin' ? '/admin/login' : '/';
  navigate(loginRoute, { replace: true });
};

return (
  <>
    <header className={`app-header d-flex align-items-center justify-content-between px-4 ${userType === 'vet' ? 'vet-header' : 'admin-header'}`}>
      <button
        className="menu-toggle d-md-none"
        onClick={onToggleSidebar}
        aria-label="Abrir menú"
      >
        <FaBars size={24} />
      </button>

      <img
        src={logoHeader}
        alt="Logo VetiCare"
        width="200"
        height="auto"
        className="imagenLogoHeader"
      />
      <div className="app-header__user d-flex align-items-center">
        <span className="app-header__username">{userName}</span>
        <FaUserCircle
          size={28}
          className="app-header__avatar cursor-pointer"
          onClick={handleAvatarClick}
        />

      </div>
    </header>

    <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cerrar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro que deseas cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
  </>
); };

export default HeaderVet;
