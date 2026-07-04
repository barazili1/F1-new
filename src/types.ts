export type Provider = '1xbet' | 'melbet';

export type AppStage = 'splash' | 'conditions' | 'game';

export interface WinningRecord {
  id: string;
  userId: string;
  provider: Provider;
  winAmount: number;
  multiplier: number;
  timestamp: string;
}
