import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany, ManyToMany} from "typeorm";
import {UserTournament} from './UserTournament';
import { Country } from "./Country";
import { Tournament } from "./Tournament";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: number;

    @Column()
    password: string;

    @ManyToOne(type => Country, country => country.user)
    @JoinColumn({name: 'country_id'})
    country: Country

    @OneToMany(type => UserTournament, userTournament => userTournament.user)
    userTournament: UserTournament[];

    // @ManyToMany(type => Tournament, tournament => tournament.users)
    // tournaments: Promise<Tournament[]>;
 
}