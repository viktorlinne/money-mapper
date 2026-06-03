import type { ReactNode } from "react";
import { motion } from "framer-motion";

type DashboardCardProps = {
  label: string;
  value: ReactNode;
  helperText?: string;
};

export function DashboardCard({
  label,
  value,
  helperText,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>

      {helperText && (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      )}
    </motion.div>
  );
}
