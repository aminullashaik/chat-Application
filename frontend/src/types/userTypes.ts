export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    mobile: string;
    status?: "Online" | "Offline";
    role?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: string;
    status: boolean;
}

export interface EditUserInput{
    name?: string;
    email?: string;
    password?: string;
    mobile?: string;
    status?: boolean;
    role?: string;
}