# Podcast Model Documentation

## Overview
The `Podcast` model represents a podcast entity in the system. It encapsulates all the necessary information related to a podcast, including its title, description, cover image, publication date, and associated episodes.

## Structure
The `Podcast` model consists of the following fields:

- **id**: Unique identifier for the podcast (UUID).
- **title**: Title of the podcast (string, required).
- **description**: Brief description of the podcast (string, required).
- **slug**: URL-friendly identifier (string, unique).
- **coverImage**: URL to the cover image of the podcast (string, optional).
- **publicationDate**: Date when the podcast was published (date, required).
- **status**: Publication status (enum: DRAFT/PUBLISHED/ARCHIVED).
- **createdAt**: Record creation timestamp (auto-generated).
- **updatedAt**: Last update timestamp (auto-generated).
- **episodes**: Relationship to the `Episode` model (one-to-many).

## Relationships
- **Episodes**: A podcast can have multiple episodes associated with it. This is represented as a one-to-many relationship where one `Podcast` can have many `Episode` entities.
- **Analytics**: A podcast can have multiple analytics records associated with it.
- **User**: Each podcast is created by a user.

## Validations and Business Rules
- The `title` field must be unique across all podcasts.
- The `publicationDate` must not be a future date.
- The `description` must have a minimum length of 10 characters.
- The `coverImage` URL, if provided, must be a valid URL format.
- The `status` field must be one of the defined enum values.

## Example
```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Episode } from './Episode';

@Entity()
export class Podcast {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    slug: string;

    @Column({ nullable: true })
    coverImage: string;

    @Column()
    publicationDate: Date;

    @Column({ default: 'DRAFT' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Episode, episode => episode.podcast)
    episodes: Episode[];
}