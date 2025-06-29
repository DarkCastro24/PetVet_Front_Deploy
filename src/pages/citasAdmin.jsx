import Layout from "./layout"
import { menuItemsAdmin } from "../config/layout/sidebar"
import SearchBox from "../components/search-box"
import AdminTable from "./adminTable"
import { useState, useEffect } from "react"
import Modal from "../components/admin-edit-modal"
import EditAppointmentForm from "../components/edit-appointment"





function CitasAdmin() {
 const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const [isModalOpen, setModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);




  const adminAppointmentColumns = [
    'id',
    'horario',
    'Mascota',
    'Dueño',
    'Veterinario',
    'Estado',
    'Creado',

  ];



  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

   async function getData() {
      try {
        const response = await fetch(`${API_URL}/api/appointments`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        let index = 0;
        const currentPage = 1;
        const itemsPerPage = 7;
        const data = await response.json();

        console.log(data)
        const filteredData = data.map((item) => ({




          rowNumber: (currentPage - 1) * itemsPerPage + index + 1,
          id: item.id,
          "horario":
            item.date.startsWith("0000")
              ? "Sin cita"
              : item.date.toString().concat(" a las: ", item.time),
          Mascota: item.pet.name,
          Dueño: item.pet.owner.full_name,
          Veterinario: item.vet.full_name || "No definido",
          Estado: item.status,
          Creado: item.created_at




        }));

        console.log('Filtered data:', filteredData);
        setAppointments(filteredData);
        setFilteredAppointments(filteredData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

  useEffect(() => {

    //needs to be changed
    async function getData() {
      try {
        const response = await fetch(`${API_URL}/api/appointments`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        let index = 0;
        const currentPage = 1;
        const itemsPerPage = 7;
        const data = await response.json();

        console.log(data)
        const filteredData = data.map((item) => ({




          rowNumber: (currentPage - 1) * itemsPerPage + index + 1,
          id: item.id,
          "horario":
            item.date.startsWith("0000")
              ? "Sin cita"
              : item.date.toString().concat(" a las: ", item.time),
          Mascota: item.pet.name,
          Dueño: item.pet.owner.full_name,
          Veterinario: item.vet.full_name || "No definido",
          Estado: item.status,
          Creado: item.created_at




        }));

        console.log('Filtered data:', filteredData);
        setAppointments(filteredData);
        setFilteredAppointments(filteredData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    getData();
  }, []);



  const handleSearch = (search) => {
    if (search.trim() === '') {

      setFilteredAppointments(appointments);
    } else {
      const filtered = filteredAppointments.filter((registro) => registro["Dueño"].toLowerCase().includes(search.toLowerCase())
      );
      setFilteredAppointments(filtered);
    }
  }



async function getById(id){
  try{

      const response = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
        
      });



      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to get appointment by id`);
      }


      const result = await response.json();
      console.log('Appointment got:', result);
      return result;
  } catch(error){
    console.error('Fetch error:', error); 
    throw error; 

  }
}


const handleEdit = async (appointmentId) => {
  try {
    const appointment = await getById(appointmentId);
    setAppointmentToEdit(appointment);
    setModalOpen(true);
  } catch (error) {
    console.error("Error loading appointment:", error);
    alert("No se pudo cargar la cita para edición.");
  }
};


async function updateAppointment(id, updatedData) {
    try {
      
      const outdatedData = getById(id);
      const response = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({...outdatedData, date: updatedData.date, time: updatedData.time, status_id: updatedData.status_id }),
      });



      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to update appointment`);
      }


      const result = await response.json();
      console.log('Appointment updated:', result);
      setModalOpen(false);
      getData(); 
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }


  async function deleteAppointment(id) {
    try {
      const response = await fetch(`${API_URL}/api/appointments/${id}`, {
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











  return (
    <Layout userName="Alison lol" menuItems={menuItemsAdmin} userType="admin">
      <div id="admin-main-container">
        <SearchBox onSearch={handleSearch} placeholder="Busque cita por dueño" />

        <AdminTable rows={filteredAppointments} columns={adminAppointmentColumns} onEdit={handleEdit} onDelete={deleteAppointment} />


        <Modal isOpen={isModalOpen} onClose={()=> setModalOpen(false)}>
       <EditAppointmentForm initialData={appointmentToEdit  } onSubmit={updateAppointment}/>


        </Modal>


      </div>
    </Layout>
  )
}


export default CitasAdmin
