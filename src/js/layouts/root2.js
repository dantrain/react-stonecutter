import partition from 'lodash.partition';

export default function(items, props) {
  const { columns, columnWidth } = props;

  const columnHeights = [];
  for (let i = 0; i < columns; i++) { columnHeights.push(0); }

  let tries = 0;
  let positions = [];
  const positionsHash = {};

  if (items.length) {
    const toLayout = [...items];

    while (toLayout.length) {

      const toLayoutRow = [];
      const toLayoutColumnHeights = [...columnHeights];

      for (let i = 0, j = 0; i < toLayout.length && j < columns; i++) {
        const item = toLayout[i];
        if (!item.doubleSize) j++;
        toLayoutRow.push(item);
      }

      const [double, single] = partition(toLayoutRow, item => item.doubleSize);

      for (let i = 0; i < columns - 1; i++) {
        if (double.length && toLayoutColumnHeights[i] !== null &&
              toLayoutColumnHeights[i] === toLayoutColumnHeights[i + 1]) {
          const item = double.shift();
          const height = Math.round(item.itemRect.height);
          const x = i * columnWidth;
          const y = toLayoutColumnHeights[i];

          toLayoutColumnHeights[i] = null;
          if (i < toLayoutColumnHeights.length - 1) toLayoutColumnHeights[i + 1] = null;

          columnHeights[i] += height;
          columnHeights[i + 1] += height;

          toLayout.splice(toLayout.indexOf(item), 1);
          positionsHash[item.key] = [x, y];
        }
      }

      let singleColumns = toLayoutColumnHeights.filter(_ => _ !== null);

      while (singleColumns.length && single.length) {
        const column = toLayoutColumnHeights.indexOf(Math.min.apply(null, singleColumns));

        const item = single.shift();
        const height = Math.round(item.itemRect.height);
        const x = column * columnWidth;
        const y = toLayoutColumnHeights[column];

        toLayoutColumnHeights[column] = null;
        columnHeights[column] += height;

        toLayout.splice(toLayout.indexOf(item), 1);
        positionsHash[item.key] = [x, y];

        singleColumns = toLayoutColumnHeights.filter(_ => _ !== null);
      }

      if (double.length && !single.length) {
        tries++;

        if (tries > 5) {
          console.log('Oh God', double.map(item => item.key));
          break;
        }
      } else {
        tries = 0;
      }

    }

  }

  positions = items.map(item => positionsHash[item.key] || [0, 2000]);

  const gridWidth = columns * columnWidth;
  const gridHeight = Math.max.apply(null, columnHeights);

  return { positions, gridWidth, gridHeight };
}
