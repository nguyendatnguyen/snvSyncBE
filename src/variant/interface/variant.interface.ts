export interface Variant {
    product_id: number
    id: number
    title: string
    price: string
    sku: string
    position: number
    inventory_policy: string
    compare_at_price: string
    fulfillment_service: string
    inventory_management: string
    option1: string
    option2: any
    option3: any
    created_at: string
    updated_at: string
    taxable: boolean
    barcode: string
    grams: number
    image_id: any
    weight: number
    weight_unit: string
    inventory_item_id: number
    inventory_quantity: number
    old_inventory_quantity: number
    requires_shipping: boolean
    admin_graphql_api_id: string
  }