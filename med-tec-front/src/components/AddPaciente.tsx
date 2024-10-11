import React, { useState } from 'react'
import api from '../services/api'
import './Styles.css'

const AddPaciente: React.FC = () => {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dtNasc, setDtNasc] = useState('')
  const [endereco, setEndereco] = useState('')
  const [contato, setContato] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const novoPaciente = { nome, cpf, dt_nasc: dtNasc, endereco, contato }
      await api.post('/pacientes', novoPaciente)
      setMensagem('')
      setNome('')
      setCpf('')
      setDtNasc('')
      setEndereco('')
      setContato('')
      setMensagem('Paciente adicionado com sucesso!')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
    } catch (error) {
      console.error('Erro ao adicionar paciente', error)
      setMensagem('Erro ao adicionar paciente!')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
      setMensagem('')
    }
  }

  return (
    <div className='container'>
      <h1>Adicionar Paciente</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div className='div-form'>
          <label>Nome: </label>
          <input
            type="text"
            value={nome}
            onChange={(valor) => setNome(valor.target.value)}
            required
          />
        </div>
        <div className='div-form'>
          <label>CPF: </label>
          <input
            type="text"
            value={cpf}
            onChange={(valor) => setCpf(valor.target.value)}
            required
          />
        </div>
        <div className='div-form'>
          <label>Data de Nascimento: </label>
          <input
            type="date"
            value={dtNasc}
            onChange={(valor) => setDtNasc(valor.target.value)}
            required
          />
        </div>
        <div className='div-form'>
          <label>Endereço: </label>
          <input
            type="text"
            value={endereco}
            onChange={(valor) => setEndereco(valor.target.value)}
          />
        </div>
        <div className='div-form'>
          <label>Contato: </label>
          <input
            type="text"
            value={contato}
            onChange={(valor) => setContato(valor.target.value)}
          />
        </div>
        <button type="submit" className='button'>Adicionar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default AddPaciente
