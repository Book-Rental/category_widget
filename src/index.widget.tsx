import React from "react";
import App from "./App";
import { createRoot, Root as ReactRoot } from "react-dom/client";

export interface WidgetOptions {
  containerElementId: string;
  name?: string;
}

declare global {
  interface Window {
    renderReactWidget: (config: string) => void;
    unmountReactWidget: (id: string) => void;
  }
}

const widgetRoots: Record<string, ReactRoot> = {};

function Root({ options }: { options: WidgetOptions }) {
  return <App options={options} />;
}


const getOptionsFromDataAttributes = (
  el: HTMLElement
): Partial<WidgetOptions> => {
  return {
    name: el.getAttribute("data-name") || "",
  };
};

window.renderReactWidget = (config: string) => {
  let parsedOptions: Partial<WidgetOptions> = {};

  try {
    parsedOptions = JSON.parse(config);
  } catch {
    console.warn("Invalid JSON config, using data attributes");
  }

  const containerId = parsedOptions.containerElementId || config;

  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container "${containerId}" not found`);
    return;
  }

  // Read data attributes
  const dataOptions = getOptionsFromDataAttributes(container);

  // JSON values override data attributes
  const finalOptions: WidgetOptions = {
    ...dataOptions,
    ...parsedOptions,
    containerElementId: containerId,
  } as WidgetOptions;

  // Validate name
  if (!finalOptions.name) {
    console.error("Missing required field: name");
    return;
  }

  // Unmount previous widget if it exists
  if (widgetRoots[containerId]) {
    widgetRoots[containerId].unmount();
  }

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Root options={finalOptions} />
    </React.StrictMode>
  );

  widgetRoots[containerId] = root;
};

window.unmountReactWidget = (containerElementId: string) => {
  const root = widgetRoots[containerElementId];

  if (root) {
    root.unmount();
    delete widgetRoots[containerElementId];
  }
};