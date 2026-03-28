import { ApplicationController } from './classes/ApplicationController.js';
function wireControllerToWindow(controller) {
    window.controller = controller;
}
function startWhenDomReady(run) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
        return;
    }
    run();
}
const app = new ApplicationController();
wireControllerToWindow(app);
startWhenDomReady(() => app.start());
//# sourceMappingURL=index.js.map