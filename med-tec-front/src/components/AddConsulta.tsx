import React, { useState } from 'react'
import api from '../services/api' 
import './Styles.css' 

const AddConsulta: React.FC = () => {

  const [codPac, setCodPac] = useState<number | ''>(0)
  const [motivo, setMotivo] = useState('')
  const [dtPrevConsulta, setDtPrevConsulta] = useState('')
  const [valor, setValor] = useState<number | ''>(0)
  const [status, setStatus] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const pacienteResponse = await api.get(`/pacientes/${codPac}`)
      
      if (!pacienteResponse.data) {
        setMensagem('Paciente não encontrado. Verifique o código do paciente e tente novamente.')
        return
      }

      const novaConsulta = {
        cod_pac: codPac,
        motivo,
        dt_prev_consulta: dtPrevConsulta,
        valor,
        status
      }
      await api.post('/consultas', novaConsulta)
      
      setCodPac(0)
      setMotivo('')
      setDtPrevConsulta('')
      setValor(0)
      setStatus(false)
      setMensagem('Consulta adicionada com sucesso!')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
    } catch (error) {
      console.error('Erro ao adicionar consulta', error)
      setMensagem('Erro ao adicionar consulta! Tente novamente.')
      setTimeout(() => {
        setMensagem('')
      }, 3000)
    }
  }

  return (
    <div className='container'>
      <h1>Adicionar Consulta</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div className='div-form'>
          <label>Código do Paciente: </label>
          <input
            type="number"
            value={codPac}
            onChange={(e) => setCodPac(parseInt(e.target.value) || '')}
            required
          />
        </div>
        <div className='div-form'>
          <label>Motivo: </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </div>
        <div className='div-form'>
          <label>Data Prevista: </label>
          <input
            type="date"
            value={dtPrevConsulta}
            onChange={(e) => setDtPrevConsulta(e.target.value)}
            required
          />
        </div>
        <div className='div-form'>
          <label>Valor: </label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(parseFloat(e.target.value) || '')}
            required
          />
        </div>
        <div className='div-form'>
          <label>Status: </label>
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          <label> Concluída</label>
        </div>
        <button type="submit" className='button'>Adicionar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default AddConsulta
