import React, { useState, useEffect } from 'react'
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

const EditPaciente: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [erro, setErro] = useState<string | null>(null)
  
  //Buscando os pacientes ao carregar a página.
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get('/pacientes')
        setPacientes(response.data)
      } catch (error) {
        setErro('Erro ao buscar pacientes')
        console.error(error)
      }
    }
  
    fetchPacientes()
  }, [])

  //Definindo as variáveis de dados dos pacientes.
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dtNasc, setDtNasc] = useState('')
  const [endereco, setEndereco] = useState('')
  const [contato, setContato] = useState('')
  const [mensagem, setMensagem] = useState('')
  const { cod_pac } = useParams<{ cod_pac: string }>()

  //Atualizando os valores dos inputs com os dados do paciente.
  useEffect(() => {
    const fetchPac = async () => {
      const paciente: Paciente | undefined = pacientes.find(paciente => paciente.cod_pac === Number(cod_pac))
      if (paciente) {
        setNome(paciente.nome)
        setCpf(paciente.cpf)
        setDtNasc(paciente.dt_nasc.toLocaleString())
        setEndereco(paciente.endereco)
        setContato(paciente.contato)
      }
    }
  
    fetchPac()
  }, [pacientes, cod_pac])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Alterando os dados do paciente desejado.
    try {
      const alteraPaciente = { nome, cpf, dt_nasc: dtNasc, endereco, contato }
      await api.put(`/pacientes/${cod_pac}`, alteraPaciente)
      setMensagem('Dados do paciente alterados.')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
    } catch (error) {
      console.error('Erro ao alterar dados do paciente.', error)
      setMensagem('Erro ao alterar dados do paciente.')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
      setMensagem('')
    }
  }

  return (
    <div className='container'>
      <h1>Editar Paciente</h1>
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
        <button type="submit" className='button'>Salvar Alterações</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default EditPaciente
