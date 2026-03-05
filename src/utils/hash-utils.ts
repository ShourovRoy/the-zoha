import bcryptjs from 'bcryptjs'

// hash the password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, 10)
}

// export verify password
export const verifyPassword = async (
  hashedPwd: string,
  password: string,
): Promise<boolean> => {
  return await bcryptjs.compare(password, hashedPwd)
}
