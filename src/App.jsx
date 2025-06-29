import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import "./assets/styles/main.scss";
import Home from './pages/home';
import MascotasVet from './pages/mascotasVet';
import Expediente from './pages/expedienteVet';
import Login from './pages/login';
import Register from './pages/register';
import Dayappoint from './pages/appointments';

import CitasAdmin from './pages/citasAdmin';
import VeterinariansAdmin from './pages/veterinariosAdmin';
import AdminPet from './pages/adminPet';

import EditModal from './components/admin-edit-modal';
import DuenosAdmin from './pages/duenosAdmin';


import LoginAdmin from './pages/loginAdmin';
import RootAddAdmin from './pages/rootAddAdmin';

import RouteProtectedUser from './utils/routeProtectedUser';

import Dashboard from './pages/dashboard';


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/mascotas" element={< AdminPet/>} />

        <Route path="/admin/login" element={< LoginAdmin/>} />

        <Route path="/superadmin/administradores" element={< RootAddAdmin/>} />

        <Route path="/admin/dashboard" element={< Dashboard/>} />

        <Route path="/admin/citas" element={< CitasAdmin/>} />

        <Route path="/admin/veterinarios" element={< VeterinariansAdmin/>} />


        {/*
        <Route path="/expediente" element={<Expediente />} />
        <Route path='/mascotas' element={<MascotasVet />} />
        <Route path="/citas" element={<Dayappoint />} /> */}

        <Route path="/citas"
          element={ <RouteProtectedUser allowedRoles={[2]}>
              <Dayappoint />
        </RouteProtectedUser>} />

        <Route path="/expediente"
          element={ <RouteProtectedUser allowedRoles={[2]}>
              <Expediente />
        </RouteProtectedUser>} />

        <Route path="/mascotas"
          element={ <RouteProtectedUser allowedRoles={[2]}>
              <MascotasVet />
        </RouteProtectedUser>} />

        <Route path="/citas" element={<Dayappoint />} />

         <Route path="/admin" element={< CitasAdmin/>} />

         <Route path="/modal" element={< EditModal/>} />
        <Route path="/admin/duenos" element={< DuenosAdmin/>} />
        
         <Route path="/admin/vet" element={< VeterinariansAdmin/>} />

        
      
      </Routes>
    </Router>
  );

}


export default App
