export type AggregatedExpense = {
  label: string;
  category_id: string;
  amount: number;
}

// {
//   "id": 46,
//   "name": "Автомобиль",
//   "parentId": null,
//   "parentName": null,
//   "totalExpenses": 0.0,
//   "currencyCode": null,
//   "isParent": true
// },
export type CategoryExpense = {
  id: number;
  name: string;
  parentId: number | null;
  parentName: string | null;
  totalExpenses: number;
  currencyCode: string | null;
  isParent: boolean;
};