import {  FindManyOptions, FindOptionsWhere, Repository, SaveOptions } from 'typeorm';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

export class UserRepository {
    private _userRepository: Repository<User>;

    constructor() {
        this._userRepository = AppDataSource.getRepository(User)
    }

    public async find(options?: FindManyOptions<User>): Promise<User[]> {
        return this._userRepository.find(options);
    }

    public async findBy(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<User[]> {
        return this._userRepository.findBy(where);
    }

    public async saveOne(entities: User, options?: SaveOptions): Promise<User> {
        return this._userRepository.save(entities, options);
    }

    public async findOneBy(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<User> {
        return this._userRepository.findOneBy(where);
    }
}
