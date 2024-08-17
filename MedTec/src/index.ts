import 'reflect-metadata'
import { AppDataSource } from './data-source'
import express from 'express'
import cors from 'cors'
import pacienteRoutes from './routes/pacienteRoutes'

const app = express()
app.use(express.json())
app.use(cors())


// Configuração das rotas
app.use('/pacientes', pacienteRoutes)

AppDataSource.initialize().then(async () => {
    console.log('Database connected')

    // Inicialização do servidor Express após conectar ao banco de dados
    app.listen(3000, () => {
        console.log('Server running on port 3000.')
    });

}).catch(error => console.log(error))