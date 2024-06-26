export interface ICreditCardPayment {
  creditCard: string;
  cvv: string;
  fullName: string;
  cardMonth: string;
  cardYear: string;
  termsOfUse: boolean;
}

export interface IPixPayment {
  cpf: string;
  termsOfUse: boolean;
}

export interface IPaymentResponseData {
  invoiceId: string;
  qrCodeValue?: { image: string; text: string };
}
