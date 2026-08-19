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

  updateDish: (dishId: string, updates: Partial<MealItem>) => void;

  setDishQuantity: (dishId: string, quantity: number) => void;

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
      const normalizedDish = {
        ...dish,
        quantity: Math.max(1, dish.quantity || 1),
      };

      const existing = current.find(
        (item) => item.dishId === normalizedDish.dishId
      );

      if (existing) {
        return current.map((item) =>
          item.dishId === normalizedDish.dishId
            ? {
                ...item,
                ...normalizedDish,
                quantity: item.quantity + normalizedDish.quantity,
                customizations: {
                  ...item.customizations,
                  ...normalizedDish.customizations,
                },
              }
            : item
        );
      }

      return [...current, normalizedDish];
    });
  }

  function updateDish(dishId: string, updates: Partial<MealItem>) {
    setMeal((current) =>
      current.map((item) => {
        if (item.dishId !== dishId) {
          return item;
        }

        return {
          ...item,
          ...updates,
          customizations: {
            ...item.customizations,
            ...updates.customizations,
          },
        };
      })
    );
  }

  function setDishQuantity(dishId: string, quantity: number) {
    setMeal((current) =>
      current
        .map((item) =>
          item.dishId === dishId
            ? {
                ...item,
                quantity: Math.max(0, quantity),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
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
        (sum, item) => {
          const unitPrice =
            item.customizations?.unitPrice ?? item.price;
          return sum + unitPrice * item.quantity;
        },
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
        updateDish,
        setDishQuantity,
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