import ProductListing from "./components/ProductListing";
import type { WidgetOptions } from "./index.widget";
import 'rentbook/microfrontend.min.css'


interface AppProps {
  options: WidgetOptions;
}

const App: React.FC<AppProps> = ({ options }) => {
    return (
      <>
        <div>Hello category {options.name}</div>
        <ProductListing />
      </>
    );
}

export default App;