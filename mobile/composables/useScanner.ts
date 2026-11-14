/**
 * The phone camera as a QR reader (Tauri barcode-scanner plugin, Android and iOS only).
 * `available` is false in a browser or on desktop, where the member types the code instead.
 * `isTauri` comes from the layer's app-core utils (auto-imported).
 */
export const useScanner = () => {
  const available = ref(false)
  onMounted(() => {
    available.value = isTauri() && /android|iphone|ipad/i.test(navigator.userAgent)
  })

  /** Opens the camera and resolves with the QR text, or null when the member backs out. Throws 'camera_denied'. */
  const scan = async (): Promise<string | null> => {
    const { scan: scanCode, Format, checkPermissions, requestPermissions } = await import('@tauri-apps/plugin-barcode-scanner')
    let permission = await checkPermissions()
    if (permission !== 'granted') permission = await requestPermissions()
    if (permission !== 'granted') throw new Error('camera_denied')
    try {
      const result = await scanCode({ windowed: false, formats: [Format.QRCode] })
      return result?.content ?? null
    } catch {
      return null
    }
  }

  return { available, scan }
}
