import { ApplicationController } from './classes/ApplicationController.js';

declare global {
  interface Window {
    controller: ApplicationController;
  }
}

function wireControllerToWindow(controller: ApplicationController): void {
  window.controller = controller;
}

function startWhenDomReady(run: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
    return;
  }
  run();
}

const app = new ApplicationController();
wireControllerToWindow(app);
startWhenDomReady(() => app.start());
