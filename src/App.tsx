import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CategoryPage from "./Pages/CategoryPage";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css"
type AppProps = {
  userId: string;
};

function App({ userId }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryPage userId={userId}/>
    </QueryClientProvider>
  );
}

export default App;