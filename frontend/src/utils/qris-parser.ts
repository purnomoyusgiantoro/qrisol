/**
 * QRIS Parser Utility
 * 
 * Parses QRIS (Quick Response Code Indonesian Standard) data
 * from scanned QR codes. QRIS uses EMVCo QR Code specification.
 * 
 * This will be fully implemented by Fajar in Sprint 2-3.
 */

export interface QRISData {
  merchantName: string
  merchantId: string
  merchantCity: string
  amount: number
  currency: string
  terminalId?: string
  rawData: string
}

/**
 * Parse raw QRIS string data into structured format.
 * QRIS follows TLV (Tag-Length-Value) format.
 */
export function parseQRIS(rawData: string): QRISData | null {
  try {
    // TLV parser for EMVCo QR Code
    const fields = parseTLV(rawData)

    // Extract merchant info from field 26 (Merchant Account Info)
    const merchantAccountInfo = fields.get('26') || ''
    const merchantFields = parseTLV(merchantAccountInfo)

    // Extract key fields
    const merchantName = fields.get('59') || 'Unknown Merchant'
    const merchantCity = fields.get('60') || 'Unknown City'
    const amountStr = fields.get('54') || '0'
    const currency = fields.get('53') === '360' ? 'IDR' : 'IDR'
    const merchantId = merchantFields.get('02') || fields.get('02') || 'UNKNOWN'

    return {
      merchantName,
      merchantId,
      merchantCity,
      amount: parseFloat(amountStr),
      currency,
      rawData,
    }
  } catch (error) {
    console.error('Failed to parse QRIS:', error)
    return null
  }
}

/**
 * Parse TLV (Tag-Length-Value) encoded string.
 */
function parseTLV(data: string): Map<string, string> {
  const fields = new Map<string, string>()
  let pos = 0

  while (pos < data.length - 4) {
    const tag = data.substring(pos, pos + 2)
    const length = parseInt(data.substring(pos + 2, pos + 4), 10)

    if (isNaN(length) || pos + 4 + length > data.length) break

    const value = data.substring(pos + 4, pos + 4 + length)
    fields.set(tag, value)
    pos += 4 + length
  }

  return fields
}

/**
 * Validate QRIS data checksum (CRC-16/CCITT-FALSE).
 */
export function validateQRISChecksum(data: string): boolean {
  // The last 4 characters are the checksum
  if (data.length < 8) return false

  const payload = data.slice(0, -4)
  const checksum = data.slice(-4).toUpperCase()

  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0') === checksum
}

/**
 * Create mock QRIS data for testing.
 */
export function createMockQRIS(): QRISData {
  const merchants = [
    { name: 'Warung Makan Berkah', city: 'Jakarta', amount: 50000 },
    { name: 'Toko Buku Gramedia', city: 'Bandung', amount: 125000 },
    { name: 'Apotek K-24', city: 'Surabaya', amount: 75000 },
    { name: 'Indomaret Depan Kampus', city: 'Yogyakarta', amount: 35000 },
    { name: 'Kopi Kenangan', city: 'Jakarta', amount: 28000 },
  ]

  const merchant = merchants[Math.floor(Math.random() * merchants.length)]

  return {
    merchantName: merchant.name,
    merchantId: 'ID' + Date.now().toString().slice(-13),
    merchantCity: merchant.city,
    amount: merchant.amount,
    currency: 'IDR',
    rawData: 'MOCK_QRIS_DATA',
  }
}
