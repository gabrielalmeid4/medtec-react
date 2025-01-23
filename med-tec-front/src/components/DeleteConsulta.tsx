import React, { useReducer, useEffect, useCallback } from 'react'
import api from '../services/api'
import './Styles.css'
import { useParams, useNavigate } from 'react-router-dom'

interface Consulta {
  cod_consul: number
  motivo: string
  dt_prev_consulta: string
  dt_consul?: string
  valor: number
  status: boolean
}

interface State {
  consulta: Consulta | null
  erro: string | null
  mensagem: string
}

type Action =
  | { type: 'SET_CONSULTA'; consulta: Consulta }
  | { type: 'SET_ERRO'; erro: string }
  | { type: 'SET_MENSAGEM'; mensagem: string }

const initialState: State = {
  consulta: null,
  erro: null,
  mensagem: '',
}

const consultaReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CONSULTA':
      return { ...state, consulta: action.consulta }
    case 'SET_ERRO':
      return { ...state, erro: action.erro }
    case 'SET_MENSAGEM':
      return { ...state, mensagem: action.mensagem }
    default:
      return state
  }
}

const DeleteConsulta: React.FC = () => {
  const navigate = useNavigate()
  const { cod_consul } = useParams<{ cod_consul: string }>()
  const [state, dispatch] = useReducer(consultaReducer, initialState)

  
  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const response = await api.get('/consultas')
        const consulta = response.data.find(
          (consulta: Consulta) => consulta.cod_consul === Number(cod_consul)
        )
        if (consulta) {
          dispatch({ type: 'SET_CONSULTA', consulta })
        } else {
          dispatch({ type: 'SET_ERRO', erro: 'Consulta não encontrada.' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERRO', erro: 'Erro ao buscar consulta.' })
        console.error(error)
      }
    }
    fetchConsulta()
  }, [cod_consul])

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()

    if (state.consulta) {
      try {
        await api.delete(`/consultas/${cod_consul}`)
        dispatch({ type: 'SET_MENSAGEM', mensagem: `Consulta ${cod_consul} removida com sucesso.` })
        setTimeout(() => {
          dispatch({ type: 'SET_MENSAGEM', mensagem: '' })
          navigate('/')
        }, 3000)
      } catch (error) {
        console.error('Erro ao remover consulta', error)
        dispatch({ type: 'SET_MENSAGEM', mensagem: 'Erro ao remover consulta.' })
        setTimeout(() => {
          dispatch({ type: 'SET_MENSAGEM', mensagem: '' })
        }, 3000)
      }
    }
  }, [state.consulta, cod_consul, navigate])

  return (
    <div className='container'>
      <h1>Remover Consulta</h1>
      {state.erro && <p className="error">{state.erro}</p>}
      {state.consulta && (
        <form className='form' onSubmit={handleSubmit}>
          <div className='div-form'>
            <label>Motivo: </label>
            <textarea
              value={state.consulta.motivo}
              readOnly
              required
            />
          </div>
          <div className='div-form'>
            <label>Data Prevista para Consulta: </label>
            <input
              type="date"
              value={state.consulta.dt_prev_consulta}
              readOnly
              required
            />
          </div>
          <div className='div-form'>
            <label>Valor: </label>
            <input
              type="number"
              value={state.consulta.valor}
              readOnly
              step="0.01"
              required
            />
          </div>
          <div className='div-form'>
            <label>Status: </label>
            <input
              type="checkbox"
              checked={state.consulta.status}
              readOnly
            />
            <label htmlFor="status">Concluída</label>
          </div>
          <button type="submit" className='button'>Remover Consulta</button>
        </form>
      )}
      {state.mensagem && <p>{state.mensagem}</p>}
    </div>
  )
}

export default DeleteConsulta
