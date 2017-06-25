export const enterExit = (itemProps, gridProps, gridState) => ({
  translateY: gridState.gridHeight + 500,
  opacity: 0
});

export const enter = enterExit;
export const exit = enterExit;

export const entered = () => ({ opacity: 1 });
