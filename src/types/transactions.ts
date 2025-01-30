import { Account } from "@/types/accounts";
import { Category } from "@/types/categories";
import { User } from "@/types/users";

export type Transaction = {
  id: number;
  userId: number;
  accountId: number;
  targetAccountId: number | null;
  categoryId: number;
  amount: number;
  targetAmount: number | null;
  label: string;
  notes: string;
  dateTime: string; // ISO date string
  isTransfer: boolean;
  isIncome: boolean;
  user: User;
  account: Account;
  baseCurrencyAmount: number;
  baseCurrencyCode: string;
  newBalance: number;
  category: Category;
  linkedTransactionId: number | null;
}