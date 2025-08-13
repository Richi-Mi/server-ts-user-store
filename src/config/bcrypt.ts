import bcrypt from 'bcryptjs'

export const bcryptAdapter = {
    hash: (password: string) => {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    },
    compare: (password: string, hash: string) => {
        return bcrypt.compareSync(password, hash);
    }
}