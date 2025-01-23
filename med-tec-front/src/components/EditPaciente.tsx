import React, { useState, useEffect, useReducer, useCallback } from 'react'
import api from '../services/api'
import './Styles.css'
import { useParams } from 'react-router-dom'

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
  nome: string
  cpf: string
  dtNasc: string
  endereco: string
  contato: string
  mensagem: string
}

type Action =
  | { type: 'SET_PACIENTE'; paciente: Paciente }
  | { type: 'SET_ERRO'; erro: string }
  | { type: 'SET_NOME'; nome: string }
  | { type: 'SET_CPF'; cpf: string }
  | { type: 'SET_DT_NASC'; dtNasc: string }
  | { type: 'SET_ENDERECO'; endereco: string }
  | { type: 'SET_CONTATO'; contato: string }
  | { type: 'SET_MENSAGEM'; mensagem: string }

const initialState: State = {
  paciente: null,
  erro: null,
  nome: '',
  cpf: '',
  dtNasc: '',
  endereco: '',
  contato: '',
  mensagem: '',
}

const pacienteReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PACIENTE':
      return {
        ...state,
        paciente: action.paciente,
        nome: action.paciente.nome,
        cpf: action.paciente.cpf,
        dtNasc: action.paciente.dt_nasc.toLocaleDateString(),
        endereco: action.paciente.endereco,
        contato: action.paciente.contato,
      }
    case 'SET_ERRO':
      return { ...state, erro: action.erro }
    case 'SET_NOME':
      return { ...state, nome: action.nome }
    case 'SET_CPF':
      return { ...state, cpf: action.cpf }
    case 'SET_DT_NASC':
      return { ...state, dtNasc: action.dtNasc }
    case 'SET_ENDERECO':
      return { ...state, endereco: action.endereco }
    case 'SET_CONTATO':
      return { ...state, contato: action.contato }
    case 'SET_MENSAGEM':
      return { ...state, mensagem: action.mensagem }
    default:
      return state
  }
}

const EditPaciente: React.FC = () => {
  const [state, dispatch] = useReducer(pacienteReducer, initialState)
  const { cod_pac } = useParams<{ cod_pac: string }>()

  
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get('/pacientes')
        const paciente = response.data.find(
          (paciente: Paciente) => paciente.cod_pac === Number(cod_pac)
        )
        if (paciente) {
          dispatch({ type: 'SET_PACIENTE', paciente })
        } else {
          dispatch({ type: 'SET_ERRO', erro: 'Paciente não encontrado' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERRO', erro: 'Erro ao buscar paciente' })
        console.error(error)
      }
    }
    fetchPacientes()
  }, [cod_pac])

  
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const alteraPaciente = { nome: state.nome, cpf: state.cpf, dt_nasc: state.dtNasc, endereco: state.endereco, contato: state.contato }
      await api.put(`/pacientes/${cod_pac}`, alteraPaciente)
      dispatch({ type: 'SET_MENSAGEM', mensagem: 'Dados do paciente alterados.' })
      setTimeout(() => dispatch({ type: 'SET_MENSAGEM', mensagem: '' }), 3000)
    } catch (error) {
      console.error('Erro ao alterar dados do paciente.', error)
      dispatch({ type: 'SET_MENSAGEM', mensagem: 'Erro ao alterar dados do paciente.' })
      setTimeout(() => dispatch({ type: 'SET_MENSAGEM', mensagem: '' }), 3000)
    }
  }, [state, cod_pac])

  return (
    <div className="container">
      <h1>Editar Paciente</h1>
      {state.erro ? (
        <p className="error">{state.erro}</p>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <div className="div-form">
            <label>Nome: </label>
            <input
              type="text"
              value={state.nome}
              onChange={(e) => dispatch({ type: 'SET_NOME', nome: e.target.value })}
              required
            />
          </div>
          <div className="div-form">
            <label>CPF: </label>
            <input
              type="text"
              value={state.cpf}
              onChange={(e) => dispatch({ type: 'SET_CPF', cpf: e.target.value })}
              required
            />
          </div>
          <div className="div-form">
            <label>Data de Nascimento: </label>
            <input
              type="date"
              value={state.dtNasc}
              onChange={(e) => dispatch({ type: 'SET_DT_NASC', dtNasc: e.target.value })}
              required
            />
          </div>
          <div className="div-form">
            <label>Endereço: </label>
            <input
              type="text"
              value={state.endereco}
              onChange={(e) => dispatch({ type: 'SET_ENDERECO', endereco: e.target.value })}
            />
          </div>
          <div className="div-form">
            <label>Contato: </label>
            <input
              type="text"
              value={state.contato}
              onChange={(e) => dispatch({ type: 'SET_CONTATO', contato: e.target.value })}
            />
          </div>
          <button type="submit" className="button">Salvar Alterações</button>
        </form>
      )}
      {state.mensagem && <p>{state.mensagem}</p>}
    </div>
  )
}

export default EditPaciente
