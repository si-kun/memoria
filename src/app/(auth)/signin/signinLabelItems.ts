export interface signinLabelItemType {
    label: string;
    type: string;
    name: string;
    placeholder: string;
}

export const signinLabelItems: signinLabelItemType[] = [
    {
        label: "Email",
        type: "email",
        name: "email",
        placeholder: "Enter your email",
    },
    {
        label: "Password",
        type: "password",
        name: "password",
        placeholder: "Enter your password",
    }
]