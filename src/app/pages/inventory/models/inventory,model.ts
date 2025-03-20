import { Supplier } from "./suppliers.model";

export interface Inventory {
    id: string;
    name: string;
    price: number;
    min_stock: number;
    quantity: number;
    supplier: Supplier;
}
