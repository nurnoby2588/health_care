import { Response } from "express"

const setCookie = (res: Response, fieldName: string, token: string) => {
    res.cookie(`${fieldName}`, token, {
        secure: false,
        httpOnly: true
    })
}
export default setCookie