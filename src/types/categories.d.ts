interface Category {
  name: string;
  parentId: number;
  isIncome: boolean;
  id: number;
  userId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  children: any[Category];
}