import { Router } from 'express'
import { getAllConsultas, createConsulta, updateConsulta, deleteConsulta } from '../controllers/consultaController'
const router = Router()

router.get('/', getAllConsultas)
router.post('/', createConsulta)
router.put('/:id', updateConsulta)
router.delete('/:id', deleteConsulta)

export default router