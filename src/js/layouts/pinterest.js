
export default function(items, props) {
  const { columns, columnWidth, gutterWidth, gutterHeight } = props;

  const columnHeights = [];
  for (let i = 0; i < columns; i++) { columnHeights.push(0); }

  const positions = items.map(itemProps => {
    const column = columnHeights.indexOf(Math.min.apply(null, columnHeights));

    const height = Math.round(itemProps.itemRect.height);

    if (!(height && typeof height === 'number')) {
      throw new Error('Each child must have an "itemRect.height" prop.');
    }

    const x = column * columnWidth + column * gutterWidth;
    const y = columnHeights[column];

    columnHeights[column] += height + gutterHeight;

    return { x, y };
  });

  const gridWidth = columns * columnWidth + ((columns - 1) * gutterWidth);
  const gridHeight = Math.max.apply(null, columnHeights) - gutterHeight;

  return { positions, gridWidth, gridHeight };
}
