import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function fillMissingDays(
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const findActiveDay = (
    activeDays: { date: Date; income: number; expenses: number }[],
    day: Date,
  ) => activeDays.find((d) => isSameDay(d.date, day));

  const createDefaultTransaction = (day: Date) => ({
    date: day,
    income: 0,
    expenses: 0,
  });

  const transactionsByDay = allDays.map((day) => {
    const activeDay = findActiveDay(activeDays, day);
    return activeDay ?? createDefaultTransaction(day);
  });

  return transactionsByDay;
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
}
