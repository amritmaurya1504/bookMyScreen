
export interface IVerifyPayment {
    razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature : string
}

export interface IPaymentData {
    amount : number;
}