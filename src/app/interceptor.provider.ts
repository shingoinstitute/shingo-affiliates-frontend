import { isDevMode } from '@angular/core';

import { LoggerInterceptor } from './services/http/logger.interceptor';
import { NoopInterceptor } from './services/http/noop.interceptor';

export function LoggerInterceptorProvider() {
  if (isDevMode()) { return new LoggerInterceptor(); }
  return new NoopInterceptor();
}