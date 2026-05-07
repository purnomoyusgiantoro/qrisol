/**
 * Mock API Service
 * 
 * Simulates CEX (Centralized Exchange) backend responses.
 * When a Solana transaction is confirmed on-chain, this "backend"
 * responds as if the payment has been settled to the merchant's bank account.
 * 
 * To be fully implemented by Fajar in Sprint 3.
 */

export interface PaymentResult {
  success: boolean
  message: string
  merchantName: string
  amountIDR: number
  txHash: string
  settlementId: string
  timestamp: string
}

/**
 * Notify the mock backend that a payment was made on-chain.
 * In production, this would trigger a CEX off-ramp and bank transfer.
 */
export async function notifyPaymentSettlement(params: {
  txHash: string
  merchantId: string
  merchantName: string
  amountIDR: number
  amountSOL: number
  senderWallet: string
}): Promise<PaymentResult> {
  // Simulate network delay (500ms - 1500ms)
  const delay = 500 + Math.random() * 1000
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Mock success response
  return {
    success: true,
    message: 'Payment settled to merchant bank account',
    merchantName: params.merchantName,
    amountIDR: params.amountIDR,
    txHash: params.txHash,
    settlementId: 'SETL_' + Date.now().toString(36).toUpperCase(),
    timestamp: new Date().toISOString(),
  }
}

/**
 * Check payment status from mock backend.
 */
export async function checkPaymentStatus(
  txHash: string
): Promise<{ status: 'pending' | 'confirmed' | 'settled' | 'failed' }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Always return settled for demo purposes
  return { status: 'settled' }
}

/**
 * Get mock exchange rate from "CEX backend".
 */
export async function getExchangeRate(): Promise<{
  SOL_IDR: number
  SOL_USDC: number
  USDC_IDR: number
  updatedAt: string
}> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return {
    SOL_IDR: 2_500_000,
    SOL_USDC: 170.5,
    USDC_IDR: 16_500,
    updatedAt: new Date().toISOString(),
  }
}
