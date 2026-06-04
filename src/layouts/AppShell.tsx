import { AnimatePresence, motion } from "motion/react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", to: "/app" },
  { label: "Transactions", to: "/app/transactions" },
  { label: "Budgets", to: "/app/budgets" },
  { label: "Subscriptions", to: "/app/subscriptions" },
  { label: "Reports", to: "/app/reports" },
  { label: "Import", to: "/app/import" },
  { label: "Settings", to: "/app/settings" },
];

export function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-structure bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold tracking-tight text-ink">
              MoneyMapper
            </p>
            <p className="text-xs text-ink-muted">Single-user MySQL workspace</p>
          </div>

          <motion.nav
            className="flex gap-2 overflow-x-auto"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.045 } },
            }}
            aria-label="Primary navigation"
          >
            {navigationItems.map((item) => (
              <motion.div
                key={item.to}
                variants={{
                  hidden: { opacity: 0, y: -6 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === "/app"}
                  className={({ isActive }) =>
                    [
                      "relative block whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "font-semibold text-white"
                        : "font-medium text-ink-muted hover:text-ink",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="active-navigation-pill"
                          className="absolute inset-0 rounded-xl bg-accent"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="mx-auto max-w-7xl px-6 py-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
