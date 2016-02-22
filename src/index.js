
import * as foldDown from './enter-exit-styles/foldDown';
import * as fromCenter from './enter-exit-styles/fromCenter';
import * as fromLeftToRight from './enter-exit-styles/fromLeftToRight';
import * as fromTop from './enter-exit-styles/fromTop';
import * as fromTopToBottom from './enter-exit-styles/fromTopToBottom';
import * as newspaper from './enter-exit-styles/newspaper';
import * as simpleEnterExit from './enter-exit-styles/simple';
import * as skew from './enter-exit-styles/skew';

import { default as pinterest } from './layouts/pinterest';
import { default as simpleLayout } from './layouts/simple';

import * as easings from './utils/easings';

export { default as CSSGrid } from './components/CSSGrid';
export { default as SpringGrid } from './components/SpringGrid';

export { default as makeResponsive } from './higher-order-components/makeResponsive';
export { default as measureItems } from './higher-order-components/measureItems';

export { easings };

export const layout = {
  pinterest,
  simple: simpleLayout
};

export const enterExitStyle = {
  foldDown,
  fromCenter,
  fromLeftToRight,
  fromTop,
  fromTopToBottom,
  newspaper,
  simple: simpleEnterExit,
  skew
};
