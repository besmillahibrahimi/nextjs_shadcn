// jest.setup.ts
// jest.setup.ts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

import "@testing-library/jest-dom";
