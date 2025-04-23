import DashboardHeader from "./_components/dashboard-header";

export default function Template({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <div>
      <DashboardHeader />
      {children}
    </div>
  );
}
