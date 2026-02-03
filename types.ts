
export interface Slice {
  id: string;
  label: string;
  color: string;
  weight: number;
  description: string;
  coupon?: string;
  validityText: string;
}

export interface GymIdentity {
  name: string;
  tagline: string;
  address: string;
  mapLink?: string; // Optional direct link to Google Maps
  phone: string;
  timings: string;
  facebookLink: string;
  instagramLink: string;
}

export interface NextStepBox {
  heading: string;
  steps: string[];
  ctaText: string;
  ctaActionType: 'call' | 'whatsapp' | 'link';
  ctaValue: string;
}

export interface AppConfig {
  primaryColor: string;
  accentColor: string;
  logoBase64: string | null;
  wheelLogoBase64: string | null;
  wheelFontSize: number;
  wheelFontFamily: string;
  adminPin: string;
  slices: Slice[];
  thankYouNote: {
    heading: string;
    body: string;
  };
  termsAndConditions: string;
  identity: GymIdentity;
  nextSteps: NextStepBox;
  settings: {
    oneSpinPerDay: boolean;
    soundEnabled: boolean;
    requireContactBeforeSpin: boolean;
  };
}

export interface SpinResult {
  sliceId: string;
  timestamp: number;
}
