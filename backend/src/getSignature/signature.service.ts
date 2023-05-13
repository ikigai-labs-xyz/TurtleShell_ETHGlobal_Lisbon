import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

import config from '../config';

@Injectable()
export class SignatureService {
  private defaultProvider: ethers.providers.BaseProvider;
  private customWallet: ethers.Wallet;
  constructor(private signatureApiService: HttpService) {
    this.defaultProvider = ethers.getDefaultProvider('mainnet');
    this.customWallet = new ethers.Wallet(
      config.PRIVATE_KEY as string,
      this.defaultProvider,
    );
  }
  public async composeSignature(params: {
    chainId: number | undefined;
    contractAddress: string | undefined;
    ipfsHash: string | undefined;
    grade: string | undefined;
    contractType: string | undefined;
  }) {
    if (
      !params.chainId ||
      !params.contractAddress ||
      !params.ipfsHash ||
      !params.grade ||
      !params.contractType
    ) {
      throw new BadRequestException('Missing params');
    }

    const domain = {
      name: 'TurtleShellToken',
      version: '1',
      chainId: params.chainId,
      verifyingContract: config.TURTLESHELL_ADDRESS[params.chainId],
    };

    const mintRequest = {
      to: params.contractAddress as string,
      tokenURI: params.ipfsHash as string,
      grade: params.grade as string,
      contractType: params.contractType as string,
    };

    let signature: string;
    try {
      signature = await this.customWallet._signTypedData(
        domain,
        {
          MintRequest: [
            { name: 'to', type: 'address' },
            { name: 'tokenURI', type: 'string' },
            { name: 'grade', type: 'uint256' },
            { name: 'contractType', type: 'bytes32' },
          ],
        },
        mintRequest,
      );
    } catch (e) {
      console.log(e);
    }

    return signature;
  }
}
