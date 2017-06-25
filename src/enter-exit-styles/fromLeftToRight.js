export const enter = () => ({ translateX: -500, opacity: 0 });

export const exit = (itemProps, gridProps, gridState) => ({
  translateX: gridState.gridWidth + 500,
  opacity: 0
});

export const entered = () => ({ opacity: 1 });
