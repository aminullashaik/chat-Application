import  bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import { 
    findUserByEmail,
    findUserById,
    userRepository
} from "../repository/auth.repository";

export const loginUser = async (email: string, password: string) => {

    const existingUser = await findUserByEmail(email)

    if (!existingUser) {
        throw new Error("User doesn't exist")
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordMatch) {
        throw new Error("Password is incorrect")
    }

    const token = await jwt.sign(
        {id: existingUser.id, role: existingUser.role},
        "my_secreatkey_2026",
        {
            expiresIn : '1d'
        }
    )

    return {
        token,
        user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            mobile: existingUser.mobile,
            status: existingUser.status,
            role: existingUser.role
        }
    }
}

export const changeUserPassword = async (id: number, oldPassword: string, newPassword: string) => {

    const existingUser = await findUserById(id);

    if (!existingUser) {
        throw new Error("User doesn't exist.")
    }

    if (oldPassword === newPassword) {
        throw new Error("oldPassword and newPassword must be different")
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, existingUser.password)

    if (!isPasswordMatch) {
        throw new Error("Incorrect old password")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    existingUser.password = hashedPassword

    await userRepository.save(existingUser);

    return {
        message: "Password changed successfully."
    }
}