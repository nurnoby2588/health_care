import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import ApiError from '../app/errors/ApiError';
import status from 'http-status';
const generateToken = (payload: any, secret: Secret, expiresIn: string | number) => {
    const token = jwt.sign(payload, secret, { algorithm: "HS256", expiresIn } as jwt.SignOptions);
    return token;
};
const verifyToken = (token: string, secret: Secret) => {
    try {
         return jwt.verify(token, secret) as JwtPayload 
    } catch (error) {
        throw new ApiError(status.UNAUTHORIZED,"Yor are not authorized your token is invalid or expire !")
    }
}
export const jwtHelper = { generateToken, verifyToken }