import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "../features/transactions/transactionUtils";

type AnimatedCurrencyProps = {
  amount: number;
};

export function AnimatedCurrency({ amount }: AnimatedCurrencyProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const previousAmount = useRef(amount);

  useEffect(() => {
    const animatedValue = { value: previousAmount.current };

    const animation = animate(animatedValue, {
      value: amount,
      duration: 650,
      ease: "outExpo",
      onRender: () => {
        setDisplayAmount(animatedValue.value);
      },
    });
    previousAmount.current = amount;

    return () => {
      animation.revert();
    };
  }, [amount]);

  return <>{formatCurrency(displayAmount)}</>;
}
