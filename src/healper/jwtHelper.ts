import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
const generateToken = (payload: any, secret: Secret, expiresIn: string | number) => {
    const token = jwt.sign(payload, secret, { algorithm: "HS256", expiresIn } as jwt.SignOptions);
    return token;
};
const verifyToken = (token: string, secret: Secret) => {
    try {
         return jwt.verify(token, secret) as JwtPayload 
    } catch (error) {
        throw new Error("Yor are not authorized!")
    }
}
export const jwtHelper = { generateToken, verifyToken }