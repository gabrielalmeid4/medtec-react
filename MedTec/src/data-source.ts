import "reflect-metadata"
import { DataSource } from "typeorm"
import { Paciente } from "./entity/Paciente"
import { Cargo } from "./entity/Cargo"
import { Funcionario } from "./entity/Funcionario"
import { Medico } from "./entity/Medico"
import { Especializacao } from "./entity/Especializacao"
import { Consulta } from "./entity/Consulta"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "aws-0-sa-east-1.pooler.supabase.com", 
    port: 6543, 
    username: "postgres.uvvlxkpcdyuaqokwdgsi", 
    password: "Ok3eNpCxZFdRDi7S", 
    database: "postgres", 
    synchronize: true,
    logging: false,
    entities: [Paciente, Cargo, Funcionario, Medico, Especializacao, Consulta],
    migrations: [],
    subscribers: [],
})

