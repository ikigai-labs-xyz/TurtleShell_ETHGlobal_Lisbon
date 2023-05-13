import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { VulnerabilityType } from '../types';
import securityConfig from 'src/securityConfig';

interface ScoreParams {
  vulnerabilities: VulnerabilityType[];
}

@Injectable()
export class ScoreService {
  constructor(private scoreApiService: HttpService) {}
  public async getScore(params: ScoreParams) {
    let score = 2000;
    for (const vulnerability of params.vulnerabilities) {
      securityConfig.vulnerabilities.forEach((configVulnerability) => {
        if (configVulnerability.type === vulnerability) {
          score *= 1 - configVulnerability.gradeImpact;
        } else {
          console.log(configVulnerability.type, vulnerability);
        }
      });
    }
    return Math.round(score);
  }
}
