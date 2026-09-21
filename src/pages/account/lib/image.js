/**
 * Уменьшает картинку и возвращает data-URL (JPEG), чтобы она поместилась
 * в localStorage (лимит ~5 МБ на весь сайт).
 */
export function resizeImage(file, maxWidth, maxHeight, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Выберите файл изображения'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Не удалось прочитать изображение'));
    };
    img.src = url;
  });
}
