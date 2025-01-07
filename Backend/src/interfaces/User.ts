export interface User{
    _id?: string;
    username: string;
    password: string;
    email?: string;
    userRole: string;
    points?: number;
    clicked?: number;
}