import { Client } from "../../clients/models/client.model";

export interface Appointment {
    id: string;
    status:string;
    clientId: string[];
    servicesId: string[];
    date: string;
}