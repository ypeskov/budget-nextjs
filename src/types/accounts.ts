export type Account = {
  userId: number;
  accountTypeId: number;
  currencyId: number;
  initialBalance: number;
  balance: number;
  creditLimit: number;
  name: string;
  openingDate: string;
  comment: string;
  isHidden: boolean;
  showInReports: boolean;
  id: number;
  currency: {
    id: number;
    code: string;
    name: string;
  };
  accountType: {
    id: number;
    type_name: string;
    is_credit: boolean;
  };
  isDeleted: boolean;
  isArchived: boolean;
  balanceInBaseCurrency: number;
  archivedAt: string;
}

export type BaseCurrency = {
  id: number;
  code: string;
  name: string;
}

export type Accounts = Account[];
