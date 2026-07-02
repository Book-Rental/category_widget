import type { WidgetOptions } from "./index.widget";

interface AppProps {
  options: WidgetOptions;
}

function App({ options }: AppProps) {
  return (
     <div>Hello category{options.name}</div>
  );
}

export default App;