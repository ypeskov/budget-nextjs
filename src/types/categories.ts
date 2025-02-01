export type Category = {
  name: string;
  parentId: number;
  isIncome: boolean;
  id: number;
  userId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  children: Category[];
}

export type CategoryExpense = {
  id: number;
  name: string;
  totalExpenses: number;
  parentId: number | null;
  parentName: string | null;
  currencyCode: string | null;
  isParent: boolean;
}