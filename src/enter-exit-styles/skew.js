export const enter = () => ({
  skew: 90,
  rotate: 45,
  scale: 0,
  opacity: 0
});

export const exit = () => ({
  skew: -90,
  rotate: -45,
  scale: 0,
  opacity: 0
});

export const entered = () => ({
  skew: 0,
  rotate: 0,
  scale: 1,
  opacity: 1
});
