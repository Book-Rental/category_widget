import type { WidgetOptions } from "./index.widget";

interface AppProps {
  options: WidgetOptions;
}

function App({ options }: AppProps) {
  return <div>Hello {options.name}</div>;
}

export default App;