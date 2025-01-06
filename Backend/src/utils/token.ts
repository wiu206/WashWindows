import jwt from 'jsonwebtoken'

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY
if (!SECRET_KEY) {
    throw new Error('請在.env中確認環境變數皆正確設定');
}

export const generateToken = (_id: string, userRole: 'user' | 'admin'): string => {
    return jwt.sign({_id, userRole}, SECRET_KEY, { expiresIn: '3h' });
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};