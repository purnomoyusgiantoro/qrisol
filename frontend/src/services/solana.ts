/**
 * Solana Service
 * 
 * Handles all Solana blockchain interactions:
 * - Balance fetching
 * - Token transfers
 * - Transaction signing & sending
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { getSOLPriceIDR } from './jupiter'


// USDC on Devnet (SPL Token)
export const USDC_DEVNET_MINT = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
)

// Dummy merchant wallet for testing
export const MERCHANT_WALLET = new PublicKey(
  '11111111111111111111111111111111' // Replace with actual test wallet
)

/**
 * Get SOL balance for a given public key.
 */
export async function getSOLBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(publicKey)
  return balance / LAMPORTS_PER_SOL
}

/**
 * Send SOL from connected wallet to a recipient.
 * Returns the transaction signature.
 */
export async function sendSOL(
  connection: Connection,
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amountSOL: number,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: Math.round(amountSOL * LAMPORTS_PER_SOL),
    })
  )

  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = fromPubkey

  const signedTx = await signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signedTx.serialize())

  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed')

  return signature
}

/**
 * Get SOL price in IDR using real-time data.
 */
export async function getSOLPriceIDRService(): Promise<number> {
  const price = await getSOLPriceIDR()
  return price || 2_500_000 // Fallback if API fails
}

/**
 * Calculate SOL amount needed for a given IDR amount.
 */
export async function calculateSOLForIDR(
  amountIDR: number
): Promise<{ solAmount: number; exchangeRate: number }> {
  const rate = await getSOLPriceIDRService()
  return {
    solAmount: amountIDR / rate,
    exchangeRate: rate,
  }
}
