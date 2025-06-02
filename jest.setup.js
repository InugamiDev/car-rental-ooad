import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Fuel: () => <div data-testid="fuel-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  MapPin: () => <div data-testid="mappin-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Award: () => <div data-testid="award-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Share2: () => <div data-testid="share2-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Grid3X3: () => <div data-testid="grid-icon" />,
  List: () => <div data-testid="list-icon" />,
  SortAsc: () => <div data-testid="sort-asc-icon" />,
  SortDesc: () => <div data-testid="sort-desc-icon" />,
  CreditCard: () => <div data-testid="credit-card-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Check: () => <div data-testid="check-icon" />,
}))

// Mock fetch globally
global.fetch = jest.fn()

// Setup test environment
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
  
  // Reset fetch mock
  fetch.mockClear()
})

// Clean up after each test
afterEach(() => {
  // Clean up any side effects
  jest.restoreAllMocks()
})

// Mock console methods to reduce noise in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})