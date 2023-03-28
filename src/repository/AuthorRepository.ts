import { FindManyOptions, FindOptionsWhere, Repository, SaveOptions } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Author } from "../entity/Author";

export class AuthorRepository {
    private _authorRepository: Repository<Author>;

    constructor() {
        this._authorRepository = AppDataSource.getRepository(Author)
    }

    public async find(options?: FindManyOptions<Author>): Promise<Author[]> {
        return this._authorRepository.find(options);
    }

    public async findBy(where: FindOptionsWhere<Author> | FindOptionsWhere<Author>[]): Promise<Author[]> {
        return this._authorRepository.findBy(where);
    }

    public async save(entities: Author[], options?: SaveOptions): Promise<Author[]> {
        return this._authorRepository.save(entities, options);
    }

    public async findOneBy(where: FindOptionsWhere<Author> | FindOptionsWhere<Author>[]): Promise<Author> {
        return this._authorRepository.findOneBy(where);
    }
}
