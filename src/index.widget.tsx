import React from "react";
import { createRoot, Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

export interface CategoryWidgetOptions {
  containerElementId: string;
}

declare global {
  interface Window {
    renderCategoryWidget: (config: string) => void;
    unmountCategoryWidget: (containerId: string) => void;
  }
}

const roots: Record<string, Root> = {};
const queryClient = new QueryClient();

window.renderCategoryWidget = (config: string) => {
  let options: CategoryWidgetOptions;

  try {
    options = JSON.parse(config);
  } catch {
    console.error("Invalid widget config");
    return;
  }

  const container = document.getElementById(options.containerElementId);

  if (!container) {
    console.error(`Container '${options.containerElementId}' not found`);
    return;
  }

  if (roots[options.containerElementId]) {
    roots[options.containerElementId].unmount();
  }

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );

  roots[options.containerElementId] = root;
};

window.unmountCategoryWidget = (containerId: string) => {
  roots[containerId]?.unmount();
  delete roots[containerId];
};