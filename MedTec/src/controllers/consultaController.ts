import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Consulta } from '../entity/Consulta'

export const getAllConsultas = async (req: Request, res: Response) => {
  try {
    const consultaRepository = AppDataSource.getRepository(Consulta)
    const consultas = await consultaRepository.find()
    res.json(consultas)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter consultas', error })
  }
}

export const createConsulta = async (req: Request, res: Response) => {
    try {
      const consultaRepository = AppDataSource.getRepository(Consulta)
      const consultaData = req.body
      const consulta = consultaRepository.create(consultaData)
  
      await consultaRepository.save(consulta)
      
      res.status(201).json(consulta)
    } catch (error) {
      console.error('Erro ao criar consulta:', error)
      res.status(500).json({ message: 'Erro ao criar consulta', error })
    }
  }

export const updateConsulta = async (req: Request, res: Response) => {
  try {
    const consultaRepository = AppDataSource.getRepository(Consulta)
    const { id } = req.params 
    const updatedData = req.body 

    const consulta = await consultaRepository.findOneBy({ cod_consul: parseInt(id) })
    if (!consulta) {
      return res.status(404).json({ message: 'Consulta não encontrada' })
    }

    consultaRepository.merge(consulta, updatedData)
    await consultaRepository.save(consulta)
    res.json(consulta)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar consulta', error })
  }
}

export const deleteConsulta = async (req: Request, res: Response) => {
  try {
    const consultaRepository = AppDataSource.getRepository(Consulta)
    const { id } = req.params 

    const consulta = await consultaRepository.findOneBy({ cod_consul: parseInt(id) })
    if (!consulta) {
      return res.status(404).json({ message: 'Consulta não encontrada' })
    }

    await consultaRepository.remove(consulta)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar consulta', error })
  }
}
