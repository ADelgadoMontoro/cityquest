export type MobileObjectiveVisualValidationResult =
  | {
      status: 'passed';
      confidence: number;
      message: string;
    }
  | {
      status: 'blocked';
      message: string;
    };
