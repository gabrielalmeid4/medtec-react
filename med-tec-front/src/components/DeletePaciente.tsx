import React, { useState, useEffect } from 'react'
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

const DeletePaciente: React.FC = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [erro, setErro] = useState<string | null>(null)
  
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

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dtNasc, setDtNasc] = useState('')
  const [endereco, setEndereco] = useState('')
  const [contato, setContato] = useState('')
  const [mensagem, setMensagem] = useState('')
  const { cod_pac } = useParams<{ cod_pac: string }>()

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

    try {
      await api.delete(`/pacientes/${cod_pac}`)
      setMensagem(`Dados do paciente ${cod_pac} removidos do sistema.`)
      setTimeout(() => {
        setMensagem('')
        navigate('/')
      }, 3000)
     
    } catch (error) {
      console.error('Erro ao remover os dados do paciente.', error)
      setMensagem('Erro ao remover dados do paciente.')
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
            readOnly
          />
        </div>
        <div className='div-form'>
          <label>CPF: </label>
          <input
            type="text"
            value={cpf}
            readOnly
          />
        </div>
        <div className='div-form'>
          <label>Data de Nascimento: </label>
          <input
            type="date"
            value={dtNasc}
            readOnly
          />
        </div>
        <div className='div-form'>
          <label>Endereço: </label>
          <input
            type="text"
            value={endereco}
            readOnly
          />
        </div>
        <div className='div-form'>
          <label>Contato: </label>
          <input
            type="text"
            value={contato}
            readOnly
          />
        </div>
        <button type="submit" className='button'>Remover Paciente</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default DeletePaciente
