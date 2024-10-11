import React, { useState, useEffect } from 'react'
import api from '../services/api'
import './Styles.css'
import { useParams, useNavigate } from 'react-router-dom'

interface Consulta {
  cod_consul: number
  cod_pac: number
  motivo: string
  dt_prev_consulta: string
  valor: number
  status: boolean
}

const EditConsulta: React.FC = () => {
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
  const [dtPrevConsulta, setDtPrevConsulta] = useState('')
  const [valor, setValor] = useState<number | string>(0)
  const [status, setStatus] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const { cod_consul } = useParams<{ cod_consul: string }>()

  useEffect(() => {
    const fetchConsulta = async () => {
      const consulta: Consulta | undefined = consultas.find(
        consulta => consulta.cod_consul === Number(cod_consul)
      )
      if (consulta) {
        setMotivo(consulta.motivo)
        setDtPrevConsulta(consulta.dt_prev_consulta)
        setValor(consulta.valor)
        setStatus(consulta.status)
      }
    }

    fetchConsulta()
  }, [consultas, cod_consul])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const alteraConsulta = { motivo, dt_prev_consulta: dtPrevConsulta, valor, status }
      await api.put(`/consultas/${cod_consul}`, alteraConsulta)
      setMensagem('Dados da consulta alterados.')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
    } catch (error) {
      console.error('Erro ao alterar dados da consulta.', error)
      setMensagem('Erro ao alterar dados da consulta.')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
    }
  }

  return (
    <div className='container'>
      <h1>Editar Consulta</h1>
      {erro && <p className="error">{erro}</p>}
      <form className='form' onSubmit={handleSubmit}>
        <div className='div-form'>
          <label>Motivo: </label>
          <textarea
            value={motivo}
            onChange={(valor) => setMotivo(valor.target.value)}
            required
          />
        </div>
        <div className='div-form'>
          <label>Data Prevista para Consulta: </label>
          <input
            type="date"
            value={dtPrevConsulta}
            onChange={(valor) => setDtPrevConsulta(valor.target.value)}
            required
          />
        </div>
        <div className='div-form'>
          <label>Valor: </label>
          <input
            type="number"
            value={valor}
            onChange={(valor) => setValor(parseFloat(valor.target.value))}
            step="0.01"
            required
          />
        </div>
        <div className='div-form'>
          <label>Status: </label>
          <input
            type="checkbox"
            checked={status}
            onChange={(valor) => setStatus(valor.target.checked)}
          />
          <label htmlFor="status">Concluída</label>
        </div>
        <button type="submit" className='button'>Salvar Alterações</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default EditConsulta
