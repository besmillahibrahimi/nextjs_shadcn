import PageInfo from "./page-info";
import StatusBar from "./status-bar";

export default function DashboardHeader() {
  return (
    <div className="w-full flex justify-between items-center">
      <PageInfo />
      <StatusBar />
    </div>
  );
}
