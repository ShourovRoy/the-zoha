import { verify, hash } from 'argon2'

// hash the password
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password)
}

// export verify password
export const verifyPassword = async (
  hashedPwd: string,
  password: string,
): Promise<boolean> => {
  return await verify(hashedPwd, password)
}
