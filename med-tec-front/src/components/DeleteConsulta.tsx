import React, { useState, useEffect } from 'react'
import api from '../services/api'
import './Styles.css'
import { useParams, useNavigate } from 'react-router-dom'

interface Consulta {
    cod_consul: number;
    motivo: string;
    dt_prev_consulta: string; 
    dt_consul?: string;
    valor: number;
    status: boolean;
}
  

const DeleteConsulta: React.FC = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [erro, setErro] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await api.get('/consultas')
        setConsultas(response.data)
      } catch (error) {
        setErro('Erro ao buscar consultas')
        console.error(error)
      }
    }
  
    fetchConsultas()
  }, [])

  const [motivo, setMotivo] = useState('')
  const [dt_prev_consulta, setDtPrev] = useState('')
  const [dt_consul, setDtConsul] = useState('')
  const [status, setStatus] = useState(false)
  const [valor, setValor] = useState(0)
  const [mensagem, setMensagem] = useState('')
  const { cod_consul } = useParams<{ cod_consul: string }>()

  useEffect(() => {
    const fetchConsulta = async () => {
      const consulta: Consulta | undefined = consultas.find(consulta => consulta.cod_consul === Number(cod_consul))
      if (consulta) {
        setMotivo(consulta.motivo)
        setDtPrev(consulta.dt_prev_consulta)
        setValor(consulta.valor)
        if (consulta.dt_consul === undefined) {
            setDtConsul('')
        } else {
            setDtConsul(consulta.dt_consul)
        }
        setStatus(consulta.status)
      }
    }
  
    fetchConsulta()
  }, [consultas, cod_consul])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      await api.delete(`/consultas/${cod_consul}`)
      setMensagem(`Dados da consulta ${cod_consul} removidos do sistema.`)
      setTimeout(() => {
        setMensagem('')
        navigate('/')
      }, 3000)
     
    } catch (error) {
      console.error('Erro ao remover os dados da consulta.', error)
      setMensagem('Erro ao remover dados da consulta.')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
    }
  }

  return (
    <div className='container'>
    <h1>Remover Consulta</h1>
    {erro && <p className="error">{erro}</p>}
    <form className='form' onSubmit={handleSubmit}>
      <div className='div-form'>
        <label>Motivo: </label>
        <textarea
          value={motivo}
          readOnly
          required
        />
      </div>
      <div className='div-form'>
        <label>Data Prevista para Consulta: </label>
        <input
          type="date"
          value={dt_prev_consulta}
          readOnly
          required
        />
      </div>
      <div className='div-form'>
        <label>Valor: </label>
        <input
          type="number"
          value={valor}
          readOnly
          step="0.01"
          required
        />
      </div>
      <div className='div-form'>
        <label>Status: </label>
        <input
          type="checkbox"
          checked={status}
          readOnly
        />
        <label htmlFor="status">Concluída</label>
      </div>
      <button type="submit" className='button'>Remover Consulta</button>
    </form>
    {mensagem && <p>{mensagem}</p>}
  </div>
)
}

export default DeleteConsulta
