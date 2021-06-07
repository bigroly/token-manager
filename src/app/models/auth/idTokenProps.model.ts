export interface IdTokenProps {
    userId: string;
    username : string;
    cognitoGroups: string[];
    tokenExpiry: number;
};