import { DashboardNavbar } from "@/components/dashboard/dashboard-layout";
import { menus } from "./admin/_data/menus";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardNavbar menus={menus}>{children}</DashboardNavbar>;
}
