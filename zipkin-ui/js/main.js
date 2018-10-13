// The import of 'publicPath' module has to be the first statement in this entry point file
// so that '__webpack_public_path__' (see https://webpack.github.io/docs/configuration.html#output-publicpath)
// is set soon enough.
// In the same time, 'contextRoot' is made available as the context root path reference.
import {TRACERPATHPREFIX} from './publicPath';

import {compose, registry, advice, debug} from 'flightjs';
import crossroads from 'crossroads';
import initializeDefault from './page/default';
import initializeTrace from './page/trace';
import initializeTraceViewer from './page/traceViewer';
import CommonUI from './page/common';
import loadConfig from './config';
import {errToStr} from './component_ui/error';

loadConfig().then(config => {
  debug.enable(false);
  compose.mixin(registry, [advice.withAdvice]);

  CommonUI.attachTo(window.document.body, {config});

  crossroads.addRoute(TRACERPATHPREFIX, () => initializeDefault(config));
  crossroads.addRoute(`${TRACERPATHPREFIX}traces/{id}`, traceId => initializeTrace(traceId, config)); // eslint-disable-line max-len

  crossroads.addRoute(`${TRACERPATHPREFIX}traceViewer`, () => initializeTraceViewer(config));
  crossroads.parse(window.location.pathname);
}, e => {
  // TODO: better error message, but this is better than a blank screen...
  const err = errToStr(e);
  document.write(`Error loading config.json: ${err}`);
});
