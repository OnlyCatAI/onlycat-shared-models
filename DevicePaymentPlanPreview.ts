import Stripe from "stripe";

export type DevicePaymentPlanLineItemType = "one-off" | "proration" | "recurring";

export interface DevicePaymentPlanLineItem {
    id: string;
    amount: number;
    currency: string;
    description: string;
    type: DevicePaymentPlanLineItemType;
}

export class DevicePaymentPlanPreview {
    invoice: Stripe.Invoice;
    lineItems: DevicePaymentPlanLineItem[];
    deviceId: string;
    currentDate: Date;
    startDate: Date | null;
    trialEndDate: Date | null;
    /** Undiscounted live Stripe price (pence). Only set when a lifetime discount applies. */
    originalAmount?: number;
    /** Realized discount, i.e. originalAmount minus the final unit amount (pence). Only set when a lifetime discount applies. */
    discountAmount?: number;
    /** Years (fractional, pro-rata) of accrued paid subscription time used to compute the discount. Only set when a lifetime discount applies. */
    yearsSubscribed?: number;
    /** The Stripe product ID backing the discounted lifetime price, reused so the checkout session charges the same amount. Only set when a lifetime discount applies. */
    lifetimeDiscountProductId?: string;

    constructor(initObj: {
        invoice: Stripe.Invoice;
        lineItems?: DevicePaymentPlanLineItem[];
        deviceId: string;
        currentDate: Date;
        startDate: Date | null;
        trialEndDate: Date | null;
        originalAmount?: number;
        discountAmount?: number;
        yearsSubscribed?: number;
        lifetimeDiscountProductId?: string;
    }) {
        this.invoice = initObj.invoice;
        this.lineItems = initObj.lineItems || [];
        this.deviceId = initObj.deviceId;
        this.currentDate = new Date(initObj.currentDate);
        this.startDate = initObj.startDate ? new Date(initObj.startDate) : null;
        this.trialEndDate = initObj.trialEndDate ? new Date(initObj.trialEndDate) : null;
        this.originalAmount = initObj.originalAmount;
        this.discountAmount = initObj.discountAmount;
        this.yearsSubscribed = initObj.yearsSubscribed;
        this.lifetimeDiscountProductId = initObj.lifetimeDiscountProductId;
    }

    /**
     * Gets the total amount of the invoice in the currency's smallest unit (e.g., cents)
     */
    get totalAmount(): number {
        return this.invoice.total || 0;
    }

    /**
     * Gets the formatted total amount of the invoice (e.g., $10.99)
     */
    get formattedTotal(): string {
        const amount = this.totalAmount / 100; // Convert from cents to dollars
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: this.invoice.currency || "usd"
        }).format(amount);
    }
}
