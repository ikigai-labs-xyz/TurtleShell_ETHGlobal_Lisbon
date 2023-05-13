export interface Vulnerability {
  type: string;
  severity: string;
  gradeImpact: number;
}

export enum VulnerabilityType {
  Reentrency = 'reentrancy',
  Overflow = 'overflow',
  AccessControl = 'accesscontrol',
  DelegateCall = 'delegatecall',
  Timestamp = 'timestamp',
}

export interface BadgeDetailsQuery {
  address: string;
  chain: string;
  grade: string;
  contractType: string;
  vulnerabilities: VulnerabilityType[];
}

export interface Recommendation {
  type: string;
  fix: string;
}

export interface TurtleshellSecurityData {
  address: string;
  chain: string;
  timestamp: string;
  grade: string;
  vulnerabilities: Vulnerability[];
  recommendations?: Recommendation[];
}

export interface SecurityConfig {
  vulnerabilities: Vulnerability[];
}

export interface MLData {
  matchFragments: string[];
  vulnerabilityType: string;
}
