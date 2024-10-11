import { Router } from 'express'
import { getAllPacientes, createPaciente, updatePaciente, deletePaciente, getPacienteById } from '../controllers/pacienteController'
const router = Router()


router.get('/', getAllPacientes)
router.get('/:id', getPacienteById)
router.post('/', createPaciente)
router.put('/:id', updatePaciente)
router.delete('/:id', deletePaciente)

export default router