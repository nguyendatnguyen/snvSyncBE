
export interface CreateVariantDto {
    title: string;
    price: string;
    sku: string;
    position: number;
    inventory_policy: string;
    compare_at_price: string;
    fulfillment_service: string;
    inventory_management: string;
    option1: string;
    option2: string;
    option3?: any;
    taxable: boolean;
    barcode?: any;
    grams: number;
    image_id?: number | null;
    weight: number;
    weight_unit: string;
    requires_shipping: boolean;
}
