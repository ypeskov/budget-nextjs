export interface Category {
  name: string;
  parentId: number;
  isIncome: boolean;
  id: number;
  userId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  children: any[Category];
}

export interface CategoryExpense {
  id: number;
  name: string;
  totalExpenses: number;
  parentId: number | null;
  parentName: string | null;
  currencyCode: string;
  isParent: boolean;
}