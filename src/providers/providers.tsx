import { AppProvider } from "./app.provider";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppProvider>{children}</AppProvider>;
}
