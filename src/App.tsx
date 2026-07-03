import type { WidgetOptions } from "./index.widget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CategoryPage from "./Pages/CategoryPage";
import "rentbook/microfrontend.min.css"

interface AppProps {
  options: WidgetOptions;
}
const queryClient = new QueryClient();

function App({ options }: AppProps) {
  return (
    <>
     <QueryClientProvider client={queryClient}>
      <CategoryPage></CategoryPage>
    </QueryClientProvider>
     </>
  );
}

export default App;