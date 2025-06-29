import React, { useState, useEffect, useCallback } from 'react';
import Layout from './layout';
import Modal from '../components/admin-edit-modal';
import CreateAdminForm from '../components/createAdminForm';
import SearchBox from '../components/search-box';
import AdminTable from './adminTable';
import UpdateAdminForm from '../components/updateAdminForm';
import { menuItemsAdmin, superAdminMenuItems } from '../config/layout/sidebar';
import DetailAdminInfo from '../components/detailAdminInfo';

const API_URL = import.meta.env.VITE_API_URL;
const SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET;

export default function RootAddAdmin() {
  const token = localStorage.getItem('token');

  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateId, setDeactivateId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [createForm, setCreateForm] = useState({
    full_name: '',
    username: '',
    dui: '',
    phone: '',
    email: '',
    admin_type_id: ''
  });

  const [updateForm, setUpdateForm] = useState({
    id: '',
    username: '',
    phone: '',
    email: '',
    status_id: ''
  });
  const [updateError, setUpdateError] = useState('');

  const adminTypes = [
    { id: 1, name: 'Root' },
    { id: 2, name: 'Admin' }
  ];

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admins`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'X-Admin-Secret': SECRET_KEY
        }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreateAdmin = async newAdmin => {
    try {
      const res = await fetch(`${API_URL}/api/admins/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          'X-Admin-Secret': SECRET_KEY
        },
        body: JSON.stringify(newAdmin)
      });
      if (!res.ok) throw new Error(await res.text());
      setShowCreateModal(false);
      setCreateForm({
        full_name: '',
        username: '',
        dui: '',
        phone: '',
        email: '',
        admin_type_id: ''
      });
      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateAdmin = async form => {
    setUpdateError('');
    try {
      const res = await fetch(`${API_URL}/api/admins/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          'X-Admin-Secret': SECRET_KEY
        },
        body: JSON.stringify({
          full_name: form.full_name,
          username: form.username,
          phone: form.phone,
          email: form.email,
          status_id: Number(form.status_id)
        })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      setShowUpdateModal(false);
      await fetchAdmins();
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  const openUpdate = id => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;
    setUpdateError('');
    setUpdateForm({
      id: admin.id,
      full_name: admin.full_name,
      username: admin.username,
      phone: admin.phone,
      email: admin.email,
      status_id: Number(admin.status_id)
    });
    setShowUpdateModal(true);
  };

  async function handleOpenDetail(id) {
    try {
      const res = await fetch(`${API_URL}/api/admins/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'X-Admin-Secret': SECRET_KEY
        }
      });
      const data = await res.json();
      setDetailData(data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error al cargar detalle de administrador:', err);
    }
  }

  const handleDeactivate = id => {
    setDeactivateId(id);
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admins/${deactivateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          'X-Admin-Secret': SECRET_KEY
        },
        body: JSON.stringify({ status_id: 2 })
      });
      if (!res.ok) throw new Error(await res.text());
      setShowDeactivateModal(false);
      setDeactivateId(null);
      await fetchAdmins();
    } catch (err) {
      console.error('Error al desactivar administrador:', err);
    }
  };

  const cancelDeactivate = () => {
    setShowDeactivateModal(false);
    setDeactivateId(null);
  };

  const adminColumns = ['Nombre', 'Username', 'Correo', 'Tipo', 'Estado', 'Ver'];

  const rows = admins.map((a, i) => ({
    id: a.id,
    Nombre: a.full_name,
    Username: a.username,
    Correo: a.email,
    Tipo: a.admin_type.name,
    Estado: a.status_id === 1 ? 'Activo' : 'Inactivo',
    Ver: (
      <button
        onClick={() => handleOpenDetail(a.id)}
        style={{
          backgroundColor: '#374f59',
          color: '#fff',
          border: 'none',
          margin: '1rem',
          borderRadius: '0.25rem',
        }}
      >
        Detalles
      </button>
    )
  }));
  const filteredRows = rows.filter(r =>
    r.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout menuItems={superAdminMenuItems} userType="admin">
      <div id="admin-main-container">
        <h2 style={{
          height: '3rem', 
          width: '400px', 
          color: '#374f59',
          margin: '0.5rem 0 0.5rem 1rem', 
          border: 'none',
          borderRadius: '50px', 
          fontSize: '3rem', 
          fontWeight: 600
        }}>
          Administradores
        </h2>

        <SearchBox onSearch={setSearchTerm} placeholder="Buscar" />

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: '#374f59',
            height: '3rem',
            width: '350px',
            color: '#fff',
            margin: '0.5rem 1rem',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Crear Administrador
        </button>

        {loading && <p>Cargando administradores…</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <AdminTable rows={filteredRows} columns={adminColumns}
            onEdit={openUpdate}
            onDelete={handleDeactivate}
          />
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        >
          <CreateAdminForm
            form={createForm}
            setForm={setCreateForm}
            adminTypes={adminTypes}
            onSubmit={handleCreateAdmin}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>

        <Modal isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}>
          <DetailAdminInfo data={detailData} />
        </Modal>

        <Modal isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}>
          {updateError && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              {updateError}
            </div>
          )}
          <UpdateAdminForm form={updateForm}
            setForm={setUpdateForm}
            onSubmit={handleUpdateAdmin}/>
        </Modal>

        <Modal isOpen={showDeactivateModal} onClose={cancelDeactivate}>
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p>¿Deseas marcar este administrador como inactivo?</p>
            <div style={{
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem'}}>
               <button
                onClick={confirmDeactivate}
                style={{
                  backgroundColor: '#374f59',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Aceptar
              </button>
              <button onClick={cancelDeactivate} style={{
                  backgroundColor: '#6c757d', 
                  color: '#fff',
                  border: 'none', 
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem', 
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
