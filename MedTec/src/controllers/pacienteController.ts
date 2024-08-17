import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Paciente } from '../entity/Paciente'

// Obtém todos os pacientes
export const getAllPacientes = async (req: Request, res: Response) => {
  try {
    const pacienteRepository = AppDataSource.getRepository(Paciente)
    const pacientes = await pacienteRepository.find()
    res.json(pacientes)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter pacientes', error })
  }
}

// Cria um paciente
export const createPaciente = async (req: Request, res: Response) => {
  try {
    const pacienteRepository = AppDataSource.getRepository(Paciente)
    const paciente = pacienteRepository.create(req.body)
    await pacienteRepository.save(paciente)
    res.status(201).json(paciente)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar paciente', error })
  }
}

// Função para atualizar um paciente
export const updatePaciente = async (req: Request, res: Response) => {
    try {
      const pacienteRepository = AppDataSource.getRepository(Paciente)
      const { id } = req.params // ID do paciente a ser atualizado
      const updatedData = req.body // Dados para atualizar
  
      // Verifica se o paciente existe
      const paciente = await pacienteRepository.findOneBy({ cod_pac: parseInt(id) })
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' })
      }
  
      // Atualiza o paciente com os novos dados
      pacienteRepository.merge(paciente, updatedData)
      await pacienteRepository.save(paciente)
      res.json(paciente)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar paciente', error })
    }
  }
  
  // Função para deletar um paciente
  export const deletePaciente = async (req: Request, res: Response) => {
    try {
      const pacienteRepository = AppDataSource.getRepository(Paciente)
      const { id } = req.params // ID do paciente a ser deletado
  
      // Verifica se o paciente existe
      const paciente = await pacienteRepository.findOneBy({ cod_pac: parseInt(id) })
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' })
      }
  
      // Remove o paciente
      await pacienteRepository.remove(paciente)
      res.status(204).send() // Responde com sucesso e sem conteúdo
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar paciente', error })
    }
  }