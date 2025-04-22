import { Service } from "../../services/models/bussines-service.interface";

export interface Invoice {
    invoiceNumber: string;
    client: string;
    employ: string;
    date: string;
    service: string[];
    payment_method: string;
    pago: number;
    cambio: number;
    total: number;
    items: Service[];
    subtotal: number;
}
