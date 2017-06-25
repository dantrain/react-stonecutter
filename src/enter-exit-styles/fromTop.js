const enterExit = () => ({ translateY: 0, opacity: 0 });

export const enter = enterExit;
export const exit = enterExit;

export const entered = () => ({ opacity: 1 });
