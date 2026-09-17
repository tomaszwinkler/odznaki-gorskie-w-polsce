export async function blobToDataUrl(blob) {
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return `data:${blob.type};base64,${btoa(binary)}`
}

export function dataUrlToFile(dataUrl, name) {
  const [header, base64] = dataUrl.split(',')
  const type = /data:(.*);base64/.exec(header)?.[1] ?? 'application/octet-stream'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new File([bytes], name, { type })
}

export const CURRENT_SCHEMA_VERSION = 1

async function photoToExportable(photo) {
  return { name: photo.name, type: photo.type, dataUrl: await blobToDataUrl(photo) }
}

export async function buildExportPayload(entries) {
  const exportableEntries = await Promise.all(
    entries.map(async ({ id: _id, photos, ...entry }) => ({
      ...entry,
      photos: await Promise.all(photos.map(photoToExportable)),
    })),
  )

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    entries: exportableEntries,
  }
}

export async function parseImportPayload(json) {
  let payload
  try {
    payload = JSON.parse(json)
  } catch {
    throw new Error('Nieprawidłowy plik: to nie jest poprawny plik JSON.')
  }

  if (payload.schemaVersion === undefined) {
    throw new Error('Nieprawidłowy plik: brak numeru wersji schematu (schemaVersion).')
  }
  if (payload.schemaVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Ten plik pochodzi z nowszej wersji aplikacji (schemat ${payload.schemaVersion}) — zaktualizuj aplikację, aby go zaimportować.`,
    )
  }
  if (!Array.isArray(payload.entries)) {
    throw new Error('Nieprawidłowy plik: brak listy wpisów dziennika (entries).')
  }
  payload.entries.forEach((entry, index) => {
    if (typeof entry.date !== 'string') {
      throw new Error(`Nieprawidłowy plik: wpis nr ${index + 1} nie ma poprawnej daty.`)
    }
  })

  const entries = await Promise.all(
    payload.entries.map(async (entry) => ({
      ...entry,
      photos: await Promise.all(entry.photos.map((photo) => dataUrlToFile(photo.dataUrl, photo.name))),
    })),
  )

  return { entries }
}
