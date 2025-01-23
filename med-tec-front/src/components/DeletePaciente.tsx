import React, { useReducer, useEffect, useCallback } from 'react'
import api from '../services/api'
import './Styles.css'
import { useParams, useNavigate } from 'react-router-dom'

interface Paciente {
  cod_pac: number
  nome: string
  cpf: string
  dt_nasc: Date
  endereco: string
  contato: string
}

interface State {
  paciente: Paciente | null
  erro: string | null
  mensagem: string
  confirmarRemocao: boolean
}

type Action =
  | { type: 'SET_PACIENTE'; paciente: Paciente }
  | { type: 'SET_ERRO'; erro: string }
  | { type: 'SET_MENSAGEM'; mensagem: string }
  | { type: 'TOGGLE_CONFIRMAR_REMOVO'; }

const initialState: State = {
  paciente: null,
  erro: null,
  mensagem: '',
  confirmarRemocao: false,
}

const pacienteReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PACIENTE':
      return { ...state, paciente: action.paciente }
    case 'SET_ERRO':
      return { ...state, erro: action.erro }
    case 'SET_MENSAGEM':
      return { ...state, mensagem: action.mensagem }
    case 'TOGGLE_CONFIRMAR_REMOVO':
      return { ...state, confirmarRemocao: !state.confirmarRemocao }
    default:
      return state
  }
}

const DeletePaciente: React.FC = () => {
  const navigate = useNavigate()
  const { cod_pac } = useParams<{ cod_pac: string }>()
  const [state, dispatch] = useReducer(pacienteReducer, initialState)

  // Buscar paciente
  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await api.get('/pacientes')
        const paciente = response.data.find(
          (paciente: Paciente) => paciente.cod_pac === Number(cod_pac)
        )
        if (paciente) {
          dispatch({ type: 'SET_PACIENTE', paciente })
        } else {
          dispatch({ type: 'SET_ERRO', erro: 'Paciente não encontrado.' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERRO', erro: 'Erro ao buscar paciente.' })
        console.error(error)
      }
    }
    fetchPaciente()
  }, [cod_pac])

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()
    if (state.paciente) {
      try {
        await api.delete(`/pacientes/${cod_pac}`)
        dispatch({ type: 'SET_MENSAGEM', mensagem: `Paciente ${state.paciente.nome} removido com sucesso.` })
        setTimeout(() => {
          dispatch({ type: 'SET_MENSAGEM', mensagem: '' })
          navigate('/')
        }, 3000)
      } catch (error) {
        console.error('Erro ao remover paciente', error)
        dispatch({ type: 'SET_MENSAGEM', mensagem: 'Erro ao remover paciente.' })
        setTimeout(() => {
          dispatch({ type: 'SET_MENSAGEM', mensagem: '' })
        }, 3000)
      }
    }
  }, [state.paciente, cod_pac, navigate])

  const handleCheckboxChange = () => {
    dispatch({ type: 'TOGGLE_CONFIRMAR_REMOVO' })
  }

  return (
    <div className='container'>
      <h1>Remover Paciente</h1>
      {state.erro && <p className="error">{state.erro}</p>}
      {state.paciente && (
        <form className='form' onSubmit={handleSubmit}>
          <div className='div-form'>
            <label>Nome: </label>
            <input
              type="text"
              value={state.paciente.nome}
              readOnly
            />
          </div>
          <div className='div-form'>
            <label>CPF: </label>
            <input
              type="text"
              value={state.paciente.cpf}
              readOnly
            />
          </div>
          <div className='div-form'>
            <label>Data de Nascimento: </label>
            <input
              type="date"
              value={state.paciente.dt_nasc.toLocaleString().slice(0, 10)}
              readOnly
            />
          </div>
          <div className='div-form'>
            <label>Endereço: </label>
            <input
              type="text"
              value={state.paciente.endereco}
              readOnly
            />
          </div>
          <div className='div-form'>
            <label>Contato: </label>
            <input
              type="text"
              value={state.paciente.contato}
              readOnly
            />
          </div>
          <div className='div-form'>
            <label>
              <input
                type="checkbox"
                checked={state.confirmarRemocao}
                onChange={handleCheckboxChange}
              />
              AVISO! Remover um paciente removerá todas as consultas associadas a ele. Marque esta caixa para prosseguir.
            </label>
          </div>
          <button type="submit" className='button' disabled={!state.confirmarRemocao}>
            Remover Paciente
          </button>
        </form>
      )}
      {state.mensagem && <p>{state.mensagem}</p>}
    </div>
  )
}

export default DeletePaciente
