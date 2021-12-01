export const getRandomCanvasCoordinate = () => {
  const min = 0;
  const max = 98;
  const x = Math.floor((Math.random() * (max-min + 1) + min)/2) * 2;
  const y = Math.floor((Math.random() * (max-min + 1) + min)/2) * 2;

  return [x, y]
};