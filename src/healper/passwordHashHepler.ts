import * as bcrypt from 'bcrypt'

const hashedPassword = async (password: string) => {
    return await bcrypt.hash(password, 12)
}
const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const passwordHelper = { hashedPassword, comparePassword }