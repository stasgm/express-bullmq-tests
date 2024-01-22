export const getDelayByDate = (runAt: Date): number => {
  const targetTime = new Date(runAt);
  const delayTime = Number(targetTime) - Number(new Date());
  return delayTime > 0 ? delayTime : 0;
};
