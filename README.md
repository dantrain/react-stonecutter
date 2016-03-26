# react-stonecutter

Animated grid layout component for React, inspired by [Masonry](http://masonry.desandro.com/).  
Choose between CSS Transitions or [React-Motion](https://github.com/chenglou/react-motion) for animation.

[Demo](http://dantrain.github.io/react-stonecutter)  

[](http://dantrain.github.io/react-stonecutter)

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
import { SpringGrid, measureItems } from 'react-stonecutter';

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

Exports:
* `SpringGrid`
* `CSSGrid`
* `measureItems`
* `makeResponsive`
* `layout`
* `enterExitStyle`
* `easings`

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
Change the HTML tagName of the Grid element, for example to `'ul'` or `'ol'` for a list. Default: `'div'`.

**layout={`Function`}**  
Use one of the included layouts, or create your own. Defaults to a 'simple' layout with items of fixed height.  
Included layouts:
```js
import { layout } from 'react-stonecutter';

const { simple, pinterest } = layout;
```

The function is passed two parameters; an `Array` of the props of each item, and the props of the Grid itself.
It must return an object with this shape:
```js
{
  positions: // an Array of [x, y] coordinate pairs like this: [[0, 0], [20, 0], [0, 30]]
  gridWidth: // width of the entire grid (Number)
  gridHeight: // height of the entire grid (Number)
}
```
Have a look at the code for the included layouts to get a feel for creating your own.

**enter={`Function`}**  
**entered={`Function`}**  
**exit={`Function`}**  
TODO

**perspective={`Number`}**  
TODO

**lengthUnit={`String`}**  
TODO. Default: `'px'`.

**angleUnit={`String`}**  
TODO. Default: `'deg'`.

### SpringGrid only props

**springConfig={`Object`}**  
Configuration of the React-Motion spring. See the [React-Motion docs](https://github.com/chenglou/react-motion#helpers) for more info.
Default: `{ stiffness: 60, damping: 14, precision: 0.1 }`.

### CSSGrid only props

**duration={`Number`}**  
Animation duration in `ms`. Required.

**easing={`String`}**  
Animation easing function in CSS [transition-timing-function](https://developer.mozilla.org/en/docs/Web/CSS/transition-timing-function) format. Some [Penner easings](https://matthewlein.com/ceaser/) are included for convenience:
```js
import { easings } from 'react-stonecutter';

const { quadIn, quadOut, /* ..etc. */  } = easings;
```
Default: `easings.cubicOut`.

### makeResponsive options
Pass like this:
```js
const Grid = makeResponsive(SpringGrid, { maxWidth: 1920 })
```

**maxWidth: `Number`**  
Maximum width for the Grid in `px`.

**minPadding: `Number`**  
Minimum horizontal length between the edge of the Grid and the edge of the viewport in `px`. Default: `0`.

**defaultColumns: `Number`**  
Default number of columns before the breakpoints kick in. May be useful when rendering server-side in a universal app. Default: `4`.

## License

MIT
