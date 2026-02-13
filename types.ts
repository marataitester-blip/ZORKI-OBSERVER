
export enum ObjectState {
  CONCEPTION = 'CONCEPTION',
  FORMATION = 'FORMATION',
  STABILIZATION = 'STABILIZATION',
  DEGRADATION = 'DEGRADATION',
  TERMINATION = 'TERMINATION'
}

export enum HumanRole {
  OWNER = 'OWNER',
  STRATEGIST = 'STRATEGIST',
  SPECIALIST = 'SPECIALIST',
  OBSERVER = 'OBSERVER',
  OUTSIDER = 'OUTSIDER'
}

export interface Observation {
  id: string;
  timestamp: number;
  content: string;
  objectState: ObjectState;
  humanRole: HumanRole;
}

export interface StateDescriptions {
  [key: string]: string;
}
