import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Cargo } from "./Cargo"

@Entity()
export class Funcionario {
    @PrimaryGeneratedColumn()
    cod_func: number

    @Column({ length: 50 })
    nome: string

    @Column({ length: 11 })
    cpf: string

    @Column({ type: "date", nullable: true })
    data_nascimento: Date

    @ManyToOne(() => Cargo)
    @JoinColumn({ name: "cod_cargo" })
    cargo: Cargo
}