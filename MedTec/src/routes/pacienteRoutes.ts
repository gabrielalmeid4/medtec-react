import { Router } from 'express';
import { getAllPacientes, createPaciente, updatePaciente, deletePaciente } from '../controllers/pacienteController';

const router = Router();

//Rotas para Paciente 

router.get('/', getAllPacientes);
router.post('/', createPaciente);
router.put('/:id', updatePaciente);
router.delete('/:id', deletePaciente);

export default router