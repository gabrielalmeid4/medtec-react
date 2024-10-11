import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Paciente } from '../entity/Paciente'
import { ILike, Like } from 'typeorm'

export const getAllPacientes = async (req: Request, res: Response) => {
  try {
    const pacienteRepository = AppDataSource.getRepository(Paciente)
    const pacientes = await pacienteRepository.find()
    res.json(pacientes)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter pacientes', error })
  }
}

export const getPacienteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const pacienteRepository = AppDataSource.getRepository(Paciente)
    const paciente = await pacienteRepository.findOneBy({ cod_pac: parseInt(id) })
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado' })
    }
    res.json(paciente)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter paciente', error })
  }
}

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

export const updatePaciente = async (req: Request, res: Response) => {
    try {
      const pacienteRepository = AppDataSource.getRepository(Paciente)
      const { id } = req.params 
      const updateDados = req.body 

      const paciente = await pacienteRepository.findOneBy({ cod_pac: parseInt(id) })
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' })
      }
  
      pacienteRepository.merge(paciente, updateDados)
      await pacienteRepository.save(paciente)
      res.json(paciente)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar paciente', error })
    }
  }

  export const deletePaciente = async (req: Request, res: Response) => {
    try {
      const pacienteRepository = AppDataSource.getRepository(Paciente)
      const { id } = req.params 

      const paciente = await pacienteRepository.findOneBy({ cod_pac: parseInt(id) })
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' })
      }
  
      await pacienteRepository.remove(paciente)
      res.status(204).send() 
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar paciente', error })
    }
  }