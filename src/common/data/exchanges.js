const exchangeData = [
  {
    img: "https://bin.bnbstatic.com/static/images/common/favicon.ico",
    label: "Binance",
    id: "binance",
  },
  {
    img: "https://assets.coinbase.com/assets/favicon-32.edb331948b196fde10cb4d6a4e894bb8.png",
    label: "Coinbase",
    id: "coinbase",
  },
  {
    img: "https://gate.io/favicon.ico",
    label: "Gate.io",
    id: "gate_io",
  },
  {
    img: "https://ftx.com/favicon.ico",
    label: "FTX",
    id: "ftx",
  },
  {
    img: "https://kraken.com/img/favicon.ico",
    label: "Kraken",
    id: "kraken",
  },
  {
    img: "https://metamask.io/images/favicon.png",
    label: "Metamask",
    id: "metamask",
  },
  // {
  //   img: "https://avatars.githubusercontent.com/u/9784193?s=200&v=4",
  //   label: "Ledger",
  //   id: "ledger",
  // },
]

const howToAddData = {
  binance: {
    heading: "How to add Binance account :",
    steps: [
      "Login to your Binance account on your computer",
      "Click on API Management from your Profile icon dropdown menu on the top right",
      "In Give the API Key a Label field type in what you want to call it, ex. Wycoin Binance, then click Create",
      "Input your Google Authentication Code(2FA) for Binance",
      "Open your verification email Binance sent you and click Confirm new API Key",
    ],
  },

  coinbase: {
    heading: "How to add Coinbase account :",
    steps: [
      "Login to your Coinbase account",
      "Click on your Profile icon dropdown menu on the top right and enter Settings",
      "In Settings open API Tab",
      "Click on New API Key",
      "Set permissions for your account API, it's recommended to check all 'read' permission checkboxes",
      "Click Create in the bottom right corner",
      "Copy/paste your API and Secret Keys",
    ],
  },
  coinbase_auto: {
    heading: "How to add Coinbase account :",
    steps: [
      "Top Authenticate button below and login to your Coinbase Account",
      "Verify your account with a code generated by your phone",
      "Afer tapping Athroize it will be authenticated",
    ],
  },
  gate_io: {
    heading: "How to add Gate account :",
    steps: [
      "Log in into your Gate.io account and go to 'APIv4 Keys",
      "Press +Create new API Key on the top right corner",
      "Make sure you check 'Read only' to all",
      "Copy your API Key and API Secret",
      "Your trades will import automatically",
    ],
  },
  ftx: {
    heading: "How to add FTX account: ",
    steps: [
      "Login to your FTX account",
      "Click your email on top and then select Settings",
      "Scroll down to API Keys section",
      "Click Create New API Key",
      "Copy and Paste API Key / API Secret",
    ],
  },
  kraken: {
    heading: "How to add Kraken account",
    steps: [
      "Login to your Kraken account on your computer",
      "Click on your name at top right corner",
      "Select API from the Security dropdown and click on Add key button",
      "Give permission to Query Funds, Query Open Orders & Trades and Query Closed Orders & Trades and click Generate Key button",
      "Below the message Success: Created API Key you will see your API and Private Keys",
      "Please note, that in security settings two-factor authentication for API keys must be set to No method in order to be able to sync to Wycoin",
      "Copy/paste your API Key and API Secret",
    ],
  },
  // ledger: {
  //   heading: "How to add Ledger account",
  //   steps: [
  //     "Connect your Ledger device",
  //     "Login to Ledger Live desktop app",
  //     "Open the Ledger wallet for the coin of your choice",
  //     "Select the relevant account (left-hand side)",
  //     "For Bitcoin, Bitcoin Cash, Dash, Dogecoin, Litecoin, and Zcash wallets",
  //     "Click the wrench icon (top right side)",
  //     "Click Advanced Logs",
  //     "Copy the xPub key prefixed with 'xpub' between the quotes and paste it",
  //     "For all other coins",
  //     "View the list of transactions and addresses in the wallet",
  //     "Copy each address",
  //   ],
  // },
}

export { exchangeData, howToAddData }
