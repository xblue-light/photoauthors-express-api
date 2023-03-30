import * as bcrypt from 'bcrypt'
export class Bcrypt {
  /**
   * @returns Return a hashed password
   * @param plainPassword Takes as an entry param a plain string password
   */
  public static async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(plainPassword, salt)
    return hashedPassword
  }
  /**
   *
   * @param plainPassword
   * @param hashPassword
   * @returns A boolean indicating w/e or not the plain password and the hashed password are a match
   */
  public static async isPasswordValid(
    plainPassword: string,
    hashPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashPassword)
  }
}
