import type { ApplicationRef } from '@angular/core';
import { type BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext): Promise<ApplicationRef> =>
  bootstrapApplication(App, config, context);

export default bootstrap;
