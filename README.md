# react-stonecutter

Animated grid layout component for React, inspired by [Masonry](http://masonry.desandro.com/).  
Choose between CSS Transitions or [React-Motion](https://github.com/chenglou/react-motion) for animation.

[Demo](http://dantrain.github.io/react-stonecutter)  

[![](http://i.imgur.com/VVv8lB2.gif)](http://dantrain.github.io/react-stonecutter)

## Installation

With [npm](https://www.npmjs.com/package/react-stonecutter):

```
npm install --save react-stonecutter
```

## Usage

A simple layout with items of equal height:

```js
import { SpringGrid } from 'react-stonecutter';
```
```xml
<SpringGrid
  component="ul"
  columns={5}
  columnWidth={150}
  gutterWidth={5}
  gutterHeight={5}
  itemHeight={200}
  springConfig={{ stiffness: 170, damping: 26 }}
>
  <li key="A">A</li>
  <li key="B">B</li>
  <li key="C">C</li>
</SpringGrid>
```

A Pinterest-style layout with varying item heights, this time using CSS transitions:

```js
import { CSSGrid, layout } from 'react-stonecutter';
```
```xml
<CSSGrid
  component="ul"
  columns={5}
  columnWidth={150}
  gutterWidth={5}
  gutterHeight={5}
  layout={layout.pinterest}
  duration={800}
  easing="ease-out"
>
  <li key="A" itemHeight={150}>A</li>
  <li key="B" itemHeight={120}>B</li>
  <li key="C" itemHeight={170}>C</li>
</CSSGrid>
```

If you don't know the heights of your items ahead of time, use the `measureItems` higher-order component to measure them in the browser before layout:

```js
import { SpringGrid, measureItems, layout } from 'react-stonecutter';

const Grid = measureItems(SpringGrid);
```
```xml
<Grid
  // ...etc.
>
  <li key="A">Who controls the British crown?</li>
  <li key="B">Who keeps the metric system down?</li>
  <li key="C">We do!</li>
  <li key="D">We do!</li>
</Grid>
```

If your grid spans the page and you want to vary the number of columns based on the viewport width, use the `makeResponsive` higher-order component which makes use of [enquire.js](http://wicky.nillia.ms/enquire.js/):
```js
import { CSSGrid, measureItems, makeResponsive } from 'react-stonecutter';

const Grid = makeResponsive(measureItems(CSSGrid), {
  maxWidth: 1920,
  minPadding: 100
});
```

## API Reference

### SpringGrid and CSSGrid props

**columns={`Number`}**  
Number of columns. Required.  
You can wrap the Grid component in the `makeResponsive` higher-order component to set this dynamically.

**columnWidth={`Number`}**  
Width of a single column, by default in `px` units. Required.

**gutterWidth={`Number`}**  
Width of space between columns. Default: `0`.

**gutterHeight={`Number`}**  
Height of vertical space between items. Default: `0`.

**component={`String`}**  
Change the HTML tagName of the Grid element, for example to `ul` or `ol` for a list. Default: `div`.

**layout={`Function`}**  
TODO

**enter={`Function`}**  
**entered={`Function`}**  
**exit={`Function`}**  
TODO

**perspective={`Number`}**  
TODO

**units={`Object`}**  
TODO

### SpringGrid only props

**springConfig={`Object`}**  
TODO. Default: `{ stiffness: 60, damping: 14, precision: 0.1 }`.

### CSSGrid only props

**duration={`Number`}**  
TODO. Required.

**easing={`Number`}**  
TODO. Default: `easings.cubicOut`.

### makeResponsive options
Pass like this:
```js
const Grid = makeResponsive(SpringGrid, { maxWidth: 1920 })
```

**maxWidth: `Number`**  
TODO. Required.

**minPadding: `Number`**  
TODO. Default: `0`.

**defaultColumns: `Number`**  
TODO. Default: `4`.
