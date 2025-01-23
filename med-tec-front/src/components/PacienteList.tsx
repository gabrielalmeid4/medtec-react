import React, { useEffect, useReducer, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Styles.css'
import api from '../services/api'

interface Paciente {
  cod_pac: number
  nome: string
  cpf: string
}

interface State {
  pacientes: Paciente[]
  erro: string | null
  nomeBusca: string
}

type Action =
  | { type: 'SET_PACIENTES'; pacientes: Paciente[] }
  | { type: 'SET_ERRO'; erro: string }
  | { type: 'SET_NOME_BUSCA'; nomeBusca: string }

const initialState: State = {
  pacientes: [],
  erro: null,
  nomeBusca: '',
}

const pacienteReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PACIENTES':
      return { ...state, pacientes: action.pacientes }
    case 'SET_ERRO':
      return { ...state, erro: action.erro }
    case 'SET_NOME_BUSCA':
      return { ...state, nomeBusca: action.nomeBusca }
    default:
      return state
  }
}

const PacienteList: React.FC = () => {
  const [state, dispatch] = useReducer(pacienteReducer, initialState)

  const { pacientes, erro, nomeBusca } = state

  
  const handleBusca = useCallback(async () => {
    try {
      if (nomeBusca) {
        const pacientesBusca = pacientes.filter(
          paciente =>
            paciente.nome.includes(nomeBusca) ||
            paciente.cpf === nomeBusca ||
            paciente.cod_pac === parseInt(nomeBusca)
        )
        dispatch({ type: 'SET_PACIENTES', pacientes: pacientesBusca })
      } else {
        const response = await api.get('/pacientes')
        dispatch({ type: 'SET_PACIENTES', pacientes: response.data })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERRO', erro: 'Erro ao buscar pacientes' })
      console.error(error)
    }
  }, [nomeBusca, pacientes])

  useEffect(() => {
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

  
  const pacientesOrdenados = useMemo(
    () => pacientes.sort((a, b) => a.cod_pac - b.cod_pac),
    [pacientes]
  )

  return (
    <div className="container">
      <h1>Lista de Pacientes</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar"
          value={nomeBusca}
          onChange={(e) => dispatch({ type: 'SET_NOME_BUSCA', nomeBusca: e.target.value })}
        />
        <button onClick={handleBusca}>Buscar</button>
      </div>
      {erro ? (
        <p className="error">{erro}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientesOrdenados.map(paciente => (
              <tr key={paciente.cod_pac}>
                <td>{paciente.cod_pac}</td>
                <td>{paciente.nome}</td>
                <td>{paciente.cpf}</td>
                <td>
                  <Link to={`/edit/${paciente.cod_pac}`}>Editar</Link> |{' '}
                  <Link to={`/delete/${paciente.cod_pac}`}>Deletar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="add-paciente">
        <Link to="/add" className="button">
          Adicionar Paciente
        </Link>
      </div>
      <div className="consultas-entrar">
        <Link to="/consultas" className="button">
          Ver Consultas
        </Link>
      </div>
    </div>
  )
}

export default PacienteList