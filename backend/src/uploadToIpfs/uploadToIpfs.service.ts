import { BadRequestException, Injectable } from '@nestjs/common';
import pinataSDK from '@pinata/sdk';
import * as fs from 'fs';
import * as path from 'path';
import config from '../config';
import {
  BadgeDetailsQuery,
  TurtleshellSecurityData,
  Vulnerability,
  Recommendation,
  VulnerabilityType,
} from '../types';
import securityConfig from 'src/securityConfig';

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  securityData: TurtleshellSecurityData;
}

@Injectable()
export class IpfsService {
  private readonly badgeFileName = 'badge.html';
  private pinata: any;

  constructor() {
    this.pinata = new pinataSDK(
      config.PINATA_API_KEY,
      config.PINATA_SECRET_KEY,
    );
  }

  private getSVGData(badgeDetails: BadgeDetailsQuery) {
    const rawSvgPath = path.resolve('badge', 'index.html');
    const rawBadgeContent = fs.readFileSync(rawSvgPath, { encoding: 'utf8' });

    const timestamp = Math.floor(Date.now() / 1000).toString();

    let badgeSvgContent = rawBadgeContent;
    badgeSvgContent = badgeSvgContent.replace(
      '{ADDRESS}',
      badgeDetails.address,
    );
    badgeSvgContent = badgeSvgContent.replace('{TIMESTAMP}', timestamp);
    badgeSvgContent = badgeSvgContent.replace('{CHAIN}', badgeDetails.chain);
    badgeSvgContent = badgeSvgContent.replace('{GRADE}', badgeDetails.grade);

    badgeSvgContent = badgeSvgContent.replace('{AUTHOR}', 'Turtleshell AI');

    if (Number(badgeDetails.grade) >= 1) {
      badgeSvgContent = badgeSvgContent.replace('{COLOR}', 'green');
    } else {
      badgeSvgContent = badgeSvgContent.replace('{COLOR}', 'red');
    }

    return { badgeSvgContent, timestamp };
  }

  private async uploadSVGToPinata(badgeDetails: BadgeDetailsQuery) {
    const directory = path.resolve('badge');
    const tempDirectoryName = 'uploadFolder';
    const uploadFolderPath = path.resolve(directory, tempDirectoryName);
    const tempSVGFilePath = path.resolve(uploadFolderPath, this.badgeFileName);

    const { badgeSvgContent, timestamp } = this.getSVGData(badgeDetails);

    fs.writeFileSync(tempSVGFilePath, badgeSvgContent);

    const options = {
      pinataMetadata: {
        name: `${badgeDetails.address} - Badge`,
      },
    };

    let response;
    try {
      response = await this.pinata.pinFromFS(uploadFolderPath, options);
    } catch (e) {
      console.log(e);
    }

    fs.unlinkSync(tempSVGFilePath);

    return { response, timestamp: timestamp };
  }

  private async uploadNftMetadata(
    badgeDetails: BadgeDetailsQuery,
    response: any,
    timestamp: string,
  ) {
    const tempFilePath = path.resolve('badge', 'tempMetadata');

    const vulnerabilities: Vulnerability[] = [];
    for (const vulnerabilityType of badgeDetails.vulnerabilities) {
      securityConfig.vulnerabilities.forEach((securityVulnerability) => {
        if (securityVulnerability.type === vulnerabilityType) {
          vulnerabilities.push(securityVulnerability);
        }
      });
    }

    const recommendations: Recommendation[] = [];
    for (const vulnerability of vulnerabilities) {
      switch (vulnerability.type) {
        case VulnerabilityType.Timestamp:
          recommendations.push({
            type: 'Timestamp',
            fix: 'Avoid using timestamp as they can get manipulated',
          });
          break;
        case VulnerabilityType.Overflow:
          recommendations.push({
            type: 'Solidity version',
            fix: 'Use Solidity version 0.8.0 or higher',
          });
          break;
      }
    }

    const metadata: NftMetadata = {
      name: `TurtleShell Security Badge of (${badgeDetails.address})`,
      description:
        'TurtleShell-NFTs are soul-bound security badges for Smart Contracts',
      image: 'ipfs://' + response.IpfsHash + '/' + this.badgeFileName,
      // add metadata here
      securityData: {
        ...badgeDetails,
        timestamp,
        vulnerabilities,
        recommendations: recommendations !== undefined && recommendations,
      },
    };

    fs.writeFileSync(tempFilePath, JSON.stringify(metadata));
    const readableStreamForFile = fs.createReadStream(tempFilePath);

    const options = {
      pinataMetadata: {
        name: badgeDetails.address + ' - NFT data',
      },
    };

    let ipfsHash: string;
    try {
      const res = await this.pinata.pinFileToIPFS(
        readableStreamForFile,
        options,
      );
      ipfsHash = res.IpfsHash;
    } catch (e) {
      console.log(e);
    }

    fs.unlinkSync(tempFilePath);
    return ipfsHash;
  }

  public async uploadToIpfs(body: BadgeDetailsQuery) {
    if (
      !body.address ||
      !body.chain ||
      !body.grade ||
      !body.vulnerabilities ||
      !body.contractType
    ) {
      throw new BadRequestException('Missing params');
    }
    const { response, timestamp } = await this.uploadSVGToPinata(body);
    return await this.uploadNftMetadata(body, response, timestamp);
  }
}
