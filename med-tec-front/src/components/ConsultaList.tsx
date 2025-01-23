import React, { useState, useEffect, useReducer, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './Styles.css'
import api from '../services/api'

interface Paciente {
  cod_pac: number
  nome: string
  cpf: string
}

interface Consulta {
  cod_consul: number
  cod_pac: number
  motivo: string
  dt_prev_consulta: string
  valor: number
  status: boolean
}

interface State {
  consultas: Consulta[]
  pacientes: Paciente[]
  erro: string | null
}

type Action =
  | { type: 'SET_CONSULTAS'; consultas: Consulta[] }
  | { type: 'SET_PACIENTES'; pacientes: Paciente[] }
  | { type: 'SET_ERRO'; erro: string }

const initialState: State = {
  consultas: [],
  pacientes: [],
  erro: null,
}

const consultaReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CONSULTAS':
      return { ...state, consultas: action.consultas }
    case 'SET_PACIENTES':
      return { ...state, pacientes: action.pacientes }
    case 'SET_ERRO':
      return { ...state, erro: action.erro }
    default:
      return state
  }
}

const ConsultaList: React.FC = () => {
  const [state, dispatch] = useReducer(consultaReducer, initialState)
  const [nomeBusca, setNomeBusca] = useState('')

  
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await api.get('/consultas')
        dispatch({ type: 'SET_CONSULTAS', consultas: response.data })
      } catch (error) {
        dispatch({ type: 'SET_ERRO', erro: 'Erro ao buscar consultas' })
        console.error(error)
      }
    }
    fetchConsultas()

    const fetchPacientes = async () => {
      try {
        const response = await api.get('/pacientes')
        dispatch({ type: 'SET_PACIENTES', pacientes: response.data })
      } catch (error) {
        dispatch({ type: 'SET_ERRO', erro: 'Erro ao buscar pacientes' })
        console.error(error)
      }
    }
    fetchPacientes()
  }, [])

  const handleBusca = useCallback(() => {
    const buscaNome = nomeBusca.toLowerCase()
    const consultasBusca = state.consultas.filter((consulta) => {
      const paciente = state.pacientes.find((p) => p.cod_pac === consulta.cod_pac)
      return (
        consulta.cod_pac.toString().includes(buscaNome) ||
        consulta.cod_consul.toString().includes(buscaNome) ||
        consulta.motivo.toLowerCase().includes(buscaNome) ||
        (paciente && paciente.nome.toLowerCase().includes(buscaNome))
      )
    })
    dispatch({ type: 'SET_CONSULTAS', consultas: consultasBusca })
  }, [nomeBusca, state.consultas, state.pacientes])

  return (
    <div className="container">
      <h1>Lista de Consultas</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar"
          value={nomeBusca}
          onChange={(e) => setNomeBusca(e.target.value)}
        />
        <button onClick={handleBusca}>Buscar</button>
      </div>
      {state.erro ? (
        <p className="error">{state.erro}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código da Consulta</th>
              <th>Código do Paciente</th>
              <th>Nome do Paciente</th>
              <th>Motivo</th>
              <th>Data Prevista</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {state.consultas
              .sort((a, b) => a.cod_consul - b.cod_consul)
              .map((consulta) => {
                const paciente = state.pacientes.find(
                  (paciente) => paciente.cod_pac === consulta.cod_pac
                )
                return (
                  <tr key={consulta.cod_consul}>
                    <td>{consulta.cod_consul}</td>
                    <td>{consulta.cod_pac}</td>
                    <td>{paciente?.nome}</td>
                    <td>{consulta.motivo}</td>
                    <td>{new Date(consulta.dt_prev_consulta).toLocaleDateString()}</td>
                    <td>R${consulta.valor.toFixed(2)}</td>
                    <td>{consulta.status ? 'Concluída' : 'Pendente'}</td>
                    <td>
                      <Link to={`/edit-consulta/${consulta.cod_consul}`}>Editar</Link> |{' '}
                      <Link to={`/delete-consulta/${consulta.cod_consul}`}>Deletar</Link>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      )}
      <div className="add-consulta">
        <Link to="/add-consulta" className="button">
          Adicionar Consulta
        </Link>
      </div>
    </div>
  )
}

export default ConsultaList
