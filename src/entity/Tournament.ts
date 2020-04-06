import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { UserTournament } from "./UserTournament";
import { User } from "./User";

@Entity()
export class Tournament extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => UserTournament, userTournament => userTournament.tournament)
    userTournament: UserTournament[];

    // @ManyToMany(type => User, user => user.tournaments)
    // @JoinTable()
    // users: Promise<User[]>;

}