import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { MealItem } from "@/types/meal";

type MealTrayContextType = {
  meal: MealItem[];

  addDish: (dish: MealItem) => void;

  removeDish: (dishId: string) => void;

  increaseQuantity: (dishId: string) => void;

  decreaseQuantity: (dishId: string) => void;

  clearMeal: () => void;

  getDishQuantity: (dishId: string) => number;

  totalPrice: number;

  totalItems: number;
};

const MealTrayContext =
  createContext<MealTrayContextType | null>(null);

export function MealTrayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [meal, setMeal] = useState<MealItem[]>([]);

  function addDish(dish: MealItem) {
    setMeal((current) => {
      const existing = current.find(
        (item) => item.dishId === dish.dishId
      );

      if (existing) {
        return current.map((item) =>
          item.dishId === dish.dishId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [...current, dish];
    });
  }

  function removeDish(dishId: string) {
    setMeal((current) =>
      current.filter((item) => item.dishId !== dishId)
    );
  }

  function increaseQuantity(dishId: string) {
    setMeal((current) =>
      current.map((item) =>
        item.dishId === dishId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(dishId: string) {
    setMeal((current) =>
      current
        .map((item) =>
          item.dishId === dishId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearMeal() {
    setMeal([]);
  }
  function getDishQuantity(dishId: string) {
  const item = meal.find(
    (dish) => dish.dishId === dishId
  );

  return item?.quantity ?? 0;
}

  const totalPrice = useMemo(
    () =>
      meal.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      ),
    [meal]
  );

  const totalItems = useMemo(
    () =>
      meal.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [meal]
  );

  return (
    <MealTrayContext.Provider
      value={{
  meal,
  addDish,
  removeDish,
  increaseQuantity,
  decreaseQuantity,
  clearMeal,

  getDishQuantity,

  totalItems,
  totalPrice,
}}
    >
      {children}
    </MealTrayContext.Provider>
  );
}

export function useMealTray() {
  const context = useContext(MealTrayContext);

  if (!context) {
    throw new Error(
      "useMealTray must be used inside MealTrayProvider"
    );
  }

  return context;
}