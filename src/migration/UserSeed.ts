// import { MigrationInterface, QueryRunner, InsertQueryBuilder } from "typeorm";
// import { User } from "../entity/User";

// export class UserSeed1620012345678 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     const usersData = [
//       { firstName: "John", lastName: "Doe", age: 30 },
//       { firstName: "Jane", lastName: "Doe", age: 25 },
//       { firstName: "Bob", lastName: "Smith", age: 40 },
//     ];

//     const userQueryBuilder = new InsertQueryBuilder<User>(
//       queryRunner.connection,
//       queryRunner.queryRunnerDatabase,
//       User
//     );

//     userQueryBuilder.values(usersData);

//     await queryRunner.query(userQueryBuilder.getQuery());
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Implement the logic to revert the changes made in the up method
//   }
// }