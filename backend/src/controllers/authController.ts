import { Request, Response } from "express";
import { loginUser, changeUserPassword } from "../services/authService";

export const login = async (
    req: Request,
    res: Response
) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({
                message: "Required fields are missing"
            })
        }

        const result = await loginUser(email,password)

        res.status(200).json({
            message: "Login Successfull",
            ...result
        })

    } catch ( err: any ) {
        res.status(500).json({
            message: err.message
        })
    }
}

// export const changePassword = async (
//     req: Request,
//     res: Response
// ) => {
//     try {

//         if (!req.user) {
//             res.status(400).json({
//                 message: "Unauthorized"
//             })
//         }

//         const {oldPassword, newPassword} = req.body

//         if (!oldPassword || !newPassword) {
//             res.status(400).json({
//                 message: "Required fields are missing"
//             })
//         }

//         const result = await changeUserPassword(
//             req.user.id,
//             oldPassword,
//             newPassword
//         )

//         res.status(200).json(result)

//     } catch (err : any) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }