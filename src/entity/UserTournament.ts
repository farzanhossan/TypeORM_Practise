import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, ManyToOne} from "typeorm";
import { User } from "./User";
import { Tournament } from "./Tournament";

@Entity()
export class UserTournament extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.userTournament, { primary: true })
    user: User;
    @ManyToOne(type => Tournament, group => group.userTournament, { primary: true })
    tournament: Tournament;
}