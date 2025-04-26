import { AppProvider } from "./app.provider";
import { ThemeProvider } from "./them.provider";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AppProvider>
  );
}
