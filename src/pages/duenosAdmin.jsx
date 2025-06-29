import Layout from "./layout"
import { menuItemsAdmin } from "../config/layout/sidebar"
import SearchBox from "../components/search-box"
import AdminTable from "./adminTable"
import { useState, useEffect } from "react"
import Modal from "../components/admin-edit-modal"
import EditAppointmentForm from "../components/edit-appointment"
import EditDuenoForm from "../components/edit-duenos"
import AddButton from "../components/add-button"

function DuenosAdmin() {


  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const [isModalOpen, setModalOpen] = useState(false);
  const [ownerToEdit, setOwnerToEdit] = useState(null);
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [error, setError] = useState(null);


  const adminOwnerColumns = [
    , "DUI", "Nombre Completo", "Teléfono", "Correo Electrónico", "Estado"

  ];


  // functions

  async function getData() {
    let index = 0;
    const currentPage = 1;
    const itemsPerPage = 7;
    try {
      const response = await fetch(`${API_URL}/api/users/owners`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }


      const data = await response.json();
      console.log(data)
      const filteredData = data.map((item) => ({

        id: item.id,
        rowNumber: (currentPage - 1) * itemsPerPage + index + 1,
        DUI: item.dui,
        "Nombre Completo": item.full_name,
        Teléfono: item.phone,
        "Correo Electrónico": item.email,
        Estado: item.status_id == 1 ? "Activo" : "Desactivado",





      }));

      console.log('Filtered data:', filteredData);
      setOwners(filteredData);
      setFilteredOwners(filteredData);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);


  const handleSearch = (search) => {
    if (search.trim() === '') {

      setFilteredOwners(owners);
    } else {
      const filtered = filteredOwners.filter((registro) => registro["Nombre Completo"].toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOwners(filtered);
    }
  }

  async function getById(id) {
    try {

      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }

      });



      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to get duenos by id`);
      }


      const result = await response.json();
      console.log('Owner got:', result);
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;

    }
  }




  const handleEdit = async (ownerId) => {
    if (!ownerId) {
      setOwnerToEdit(null);
      setModalOpen(true);
      return;
    }

    try {
      const owner = await getById(ownerId);

      setOwnerToEdit(owner);
      setModalOpen(true);
    } catch (error) {
      console.error("Error loading owner:", error);
      alert("No se pudo cargar la cita para edición.");
    }
  };


  async function deleteOwner(id) {
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log(response.status);

      console.log('Appointment deleted successfully');
      getData();

    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  async function updateOwner(id, updatedData) {
    if (id == null) {
      console.log("updateOwner called with id:", id);

      try {
        const response = await fetch(`${API_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({

            full_name: updatedData.full_name,
            dui: updatedData.dui,
            email: updatedData.email,
            phone: updatedData.phone,
            role_id: 1


          }),
        });



        if (!response.ok) {
          const errorText = await response.json();
          console.error(`Error ${response.status}:`, errorText);
          alert(`Error al agregar nuevoo dueño: ${errorText}`);
          throw new Error(`Error ${response.status}: Failed to add new owner`);
        }


        const result = await response.json();
        console.log('Owner added:', result);
        setModalOpen(false);
        getData();

      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
    } else {
      try {

        const outdatedData = getById(id);
        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...outdatedData,
            full_name: updatedData.full_name,
            dui: updatedData.dui,
            email: updatedData.email,
            phone: updatedData.phone


          }),
        });



        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error ${response.status}:`, errorText);
          const parsedError= errorText.match(/failed on the '([^']+)' tag/);
          alert(`Error al agregar nuevo dueño: ${parsedError}`);
          throw new Error(`Error ${response.status}: Failed to update appointment`);
        }


        const result = await response.json();
        console.log('Owners updated:', result);
        setModalOpen(false);
        getData();
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
    }
  }





  return (
    <Layout userName="Alison lol" menuItems={menuItemsAdmin} userType="admin">
      <div id="admin-main-container">
        <div className="search-add-row">
          <SearchBox onSearch={handleSearch} placeholder="Busque dueño por nombre" />
          <AddButton onClick={handleEdit} />
        </div>


        <AdminTable rows={filteredOwners} columns={adminOwnerColumns} onEdit={handleEdit} onDelete={deleteOwner} />


        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <EditDuenoForm initialData={ownerToEdit} onSubmit={updateOwner} />

        </Modal>


      </div>
    </Layout>
  )
}

export default DuenosAdmin;