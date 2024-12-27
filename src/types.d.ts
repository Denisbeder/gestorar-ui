type AxiosErrorDataType = {
    message: string;
    errors?: {
        [key: string]: string[];
    };
};

type CredentialsType = {
    email: string;
    password: string;
};

type UserType = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
};

type AddressTypeType = 'home' | 'commercial' | 'billing';
type ContactTypeType = 'phone' | 'email';

type AddressModelType<T = AddressTypeType> = {
    type?: T;
    zip_code?: number | null;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    complement?: string;
};

type ContactModelType = {
    type?: ContactTypeType;
    value: string;
    details?: string;
};

type PersonModelType = {
    first_name: string;
    last_name?: string | null;
    cpf?: number | null;
    contacts: ContactModelType[];
    addresses: AddressModelType[];
};

type CompanyModelType = {
    name: string;
    legal_name?: string | null;
    cnpj?: number | null;
    contacts: ContactModelType[];
    addresses: AddressModelType[];
};

type CustomerFormType = {
    type: 'cpf' | 'cnpj';
} & PersonModelType &
    CompanyModelType;
