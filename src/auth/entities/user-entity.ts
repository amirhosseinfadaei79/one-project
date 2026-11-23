import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../../shared/enums/user-role.enum";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', nullable: true, unique: true, length: 11 })
    mobile: string | null

    @Column({ type: 'varchar', nullable: true, length: 255, select: false })
    password: string | null

    @Column({ type: 'varchar', nullable: true, select: false })
    otpCode: string | null

    @Column({ type: 'datetime', nullable: true })
    otpExpiresAt: Date | null

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
