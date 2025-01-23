import React, { useState } from 'react'
import api from '../services/api'
import './Styles.css'

const AddPaciente: React.FC = () => {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dtNasc, setDtNasc] = useState('')
  const [endereco, setEndereco] = useState('')
  const [contato, setContato] = useState('')
  const [mensagem, setMensagem] = useState<string | null>(null)

  
  const validarCpf = (cpf: string) => {
    
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    return regex.test(cpf)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    
    if (!validarCpf(cpf)) {
      setMensagem('CPF inválido!')
      return
    }

    try {
      const novoPaciente = { nome, cpf, dt_nasc: dtNasc, endereco, contato }
      await api.post('/pacientes', novoPaciente)
      
      
      setNome('')
      setCpf('')
      setDtNasc('')
      setEndereco('')
      setContato('')
      setMensagem('Paciente adicionado com sucesso!')

      setTimeout(() => {
        setMensagem(null)
      }, 3000)
    } catch (error) {
      console.error('Erro ao adicionar paciente', error)
      setMensagem('Erro ao adicionar paciente!')
      setTimeout(() => {
        setMensagem(null)
      }, 3000)
    }
  }

  return (
    <div className="container">
      <h1>Adicionar Paciente</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="div-form">
          <label>Nome: </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="div-form">
          <label>CPF: </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <div className="div-form">
          <label>Data de Nascimento: </label>
          <input
            type="date"
            value={dtNasc}
            onChange={(e) => setDtNasc(e.target.value)}
            required
          />
        </div>
        <div className="div-form">
          <label>Endereço: </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>
        <div className="div-form">
          <label>Contato: </label>
          <input
            type="text"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
          />
        </div>
        <button type="submit" className="button">Adicionar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default AddPaciente
