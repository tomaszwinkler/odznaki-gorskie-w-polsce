export function computeScaledDimensions(width, height, maxDimension) {
  const longerSide = Math.max(width, height)
  if (longerSide <= maxDimension) return { width, height }

  const scale = maxDimension / longerSide
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

// Korzysta z canvasa przeglądarki (createImageBitmap/toBlob), więc nie da się
// tego przetestować jednostkowo w Vitest/Node bez jsdom + polyfill canvasa —
// zweryfikowane ręcznie w przeglądarce zamiast testem automatycznym.
// Przy błędzie dekodowania (uszkodzony plik, nieobsługiwany format) zwraca
// oryginalny plik, żeby użytkownik nie stracił zdjęcia.
export async function compressImageFile(file, { maxDimension = 1600, quality = 0.8 } = {}) {
  if (!file.type.startsWith('image/')) return file

  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = computeScaledDimensions(bitmap.width, bitmap.height, maxDimension)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob) return file

    return new File([blob], file.name, { type: 'image/jpeg' })
  } catch {
    return file
  }
}
