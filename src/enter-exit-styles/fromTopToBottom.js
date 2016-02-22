
export const enter = () => ({ translateY: -500, opacity: 0 });

export const exit = (itemProps, gridProps, gridState) => ({
  translateY: gridState.gridHeight + 500,
  opacity: 0
});

export const entered = () => ({ opacity: 1 });
