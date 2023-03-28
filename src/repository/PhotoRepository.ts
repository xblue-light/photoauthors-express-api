import { FindManyOptions, FindOptionsWhere, Repository, SaveOptions } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Photo } from '../entity/Photo';

export class PhotoRepository {
    private _photoRepository: Repository<Photo>;

    constructor() {
        this._photoRepository = AppDataSource.getRepository(Photo)
    }

    public async find(options?: FindManyOptions<Photo>): Promise<Photo[]> {
        return this._photoRepository.find(options);
    }

    public async findBy(where: FindOptionsWhere<Photo> | FindOptionsWhere<Photo>[]): Promise<Photo[]> {
        return this._photoRepository.findBy(where);
    }

    public async save(entities: Photo[], options?: SaveOptions): Promise<Photo[]> {
        return this._photoRepository.save(entities, options);
    }

    public async findOneBy(where: FindOptionsWhere<Photo> | FindOptionsWhere<Photo>[]): Promise<Photo> {
        return this._photoRepository.findOneBy(where);
    }
}
