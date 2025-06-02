export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate to USD
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 24000 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150 },
  { code: 'KRW', symbol: '₩', name: 'Korean Won', rate: 1320 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 36 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 15700 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.7 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.51 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', rate: 3.75 }
];

export interface Country {
  code: string;
  name: string;
  currency: string;
  language: string;
  timeZone: string;
  flag: string;
  phoneCode: string;
  dateFormat: string;
  driving: 'left' | 'right';
  market: 'active' | 'planned' | 'future';
}

export const countries: Country[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    language: 'en',
    timeZone: 'America/New_York',
    flag: '🇺🇸',
    phoneCode: '+1',
    dateFormat: 'MM/dd/yyyy',
    driving: 'right',
    market: 'active'
  },
  {
    code: 'VN',
    name: 'Vietnam',
    currency: 'VND',
    language: 'vi',
    timeZone: 'Asia/Ho_Chi_Minh',
    flag: '🇻🇳',
    phoneCode: '+84',
    dateFormat: 'dd/MM/yyyy',
    driving: 'right',
    market: 'active'
  },
  {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    language: 'zh',
    timeZone: 'Asia/Shanghai',
    flag: '🇨🇳',
    phoneCode: '+86',
    dateFormat: 'yyyy-MM-dd',
    driving: 'right',
    market: 'planned'
  },
  {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    language: 'ja',
    timeZone: 'Asia/Tokyo',
    flag: '🇯🇵',
    phoneCode: '+81',
    dateFormat: 'yyyy/MM/dd',
    driving: 'left',
    market: 'planned'
  },
  {
    code: 'KR',
    name: 'South Korea',
    currency: 'KRW',
    language: 'ko',
    timeZone: 'Asia/Seoul',
    flag: '🇰🇷',
    phoneCode: '+82',
    dateFormat: 'yyyy-MM-dd',
    driving: 'right',
    market: 'planned'
  },
  {
    code: 'TH',
    name: 'Thailand',
    currency: 'THB',
    language: 'th',
    timeZone: 'Asia/Bangkok',
    flag: '🇹🇭',
    phoneCode: '+66',
    dateFormat: 'dd/MM/yyyy',
    driving: 'left',
    market: 'active'
  },
  {
    code: 'ID',
    name: 'Indonesia',
    currency: 'IDR',
    language: 'id',
    timeZone: 'Asia/Jakarta',
    flag: '🇮🇩',
    phoneCode: '+62',
    dateFormat: 'dd/MM/yyyy',
    driving: 'left',
    market: 'active'
  },
  {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    language: 'ms',
    timeZone: 'Asia/Kuala_Lumpur',
    flag: '🇲🇾',
    phoneCode: '+60',
    dateFormat: 'dd/MM/yyyy',
    driving: 'left',
    market: 'active'
  },
  {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    language: 'en',
    timeZone: 'Asia/Singapore',
    flag: '🇸🇬',
    phoneCode: '+65',
    dateFormat: 'dd/MM/yyyy',
    driving: 'left',
    market: 'active'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    language: 'en',
    timeZone: 'Europe/London',
    flag: '🇬🇧',
    phoneCode: '+44',
    dateFormat: 'dd/MM/yyyy',
    driving: 'left',
    market: 'future'
  },
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    language: 'de',
    timeZone: 'Europe/Berlin',
    flag: '🇩🇪',
    phoneCode: '+49',
    dateFormat: 'dd.MM.yyyy',
    driving: 'right',
    market: 'future'
  },
  {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    language: 'fr',
    timeZone: 'Europe/Paris',
    flag: '🇫🇷',
    phoneCode: '+33',
    dateFormat: 'dd/MM/yyyy',
    driving: 'right',
    market: 'future'
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    language: 'en',
    timeZone: 'Australia/Sydney',
    flag: '🇦🇺',
    phoneCode: '+61',
    dateFormat: 'dd/MM/yyyy',
    driving: 'left',
    market: 'future'
  },
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    language: 'hi',
    timeZone: 'Asia/Kolkata',
    flag: '🇮🇳',
    phoneCode: '+91',
    dateFormat: 'dd/MM/yyyy',
    driving: 'left',
    market: 'future'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    language: 'ar',
    timeZone: 'Asia/Dubai',
    flag: '🇦🇪',
    phoneCode: '+971',
    dateFormat: 'dd/MM/yyyy',
    driving: 'right',
    market: 'future'
  }
];

// Translation functions
export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.cars': 'Cars',
    'nav.bookings': 'My Bookings',
    'nav.account': 'Account',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Homepage
    'home.hero.title': 'Premium Car Rental Experience',
    'home.hero.subtitle': 'Discover our fleet of premium vehicles for your perfect journey',
    'home.hero.cta': 'Book Now',
    'home.featured.title': 'Featured Vehicles',
    'home.categories.title': 'Browse by Category',
    
    // Car listing
    'cars.title': 'Available Vehicles',
    'cars.filter.category': 'Category',
    'cars.filter.brand': 'Brand',
    'cars.filter.price': 'Price Range',
    'cars.filter.transmission': 'Transmission',
    'cars.sort.name': 'Name',
    'cars.sort.price': 'Price',
    'cars.sort.rating': 'Rating',
    
    // Booking
    'booking.title': 'Complete Your Booking',
    'booking.vehicle': 'Selected Vehicle',
    'booking.dates': 'Rental Dates',
    'booking.location': 'Pickup Location',
    'booking.total': 'Total Cost',
    'booking.confirm': 'Confirm Booking',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.book': 'Book Now',
    'common.view': 'View Details',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    
    // Currency
    'currency.per_day': 'per day',
    'currency.total': 'Total',
    'currency.tax': 'Tax',
    'currency.subtotal': 'Subtotal',
    
    // Time
    'time.days': 'days',
    'time.hours': 'hours',
    'time.minutes': 'minutes',
    'time.pickup': 'Pickup',
    'time.return': 'Return'
  },
  
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.cars': 'Xe hơi',
    'nav.bookings': 'Đặt xe của tôi',
    'nav.account': 'Tài khoản',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    
    // Homepage
    'home.hero.title': 'Trải nghiệm thuê xe cao cấp',
    'home.hero.subtitle': 'Khám phá đội xe cao cấp cho chuyến đi hoàn hảo của bạn',
    'home.hero.cta': 'Đặt ngay',
    'home.featured.title': 'Xe nổi bật',
    'home.categories.title': 'Duyệt theo danh mục',
    
    // Car listing
    'cars.title': 'Xe có sẵn',
    'cars.filter.category': 'Danh mục',
    'cars.filter.brand': 'Thương hiệu',
    'cars.filter.price': 'Khoảng giá',
    'cars.filter.transmission': 'Hộp số',
    'cars.sort.name': 'Tên',
    'cars.sort.price': 'Giá',
    'cars.sort.rating': 'Đánh giá',
    
    // Booking
    'booking.title': 'Hoàn tất đặt xe',
    'booking.vehicle': 'Xe đã chọn',
    'booking.dates': 'Ngày thuê',
    'booking.location': 'Địa điểm nhận xe',
    'booking.total': 'Tổng chi phí',
    'booking.confirm': 'Xác nhận đặt xe',
    
    // Common
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.book': 'Đặt ngay',
    'common.view': 'Xem chi tiết',
    'common.loading': 'Đang tải...',
    'common.error': 'Có lỗi xảy ra',
    'common.success': 'Thành công',
    'common.cancel': 'Hủy',
    'common.save': 'Lưu',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.back': 'Quay lại',
    'common.next': 'Tiếp theo',
    'common.previous': 'Trước',
    
    // Currency
    'currency.per_day': 'mỗi ngày',
    'currency.total': 'Tổng cộng',
    'currency.tax': 'Thuế',
    'currency.subtotal': 'Tạm tính',
    
    // Time
    'time.days': 'ngày',
    'time.hours': 'giờ',
    'time.minutes': 'phút',
    'time.pickup': 'Nhận xe',
    'time.return': 'Trả xe'
  }
  // Add more languages here...
};

export type TranslationKey = keyof typeof translations.en;

// Utility functions
export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find(currency => currency.code === code);
}

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find(lang => lang.code === code);
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return `$${amount}`;
  
  const convertedAmount = amount * currency.rate;
  
  if (currencyCode === 'VND') {
    return `${Math.round(convertedAmount).toLocaleString('vi-VN')} ₫`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(convertedAmount);
}

export function formatDate(date: Date, countryCode: string): string {
  const country = getCountryByCode(countryCode);
  const locale = country ? `${country.language}-${country.code}` : 'en-US';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function getActiveCountries(): Country[] {
  return countries.filter(country => country.market === 'active');
}

export function getPlannedCountries(): Country[] {
  return countries.filter(country => country.market === 'planned');
}

export function translate(key: TranslationKey, language: string = 'en'): string {
  const languageTranslations = translations[language as keyof typeof translations];
  if (!languageTranslations) {
    return translations.en[key] || key;
  }
  return languageTranslations[key] || translations.en[key] || key;
}

// Context for React
export interface LocalizationContext {
  language: string;
  country: string;
  currency: string;
  timeZone: string;
  rtl: boolean;
  setLanguage: (language: string) => void;
  setCountry: (country: string) => void;
  setCurrency: (currency: string) => void;
  t: (key: TranslationKey) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

export const defaultLocalization: LocalizationContext = {
  language: 'en',
  country: 'US',
  currency: 'USD',
  timeZone: 'America/New_York',
  rtl: false,
  setLanguage: () => {},
  setCountry: () => {},
  setCurrency: () => {},
  t: (key) => translations.en[key] || key,
  formatCurrency: (amount) => formatCurrency(amount, 'USD'),
  formatDate: (date) => formatDate(date, 'US')
};