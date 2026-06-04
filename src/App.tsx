import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { BudgetsPage } from "./pages/BudgetsPage";
import { ImportPage } from "./pages/ImportPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SubscriptionsPage } from "./pages/SubscriptionsPage";
import { TransactionsPage } from "./pages/TransactionsPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
