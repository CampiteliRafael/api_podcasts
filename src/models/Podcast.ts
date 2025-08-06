import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
        import { Episode } from './Episode'; // Supondo que exista um modelo Episode
        import { User } from './User'; // Importando o modelo User

        @Entity()
        export class Podcast {
            @PrimaryGeneratedColumn()
            id: number;

            @Column()
            title: string;

            @Column()
            description: string;

            @Column()
            creatorId: number;

            @ManyToOne(() => User, user => user.podcasts)
            @JoinColumn({ name: 'creatorId' })
            creator: User;

            @Column()
            coverImage: string;

            @Column()
            publicationDate: Date;

            @OneToMany(() => Episode, episode => episode.podcast)
            episodes: Episode[];
        }