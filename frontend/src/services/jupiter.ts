/**
 * Jupiter DEX Aggregator Service
 * 
 * Handles SOL → USDC swaps using the Jupiter Aggregator V6 API.
 * This enables converting crypto to stablecoin for merchant settlement.
 * 
 * To be fully implemented by Purnomo in Sprint 3.
 */

// Jupiter V6 API Endpoint
const JUPITER_API = 'https://quote-api.jup.ag/v6'

// Token Mints
const SOL_MINT = 'So11111111111111111111111111111111111111112'
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

export interface JupiterQuote {
  inputMint: string
  outputMint: string
  inAmount: string
  outAmount: string
  priceImpactPct: number
  routePlan: unknown[]
}

/**
 * Get a quote for swapping SOL to USDC.
 */
export async function getSwapQuote(
  amountLamports: number
): Promise<JupiterQuote | null> {
  try {
    const params = new URLSearchParams({
      inputMint: SOL_MINT,
      outputMint: USDC_MINT,
      amount: amountLamports.toString(),
      slippageBps: '50', // 0.5% slippage
    })

    const response = await fetch(`${JUPITER_API}/quote?${params}`)

    if (!response.ok) {
      console.error('Jupiter quote error:', response.status)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to get Jupiter quote:', error)
    return null
  }
}

/**
 * Build a swap transaction from a Jupiter quote.
 * Returns serialized transaction for wallet signing.
 */
export async function buildSwapTransaction(
  quoteResponse: JupiterQuote,
  userPublicKey: string
): Promise<string | null> {
  try {
    const response = await fetch(`${JUPITER_API}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true,
      }),
    })

    if (!response.ok) {
      console.error('Jupiter swap build error:', response.status)
      return null
    }

    const { swapTransaction } = await response.json()
    return swapTransaction
  } catch (error) {
    console.error('Failed to build swap transaction:', error)
    return null
  }
}

/**
 * Get current SOL/USDC price from Jupiter.
 */
export async function getSOLPrice(): Promise<number | null> {
  try {
    const response = await fetch(
      `https://price.jup.ag/v6/price?ids=${SOL_MINT}`
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.data?.[SOL_MINT]?.price || null
  } catch {
    return null
  }
}

/**
 * Get current USD to IDR exchange rate.
 */
export async function getUSDToIDR(): Promise<number> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    if (!response.ok) return 16000 // Fallback
    const data = await response.json()
    return data.rates?.IDR || 16000
  } catch (error) {
    console.error('Failed to fetch USD/IDR rate:', error)
    return 16000
  }
}

/**
 * Get current SOL price in IDR.
 */
export async function getSOLPriceIDR(): Promise<number | null> {
  try {
    const [solUsd, usdIdr] = await Promise.all([
      getSOLPrice(),
      getUSDToIDR()
    ])
    
    if (!solUsd) return null
    return solUsd * usdIdr
  } catch (error) {
    console.error('Failed to calculate SOL/IDR price:', error)
    return null
  }
}
