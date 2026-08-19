export type MealItem = {
  dishId: string;
  restaurantId: string;

  name: string;
  image?: string | null;

  price: number;
  quantity: number;

  customizations?: {
    size?: string;
    addOns?: string[];
    instructions?: string;
    unitPrice?: number;
  };
};