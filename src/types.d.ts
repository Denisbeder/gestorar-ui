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
type CustomerTypeType = 'cpf' | 'cnpj';

type AddressModelType<T = AddressTypeType> = {
    type?: T;
    zipcode?: number | null;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    complement?: string;
    created_at?: string;
    updated_at?: string;
};

type ContactModelType = {
    type?: ContactTypeType;
    value: string;
    description?: string;
    properties?: object;
    created_at?: string;
    updated_at?: string;
};

type PeopleModelType = {
    first_name: string;
    last_name?: string | null;
    cpf?: number | null;
    created_at?: string;
    updated_at?: string;
    contacts: ContactModelType[];
    addresses: AddressModelType[];
};

type CompanyModelType = {
    name: string;
    legal_name?: string | null;
    cnpj?: number | null;
    created_at?: string;
    updated_at?: string;
    contacts: ContactModelType[];
    addresses: AddressModelType[];
};

type CustomerModelType = {
    id: number;
    customerable_type: string;
    customerable_id: number;
    type: CustomerTypeType;
    created_at: string;
    updated_at: string;
    customerable: PeopleModelType | CompanyModelType;
};

type CustomerFormType = {
    type: CustomerTypeType;
} & PeopleModelType &
    CompanyModelType;
