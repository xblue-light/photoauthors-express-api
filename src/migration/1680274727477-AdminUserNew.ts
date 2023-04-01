import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entity/User';
import { Author } from '../entity/Author';
import { Bcrypt } from '../utils/Bcrypt';

export class AdminUserNew1680274727477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User);
    const authorRepository = queryRunner.manager.getRepository(Author);
    let user = new User();

    const newAuthor = new Author();
    if (!user.author) {
      newAuthor.user = user;
      user.author = newAuthor;
      user.author.name = 'Super Admin';
      //await authorRepository.save(newAuthor);
    }

    user.username = 'admin';
    user.password = await Bcrypt.hashPassword('admin');
    user.email = 'admin@admin.com';
    user.role = 'ADMIN';

    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
