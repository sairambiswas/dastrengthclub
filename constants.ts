
import { AppConfig } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  primaryColor: '#ef4444', 
  accentColor: '#fbbf24', 
  logoBase64: '/logo.png',
  wheelLogoBase64: null,
  wheelFontSize: 22,
  wheelFontFamily: 'Tech',
  adminPin: '1234',
  slices: [
    { id: '1', label: 'Flat 5%Off + \n2 Days Free Trial', color: '#ef4444', weight: 1, description: 'Get 5% discount on slot-booking, monthly and 3 month membership plans and 2 Days Free Trial.', coupon: 'DSC5', validityText: 'Valid for 7 days' },
    { id: '2', label: 'Flat 8%Off', color: '#3b82f6', weight: 1, description: 'Get 8% discount on slot-booking, monthly and 3 month membership plans.', coupon: 'DSC8', validityText: 'Valid for 3 days' },
    { id: '3', label: '3 Days Trial \n@ Rs 450', color: '#10b981', weight: 1, description: 'Get 3 Days Trial @ Rs 450', coupon: 'DSC450', validityText: 'Valid for 14 days' },
    { id: '4', label: 'Flat 15%Off + \n15%Off on Whey \nProtein Conc', color: '#f59e0b', weight: 1, description: 'Get 15% discount on slot-booking, monthly and 3 month membership plans and 15% discount on Whey Protein Conc..', coupon: 'DSC30', validityText: 'Valid for 30 days' },
    { id: '5', label: 'Flat 18%Off', color: '#8b5cf6', weight: 1, description: 'Get 18% discount on slot-booking, monthly and 3 month membership plans.', coupon: 'DSC18', validityText: 'Valid for 7 days' },
    { id: '6', label: 'Flat 20%Off + \n10%Off on \nProtein Bar(Box)', color: '#ec4899', weight: 1, description: 'Get 20% discount on slot-booking, monthly and 3 month membership plans and 10% discount on Protein Bar(Box).', coupon: 'DSCP30', validityText: 'Valid for 14 days' },
  ],
  thankYouNote: {
    heading: 'Congratulations Champion!',
    body: 'You just won an exclusive reward. Show this screen to our desk representative to claim your offer or click the WhatsApp To Book Now Button to share us your Offer.',
  },
  termsAndConditions: 'One spin per person per day. Rewards cannot be exchanged for cash. Management reserves all rights.',
  identity: {
    name: 'DA STRENGTH CLUB',
    tagline: 'Back To Feet',
    address: 'DD-69, Narayantola East, Ashwini Nagar, Baguiati, Kolkata, West Bengal 700159',
    mapLink: 'https://maps.app.goo.gl/WVGSZ9JnqFCaiHPQA', 
    phone: '6291655507',
    timings: '6:00 AM - 10:00 PM (Daily)',
    facebookLink: 'https://www.facebook.com/profile.php?id=61581331336481',
    instagramLink: 'https://instagram.com/dastrengthclub',
    // KnowYourGym:'https://drive.google.com/file/d/1pJ8bzowNNxeOCagxppT8WBpQ7245Pumh/view?usp=drive_link',
  },
  nextSteps: {
    heading: 'HOW TO CLAIM',
    steps: [
      'Take a screenshot of this result',
      'Visit our reception desk',
      'Show your coupon code',
      'Start your transformation!',
    ],
    ctaText: 'WhatsApp To Book Now',
    ctaActionType: 'whatsapp',
    ctaValue: '+91 6291655507',
  },
  settings: {
    oneSpinPerDay: true,
    soundEnabled: true,
    requireContactBeforeSpin: false,
  },
};

export const CONFIG_KEY = 'spinwheel_config_v1';
export const SPIN_RESULT_KEY = 'spinwheel_last_result';
export const DAILY_LIMIT_KEY = 'spinwheel_daily_limit';
export const ADMIN_SESSION_KEY = 'is_admin_session';
