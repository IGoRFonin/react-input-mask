import * as ReactDOM from "react-dom";

let createRoot = null;
try {
  // React 18/19. На React 17 модуля нет — остаёмся на legacy-рендере.
  ({ createRoot } = await import("react-dom/client"));
} catch (e) {
  if (
    e.code !== "MODULE_NOT_FOUND" &&
    !String(e.message).includes("react-dom/client")
  )
    throw e;
  createRoot = null;
}

// eslint-disable-next-line import/prefer-default-export
export function createTestRoot(container) {
  if (createRoot) {
    const root = createRoot(container);
    return {
      render(element) {
        // createRoot().render асинхронный; тесты читают DOM сразу после рендера
        ReactDOM.flushSync(() => {
          root.render(element);
        });
      },
      unmount() {
        root.unmount();
      },
    };
  }

  // React 17 fallback
  return {
    render(element) {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(element, container);
    },
    unmount() {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
