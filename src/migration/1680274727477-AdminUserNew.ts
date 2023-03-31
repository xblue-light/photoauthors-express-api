import { MigrationInterface, QueryRunner } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

export class AdminUserNew1680274727477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.username = 'admin';
    user.password = 'admin';
    user.email = 'admin@admin.com';
    user.role = 'ADMIN';
    const userRepository = queryRunner.manager.getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
