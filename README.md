# 🚀 QRISol: The Web3 Gateway for QRIS Payments

**Scan QRIS, Pay with Solana.**  
QRISol is a next-generation payment bridge that allows users to pay any standard Indonesian QRIS merchant using Solana (SOL) instantly. Built for the **Colosseum Frontier Hackathon**, it features an innovative "Smart Routing" mechanism to ensure users always get the best conversion rates.

---

## ⚡ Quick Start (Run in < 1 Minute)

Follow these steps to get the project running locally:

1. **Clone the repository**
2. **Install dependencies** (from the root folder):
   ```bash
   npm install
   ```
3. **Start both Frontend & Backend**:
   ```bash
   npm run dev
   ```
4. **Access the App**:
   *   **Frontend**: `http://localhost:5173`
   *   **Backend**: `http://localhost:3001`

---

## 🌟 Key Features

### 1. Smart Routing Algorithm
QRISol doesn't just convert SOL to IDR; it automatically scouts the best rates from multiple exchange partners (**Tokocrypto**, **Indodax**, **Pintu**) in real-time. It selects the partner with the lowest fees and best liquidity, hiding the complexity from the user for a seamless "Scan & Pay" experience.

### 2. Universal QRIS Scanner
Integrated with a powerful OCR backend, QRISol can parse standard QRIS codes from street vendors, cafes, and major retailers. It extracts merchant data and amount details automatically.

### 3. Solana Devnet Integration
Fully functional blockchain integration using `@solana/web3.js` and `@solana/wallet-adapter`. Experience real-time transaction confirmation on the Solana Devnet.

### 4. Premium Fintech UI
A meticulously crafted mobile-first interface designed with **Material 3** aesthetics, featuring smooth animations, glassmorphism elements, and a high-fidelity "Bento-style" receipt system.

---

## 🛠 Tech Stack

*   **Frontend**: React + TypeScript + Vite + TailwindCSS
*   **Blockchain**: Solana Web3.js + Wallet Adapter (Devnet)
*   **Backend**: Node.js + Express (QRIS Parsing & Smart Routing Logic)
*   **Design**: Custom Design System with Material Symbols

---

## 📂 Project Structure

```
qrisol/
├── frontend/        # React Application (UI/UX)
├── backend/         # Express Server (API & Logic)
├── package.json     # Monorepo configuration
└── README.md        # You are here!
```

---

## 🏆 Hackathon Credits
Developed by **Team QRISol** for the **Colosseum Frontier Hackathon 2026**.

**Team Members:**
*   **Purnomo** (Lead Dev & Blockchain)
*   **Indra** (UI/UX Designer)
*   **Fajar** (Backend & AI)

---
*Note: This project is currently running on Solana Devnet. Ensure your wallet is connected to Devnet before testing.*
