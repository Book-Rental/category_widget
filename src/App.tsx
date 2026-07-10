import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CategoryPage from "./Pages/CategoryPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css"
type AppProps = {
  userId: string;
};

function App({ userId }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryPage userId={userId}/>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;