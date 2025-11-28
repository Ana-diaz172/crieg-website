export interface Certificate {
    label: string;
    link: string;
};

export interface AnnualCertificate {
    id: string;
    year: string;
    certificates: Certificate[];
};
