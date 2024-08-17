import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Paciente } from "./Paciente"
import { Medico } from "./Medico"

@Entity()
export class Consulta {
    @PrimaryGeneratedColumn()
    cod_consul: number

    @ManyToOne(() => Paciente)
    @JoinColumn({ name: "cod_pac" })
    paciente: Paciente

    @ManyToOne(() => Medico)
    @JoinColumn({ name: "crm" })
    medico: Medico

    @Column({ type: "text" })
    motivo: string

    @Column({ type: "date" })
    dt_prev_consulta: Date

    @Column({ type: "date", nullable: true })
    dt_consul: Date

    @Column({ type: "float" })
    valor: number

    @Column({ type: "boolean" })
    status: boolean
}