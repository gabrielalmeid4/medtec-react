import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"

@Entity()
export class Especializacao {
    @PrimaryGeneratedColumn()
    cod_especializacao: number

    @Column({ length: 50 })
    nome: string

    @Column({ type: "float" })
    valor_consulta: number
}
