import CSSGrid from "./components/CSSGrid";
import SpringGrid from "./components/SpringGrid";

import makeResponsive from "./higher-order-components/makeResponsive";
import measureItems from "./higher-order-components/measureItems";

import pinterest from "./layouts/pinterest";
import simpleLayout from "./layouts/simple";

import * as foldUp from "./enter-exit-styles/foldUp";
import * as fromCenter from "./enter-exit-styles/fromCenter";
import * as fromLeftToRight from "./enter-exit-styles/fromLeftToRight";
import * as fromTop from "./enter-exit-styles/fromTop";
import * as fromBottom from "./enter-exit-styles/fromBottom";
import * as newspaper from "./enter-exit-styles/newspaper";
import * as simpleEnterExit from "./enter-exit-styles/simple";
import * as skew from "./enter-exit-styles/skew";

import * as easings from "./utils/easings";

export const layout = {
  pinterest,
  simple: simpleLayout
};

export const enterExitStyle = {
  foldUp,
  fromCenter,
  fromLeftToRight,
  fromTop,
  fromBottom,
  newspaper,
  simple: simpleEnterExit,
  skew
};

export { CSSGrid, SpringGrid, measureItems, makeResponsive, easings };

export default {
  CSSGrid,
  SpringGrid,
  measureItems,
  makeResponsive,
  easings,
  layout,
  enterExitStyle
};
