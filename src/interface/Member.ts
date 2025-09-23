export interface Member {
    id: number;
    name: string;
    specialty: "Presidente" | "Secretario" | "Tesorero" | "Vicepresidente";
    image: string;
}