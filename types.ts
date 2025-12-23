
export type Extremity = 'upper' | 'lower';

export interface DecisionState {
  step: 'presentation' | 'diagnosis' | 'management' | 'followup' | 'result';
  extremity?: Extremity;
  diagnosisType?: 'SuVT' | 'DVT';
  proximityToDeepVeins?: boolean; // < 3cm
  thrombusLengthGreater5cm?: boolean; // > 5cm
  persistentSymptomsAfter72h?: boolean;
  hasCatheter?: boolean;
}

export type TreatmentRecommendation = {
  title: string;
  description: string;
  alternatives?: string[];
  caveats?: string[];
  type: 'DVT_TREATMENT' | 'FONDAPARINUX' | 'CONSERVATIVE' | 'REASSESS_FONDA';
};
