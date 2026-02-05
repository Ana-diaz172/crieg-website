export interface Member {
    id: number;
    name: string;
    specialty: "Presidente" | "Secretario" | "Tesorero" | "Vicepresidente";
    image: string;
}

export interface IInfoCard {
    id: string;
    title: string;
    description: string;
    rights: string[];
    obligations: string[];
};

export interface Membership {
    id: string;
    title: string;
    description: string;
    price: string;
    priceSuffix?: string;
    priceSuffixLines?: string[];
    ctaLabel?: string;
    features: string[];
    priceAmount: number;
};

export type IMembershipId =
    | "crieg-medicos"
    | "crieg-residentes"
    | "fmri"
    | "crieg-fmri"
    | "fmri-residentes"
    | "roms-prueba";

export interface ICheckoutMembership {
    name: string;
    price: string;
    description: string;
}