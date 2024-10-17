import 'reflect-metadata'
import { AppDataSource } from './data-source'
import express from 'express'
import cors from 'cors'
import pacienteRoutes from './routes/pacienteRoutes'
import consultaRoutes from './routes/consultaRoutes'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/pacientes', pacienteRoutes)
app.use('/consultas', consultaRoutes)

AppDataSource.initialize().then(async () => {
    console.log('Database connected')

    app.listen(3000, () => {
        console.log('Server running on port 3000.')
    });

}).catch(error => console.log(error))
