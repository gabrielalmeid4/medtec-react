import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"

@Entity()
export class Cargo {
    @PrimaryGeneratedColumn()
    cod_cargo: number

    @Column({ length: 50 })
    nome: string

    @Column({ type: "float" })
    salario: number
}