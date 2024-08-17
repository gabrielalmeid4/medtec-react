import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"

@Entity()
export class Paciente {
    @PrimaryGeneratedColumn()
    cod_pac: number

    @Column({ length: 11 })
    cpf: string

    @Column({ length: 50 })
    nome: string

    @Column({ length: 20, nullable: true })
    contato: string

    @Column({ type: "text", nullable: true })
    endereco: string

    @Column({ type: "date", nullable: true })
    dt_nasc: Date
}
