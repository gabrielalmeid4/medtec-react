import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PacienteList from './components/PacienteList'
import AddPaciente from './components/AddPaciente'
import EditPaciente from './components/EditPaciente'
import DeletePaciente from './components/DeletePaciente'
import ConsultaList from './components/ConsultaList'
import AddConsulta from './components/AddConsulta'
import EditConsulta from './components/EditConsulta'
import DeleteConsulta from './components/DeleteConsulta'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PacienteList />} />
        <Route path="/add" element={<AddPaciente />} />
        <Route path="/edit/:cod_pac" element={<EditPaciente />} />
        <Route path="/delete/:cod_pac" element={<DeletePaciente />} />
        <Route path="/consultas" element={<ConsultaList />} />
        <Route path="/add-consulta" element={<AddConsulta />} />
        <Route path="/edit-consulta/:cod_consul" element={<EditConsulta />} />
        <Route path="/delete-consulta/:cod_consul" element={<DeleteConsulta />} />
      </Routes>
    </Router>
  )
}

export default App
