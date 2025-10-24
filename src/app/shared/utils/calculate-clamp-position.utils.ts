export function calculateClampPositionInPercent(
  xPixels: number,
  yPixels: number,
  elementRect: DOMRect,
  containerRect: DOMRect,
) {
  // Ограничиваем перетаскивание границами контейнера
  const maxX = containerRect.width - elementRect.width;
  const maxY = containerRect.height - elementRect.height;

  // Ограничиваем координаты в пикселях
  const clampedXPixels = Math.max(0, Math.min(xPixels, maxX));
  const clampedYPixels = Math.max(0, Math.min(yPixels, maxY));

  // Конвертируем пиксели обратно в проценты
  const newXPercent = (clampedXPixels / containerRect.width) * 100;
  const newYPercent = (clampedYPixels / containerRect.height) * 100;

  return { x: newXPercent, y: newYPercent };
}
