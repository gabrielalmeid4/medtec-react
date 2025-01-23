import React, { useEffect, useReducer, useCallback } from 'react'
import api from '../services/api'
import './Styles.css'
import { useParams } from 'react-router-dom'

interface Consulta {
  cod_consul: number
  cod_pac: number
  motivo: string
  dt_prev_consulta: string
  valor: number
  status: boolean
}

interface State {
  consulta: Consulta | null
  erro: string | null
  motivo: string
  dtPrevConsulta: string
  valor: number | string
  status: boolean
  mensagem: string
}

type Action =
  | { type: 'SET_CONSULTA'; consulta: Consulta }
  | { type: 'SET_ERRO'; erro: string }
  | { type: 'SET_MOTIVO'; motivo: string }
  | { type: 'SET_DT_PREV_CONSULTA'; dtPrevConsulta: string }
  | { type: 'SET_VALOR'; valor: number | string }
  | { type: 'SET_STATUS'; status: boolean }
  | { type: 'SET_MENSAGEM'; mensagem: string }

const initialState: State = {
  consulta: null,
  erro: null,
  motivo: '',
  dtPrevConsulta: '',
  valor: 0,
  status: false,
  mensagem: '',
}

const consultaReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CONSULTA':
      return {
        ...state,
        consulta: action.consulta,
        motivo: action.consulta.motivo,
        dtPrevConsulta: action.consulta.dt_prev_consulta,
        valor: action.consulta.valor,
        status: action.consulta.status,
      }
    case 'SET_ERRO':
      return { ...state, erro: action.erro }
    case 'SET_MOTIVO':
      return { ...state, motivo: action.motivo }
    case 'SET_DT_PREV_CONSULTA':
      return { ...state, dtPrevConsulta: action.dtPrevConsulta }
    case 'SET_VALOR':
      return { ...state, valor: action.valor }
    case 'SET_STATUS':
      return { ...state, status: action.status }
    case 'SET_MENSAGEM':
      return { ...state, mensagem: action.mensagem }
    default:
      return state
  }
}

const EditConsulta: React.FC = () => {
  const [state, dispatch] = useReducer(consultaReducer, initialState)
  const { cod_consul } = useParams<{ cod_consul: string }>()

  
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await api.get('/consultas')
        const consulta = response.data.find(
          (consulta: Consulta) => consulta.cod_consul === Number(cod_consul)
        )
        if (consulta) {
          dispatch({ type: 'SET_CONSULTA', consulta })
        } else {
          dispatch({ type: 'SET_ERRO', erro: 'Consulta não encontrada' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERRO', erro: 'Erro ao buscar consulta' })
        console.error(error)
      }
    }
    fetchConsultas()
  }, [cod_consul])

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const alteraConsulta = { motivo: state.motivo, dt_prev_consulta: state.dtPrevConsulta, valor: state.valor, status: state.status }
      await api.put(`/consultas/${cod_consul}`, alteraConsulta)
      dispatch({ type: 'SET_MENSAGEM', mensagem: 'Dados da consulta alterados.' })
      setTimeout(() => dispatch({ type: 'SET_MENSAGEM', mensagem: '' }), 3000)
    } catch (error) {
      console.error('Erro ao alterar dados da consulta.', error)
      dispatch({ type: 'SET_MENSAGEM', mensagem: 'Erro ao alterar dados da consulta.' })
      setTimeout(() => dispatch({ type: 'SET_MENSAGEM', mensagem: '' }), 3000)
    }
  }, [state, cod_consul])

  return (
    <div className="container">
      <h1>Editar Consulta</h1>
      {state.erro && <p className="error">{state.erro}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="div-form">
          <label>Motivo: </label>
          <textarea
            value={state.motivo}
            onChange={(e) => dispatch({ type: 'SET_MOTIVO', motivo: e.target.value })}
            required
          />
        </div>
        <div className="div-form">
          <label>Data Prevista para Consulta: </label>
          <input
            type="date"
            value={state.dtPrevConsulta}
            onChange={(e) => dispatch({ type: 'SET_DT_PREV_CONSULTA', dtPrevConsulta: e.target.value })}
            required
          />
        </div>
        <div className="div-form">
          <label>Valor: </label>
          <input
            type="number"
            value={state.valor}
            onChange={(e) => dispatch({ type: 'SET_VALOR', valor: parseFloat(e.target.value) })}
            step="0.01"
            required
          />
        </div>
        <div className="div-form">
          <label>Status: </label>
          <input
            type="checkbox"
            checked={state.status}
            onChange={(e) => dispatch({ type: 'SET_STATUS', status: e.target.checked })}
          />
          <label htmlFor="status">Concluída</label>
        </div>
        <button type="submit" className="button">Salvar Alterações</button>
      </form>
      {state.mensagem && <p>{state.mensagem}</p>}
    </div>
  )
}

export default EditConsulta
