export interface ISubscriptionIuguService {
  plan_identifier: string;
  payable_with: "pix" | "credit_card";
  payer_cpf_cnpj: string;
  token: string;
}

export const SUBSCRIPTION_STATUS = {
  TRIAL: "trial",
  TRIAL_ENDED: "trial_ended",
  PREMIUM: "premium",
  COMMON: "common",
};

export const INVOICE_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "canceled",
  PARTIALLY_PAID: "partially_paid",
  REFUNDED: "refunded",
  EXPIRED: "expired",
  AUTHORIZED: "authorized",
  EXTERNALLY_PAID: "externally_paid",
  IN_PROTEST: "in_protest",
  CHARGEBACK: "chargeback",
};
