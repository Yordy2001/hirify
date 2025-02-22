import { AdminData } from "./user-data.interface";

export interface RegisterTenantDto {
    name: string;
    logo: string;
    subdomain: string;
    colors: {
        primary: string;
    };
    adminData: AdminData;
}