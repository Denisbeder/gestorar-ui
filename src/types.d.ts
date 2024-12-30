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

type UserModelType = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
};

type PaginationType<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
};

type AddressTypeType = 'home' | 'commercial' | 'billing';
type ContactTypeType = 'text' | 'phone' | 'email';
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
    properties?: { whatsapp?: boolean };
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
    name?: string;
    customerable_type: string;
    customerable_id: number;
    type: CustomerTypeType;
    created_at: string;
    updated_at: string;
    customerable: PeopleModelType & CompanyModelType;
};

type CustomerFormType = {
    type: CustomerTypeType;
} & PeopleModelType &
    CompanyModelType;
