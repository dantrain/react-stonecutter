export const enter = () => ({
  scale: 0,
  opacity: 0,
  rotate: -720
});

export const exit = () => ({ scale: 0, opacity: 0 });

export const entered = () => ({ scale: 1, opacity: 1, rotate: 0 });
