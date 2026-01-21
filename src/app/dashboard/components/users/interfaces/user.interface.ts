export interface User {
    _id?: string;
    nameUser: string;
    userType: UserType | null;
    email: string;
    password: string;
    createdAt?: number;
    updatedAt?: number;
    estado?: boolean;
}

export enum UserType {
    Administrador = 'administrador',
    Agente = 'agente',
    Operador = 'operador',
    Supervisor = 'supervisor',
    Mecanico = 'mecanico',
    Chofer = 'chofer',
    Secretaria = 'secretaria',
    Ingeniero = 'ingeniero'
}
