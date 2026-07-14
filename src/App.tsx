import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CategoryPage from "./Pages/CategoryPage";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css"


function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryPage/>
    </QueryClientProvider>
  );
}

export default App;