import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Especializacao } from "./Especializacao"

@Entity()
export class Medico {
    @PrimaryGeneratedColumn()
    crm: number

    @Column({ length: 50 })
    nome: string

    @Column({ length: 11 })
    cpf: string

    @Column({ type: "date", nullable: true })
    data_nascimento: Date

    @ManyToOne(() => Especializacao)
    @JoinColumn({ name: "cod_especializacao" })
    cargo: Especializacao
}