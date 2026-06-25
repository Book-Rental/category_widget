import { WidgetOptions } from "./index.widget";


interface AppProps {
  options?: WidgetOptions;
}

const App: React.FC<AppProps> = ({ options }: any) => {
  console.log(options);

  const handleIncrease = () => {
    const event = new CustomEvent("increase-counter", {
      detail: {
        value: 2,
      },
    });

    window.dispatchEvent(event);
  };

  return (
    <>
      This is My Widget

      <button onClick={handleIncrease}>
        Increase Counter
      </button>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
};

export default App;