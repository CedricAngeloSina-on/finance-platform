import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type AmountInputProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function AmountInput({
  value,
  onChange,
  placeholder,
  disabled,
}: AmountInputProps) {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;

    const newValue = parseFloat(value) * -1;
    onChange(newValue.toString());
  };

  return (
    <>
      <div className="flex">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "absolute p-2",
                  isIncome && "bg-emerald-500 hover:bg-emerald-600",
                  isExpense && "bg-rose-500 hover:bg-rose-600",
                )}
                onClick={onReverseValue}
                type="button"
                variant="outline"
              >
                {!parsedValue && <Info className="size-4" />}
                {isIncome && <PlusCircle className="size-4" />}
                {isExpense && <MinusCircle className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Use [+] for income and [-] for expenses
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CurrencyInput
          className="ml-10 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          prefix="₱"
          placeholder={placeholder}
          value={value}
          decimalsLimit={2}
          decimalScale={2}
          disabled={disabled}
          onValueChange={onChange}
        />
      </div>
      <p className="mt-2 h-1 text-xs text-muted-foreground">
        {isIncome && "This will count as income"}
        {isExpense && "This will count as an expense"}
      </p>
    </>
  );
}
