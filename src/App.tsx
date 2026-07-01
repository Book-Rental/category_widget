import { WidgetOptions } from "./index.widget";


interface AppProps {
  options?: WidgetOptions;
}

function App({ options }: AppProps) {
  return (
    <div>Hello</div>
  );
}

export default App;