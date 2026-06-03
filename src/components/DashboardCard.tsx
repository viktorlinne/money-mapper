import type { ReactNode } from "react";
import { motion } from "motion/react";

type DashboardCardProps = {
  label: string;
  value: ReactNode;
  helperText?: string;
  delay?: number;
};

export function DashboardCard({
  label,
  value,
  helperText,
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-structure bg-surface p-5"
    >
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-2 text-4xl font-bold tabular-nums text-ink">
        {value}
      </p>

      {helperText && (
        <p className="mt-1.5 text-sm text-ink-muted">{helperText}</p>
      )}
    </motion.div>
  );
}
