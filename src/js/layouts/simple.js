
export default function(items, props) {
  const { columnWidth, itemHeight = 150, columns,
    gutterWidth, gutterHeight } = props;

  const positions = items.map((itemProps, i) => {
    const column = i % columns;
    const row = Math.floor(i / columns);

    const translateX = column * columnWidth + column * gutterWidth;
    const translateY = row * itemHeight + row * gutterHeight;

    return { translateX, translateY };
  });

  const gridWidth = columns * columnWidth + ((columns - 1) * gutterWidth);
  const gridHeight = Math.ceil(items.length / columns) *
    (itemHeight + gutterHeight) - gutterHeight;

  return { positions, gridWidth, gridHeight };
}
