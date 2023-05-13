import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  ML_AUDIT_URL: 'http://13.50.55.163:8511/v1/api/aduit',
  TURTLESHELL_ADDRESS: {
    5: '',
  },
  PRIVATE_KEY: process.env.TURTLESHELL_PRIVATE_KEY,
  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
};

export default config;
