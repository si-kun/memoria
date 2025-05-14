
export interface signupLabelItem {
    label: string;
    type: string;
    name: string;
    placeholder: string;
}

export const signupLabelItems: signupLabelItem[] = [
    {
        label: "Display Name",
        type: "text",
        name: "displayName",
        placeholder: "Enter your display name",
    },
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
    },
    {
        label: "Avatar",
        name: "avatar",
        placeholder: "Upload your avatar Image(optional)",
        type: "file"
    }
]