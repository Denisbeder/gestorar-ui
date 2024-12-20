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
