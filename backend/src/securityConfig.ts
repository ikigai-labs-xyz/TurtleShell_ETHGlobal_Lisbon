import { SecurityConfig, VulnerabilityType } from './types';

const securityConfig: SecurityConfig = {
  vulnerabilities: [
    {
      type: VulnerabilityType.Reentrency,
      severity: 'Critical',
      gradeImpact: 0.51,
    },
    {
      type: VulnerabilityType.Overflow,
      severity: 'Critical',
      gradeImpact: 0.51,
    },
    {
      type: VulnerabilityType.AccessControl,
      severity: 'Critical',
      gradeImpact: 0.51,
    },
    {
      type: VulnerabilityType.DelegateCall,
      severity: 'Mixed',
      gradeImpact: 0.3,
    },
    {
      type: VulnerabilityType.Timestamp,
      severity: 'Low',
      gradeImpact: 0.1,
    },
  ],
};

export default securityConfig;
