import { useState, useEffect, useCallback } from 'react'
import { Button, TextInput, ProviderCard as DSProviderCard } from 'glow-ds/components'
import type { NetworkTier } from 'glow-ds/components'
import {
  semanticColors as sc,
  semanticSpacing,
  semanticRadii,
  fontFamilies,
  fontWeights,
} from 'glow-ds/tokens'

// ── Glow DS Icons ──────────────────────────────────────────
import CloseIcon from '@glow-icons/icons/line/Close'
import ChevronSmallDownIcon from '@glow-icons/icons/line/ChevronSmallDown'
import SettingsAdjustIcon from '@glow-icons/icons/line/SettingsAdjustHrAl'
import MapIcon from '@glow-icons/icons/line/Map'
import StarSolidIcon from '@glow-icons/icons/solid/Star'
import LocationIcon from '@glow-icons/icons/line/Location'
import VideoCameraIcon from '@glow-icons/icons/line/VideoCamera'
import HeartLineIcon from '@glow-icons/icons/line/Heart'
import HeartSolidIcon from '@glow-icons/icons/solid/Heart'
import BookmarkLineIcon from '@glow-icons/icons/line/Bookmark'
import BookmarkSolidIcon from '@glow-icons/icons/solid/Bookmark'
import CalendarIcon from '@glow-icons/icons/line/Calendar'
import StarLineIcon from '@glow-icons/icons/line/Star'
// ArrowDownLeftCrFr / ArrowUpRightCrFr removed — cost chips now handled by DS ProviderCard
import SearchIcon from '@glow-icons/icons/line/Search'
import Clock16Icon from '@glow-icons/icons/line/Clock16'
import ChevronSmallLeftIcon from '@glow-icons/icons/line/ChevronSmallLeft'
import PhoneIcon from '@glow-icons/icons/line/Phone'
import ChevronLeftIcon from '@glow-icons/icons/line/ChevronLeft'

// ── Specialty Icons ──────────────────────────────────────────
import PrimaryCareIcon from '@glow-icons/icons/specialty/PrimaryCare'
import DentistIcon from '@glow-icons/icons/specialty/Dentist'
import EyeDoctorIcon from '@glow-icons/icons/specialty/EyeDoctor'
import ObGynIcon from '@glow-icons/icons/specialty/ObGyn'
import DermatologyIcon from '@glow-icons/icons/specialty/Dermatology'
import SpecialistIcon from '@glow-icons/icons/specialty/Specialist'
import OrthopedistIcon from '@glow-icons/icons/specialty/Orthopedist'

// ── DS Token Constants ──────────────────────────────────────

// Colors
const BG_WHITE = sc.neutral.surface.negative        // '#ffffff'
const BG_EXTRA_SUBTLE = sc.neutral.surface.extraSubtle // '#fafafa'
const TEXT_DEFAULT = sc.neutral.text.DEFAULT          // '#000000'
const TEXT_DARK = sc.neutral.text.dark                // '#404040'
const TEXT_LIGHT = sc.neutral.text.light              // '#8a8a8a'
const TEXT_DISABLED = sc.neutral.text.disabledDark    // '#949494'
const BORDER_LIGHT = sc.neutral.border.light          // '#ededed'
const BORDER_STRONG = sc.neutral.border.strong        // '#e0e0e0'
const PRIMARY_TEXT = sc.primary.text.DEFAULT           // '#fd5201'
const SUCCESS_DEFAULT = sc.success.surface.DEFAULT    // '#5bb95e'
const SUCCESS_SUBTLE = sc.success.surface.subtle      // '#f1f9f1'
const SUCCESS_TEXT_DARK = sc.success.text.dark         // '#317233'
const ERROR_SUBTLE = sc.error.surface.subtle          // '#feecec'
const ERROR_TEXT_DARK = sc.error.text.dark             // '#7a1d1d'
const BLUE_SUBTLE = sc['accent-blue'].surface.subtle   // '#f5f8ff'
const BLUE_TEXT_DARK = sc['accent-blue'].text.dark      // '#245eff'
const BLUE_DEFAULT = sc['accent-blue'].surface.DEFAULT  // '#99b4ff'
const BLUE_SELECTED = sc['accent-blue'].surface.selected // '#618bff'

// Spacing
const SPACE_XXXS = parseInt(semanticSpacing.xxxs) // 4
const SPACE_XXS = parseInt(semanticSpacing.xxs)   // 8
const SPACE_XS = parseInt(semanticSpacing.xs)     // 12
const SPACE_S = parseInt(semanticSpacing.s)       // 16
const SPACE_M = parseInt(semanticSpacing.m)       // 20
const SPACE_L = parseInt(semanticSpacing.l)       // 24

// Radii
const RADIUS_XXS = parseInt(semanticRadii.xxs)    // 8
const RADIUS_S = parseInt(semanticRadii.sn)       // 16
const RADIUS_FULL = parseInt(semanticRadii.full)  // 999

// Typography
const FONT = fontFamilies.default          // Founders Grotesk
const FONT_DISPLAY = fontFamilies.display  // Tiempos Headline
const W_REGULAR = fontWeights.regular      // 400
const W_MEDIUM = fontWeights.medium        // 500

// ── Network tier type (from DS) ─────────────────────────────
type NetworkKey = NetworkTier

// ── Custom Icons (CoinIcon removed — now handled by DS ProviderCard) ──

// ── Provider Data ───────────────────────────────────────────

type CostLevel = 'lower' | 'typical' | 'higher'

interface Provider {
  name: string
  specialty: string
  address: string
  rating: number
  reviews: number
  distance: string
  virtual: boolean
  networkKey: NetworkKey
  networkName: string
  networkLabel: string
  cost: string
  costLevel: CostLevel
  nextApptLabel: string
  nextApptDate: string
  photo: string
  initials: string
}

// COST_CHIP_CONFIG removed — now handled by DS ProviderCard

// ── Use Case Configuration ──────────────────────────────────

type NetworkType = 'single' | 'multi'
type PlanType = 'connected' | 'not-connected' | 'no-deductible'
type BannerType = 'price-range' | 'copay' | 'connect' | 'procedure-picker' | 'same-price' | 'provider-charge'

interface SubVariant {
  id: string
  label: string
  subtitle: string
  description: string
  highlights: string[]
}

// ── Banner Copy — Single Source of Truth ─────────────────────

interface BannerCopyEntry {
  network: NetworkType
  plan: PlanType
  variant: string
  label?: string
  headline: string
  subtitle?: string
  button?: string
}

const INITIAL_BANNER_COPY: BannerCopyEntry[] = [
  // ── Single Network · Connected ──
  { network: 'single', plan: 'connected', variant: 'coinsurance',
    headline: 'Most people pay $1,400–$2,200 for this service in this area' },
  { network: 'single', plan: 'connected', variant: 'copay',
    headline: 'You\'ll pay $50 per visit' },
  { network: 'single', plan: 'connected', variant: 'procedure-before',
    headline: 'Choose your MRI type to see exact prices',
    subtitle: 'Your plan covers 40% coinsurance for MRI procedures. Prices vary by type.',
    button: 'Choose MRI type' },
  { network: 'single', plan: 'connected', variant: 'procedure-after',
    headline: 'Most people pay {price} for {procedure} in this area' },
  { network: 'single', plan: 'connected', variant: 'same-price',
    headline: 'Your estimated cost is $1,400',
    subtitle: 'Based on your plan\'s coinsurance rate' },

  // ── Single Network · Not Connected ──
  { network: 'single', plan: 'not-connected', variant: 'coinsurance',
    headline: 'Connect your deductible status to see exact prices',
    subtitle: 'Before deductible you\'ll pay 40% coinsurance. After deductible you\'ll pay $0.',
    button: 'Connect your deductible' },
  { network: 'single', plan: 'not-connected', variant: 'copay',
    headline: 'Connect your deductible status to see exact prices',
    subtitle: 'Before deductible you\'ll pay $50 per visit. After deductible you\'ll pay $0.',
    button: 'Connect your deductible' },
  { network: 'single', plan: 'not-connected', variant: 'procedure-before',
    headline: 'Select your MRI type to see providers',
    subtitle: 'MRI prices vary significantly by type. Choose yours so we can show you the right results.',
    button: 'Choose MRI type' },
  { network: 'single', plan: 'not-connected', variant: 'procedure-after',
    headline: 'Connect to see prices for {procedure}',
    subtitle: 'Before deductible you\'ll pay 40% coinsurance. After deductible you\'ll pay $0.',
    button: 'Connect your deductible' },

  // ── Multi Network · Connected ──
  { network: 'multi', plan: 'connected', variant: 'coinsurance',
    label: 'All in-network providers',
    headline: 'Most people pay $1,400–$2,200 for this service in this area' },
  { network: 'multi', plan: 'connected', variant: 'copay',
    label: 'All in-network providers',
    headline: 'You\'ll pay $30–$75 per visit' },
  { network: 'multi', plan: 'connected', variant: 'procedure-before',
    label: 'All in-network providers',
    headline: 'Choose your MRI type to see exact prices',
    subtitle: 'Your plan covers 40% coinsurance for MRI procedures. Prices vary by type.',
    button: 'Choose MRI type' },
  { network: 'multi', plan: 'connected', variant: 'procedure-after',
    label: 'All in-network providers',
    headline: 'Most people pay {price} for {procedure} in this area' },

  // ── Multi Network · Not Connected ──
  { network: 'multi', plan: 'not-connected', variant: 'coinsurance',
    headline: 'Connect your deductible status to see exact prices',
    subtitle: 'Before deductible you\'ll pay 40% coinsurance. After deductible you\'ll pay $0. Coverage varies by network tier.',
    button: 'Connect your deductible' },
  { network: 'multi', plan: 'not-connected', variant: 'copay',
    headline: 'Connect your deductible status to see exact prices',
    subtitle: 'Before deductible you\'ll pay $30–$75 per visit. After deductible you\'ll pay $0.',
    button: 'Connect your deductible' },
  { network: 'multi', plan: 'not-connected', variant: 'procedure-after',
    headline: 'Connect to see prices for {procedure}',
    subtitle: 'Before deductible you\'ll pay 40% coinsurance. After deductible you\'ll pay $0. Coverage varies by network tier.',
    button: 'Connect your deductible' },

  // ── Single Network · No Deductible ──
  { network: 'single', plan: 'no-deductible', variant: 'coinsurance',
    headline: 'Providers typically charge $2,000–$3,500 for this service',
    subtitle: 'Before deductible you\'ll pay 40% coinsurance. After deductible you\'ll pay $0.' },
  { network: 'single', plan: 'no-deductible', variant: 'copay',
    headline: 'Your copay for this visit',
    subtitle: 'Before deductible: $50 per visit. After deductible: $30 per visit.' },

  // ── Multi Network · No Deductible ──
  { network: 'multi', plan: 'no-deductible', variant: 'coinsurance',
    label: 'All in-network providers',
    headline: 'Providers typically charge $2,000–$3,500 for this service',
    subtitle: 'Before deductible you\'ll pay 40% coinsurance. After deductible you\'ll pay $0. Coverage varies by network tier.' },
  { network: 'multi', plan: 'no-deductible', variant: 'copay',
    label: 'All in-network providers',
    headline: 'Your copay for this visit',
    subtitle: 'Before deductible: $50 per visit. After deductible: $30 per visit. Copay varies by network tier.' },
]

function findBannerCopy(copy: BannerCopyEntry[], network: NetworkType, plan: PlanType, variant: string): BannerCopyEntry | undefined {
  return copy.find(c => c.network === network && c.plan === plan && c.variant === variant)
}

interface UseCaseConfig {
  id: PlanType
  tabLabel: string
  title: string
  description: string
  highlights: string[]
  searchQuery: string
  resultCount: string
  bannerType: BannerType
  showCostChips: boolean
  showPrice: boolean
  costLabel: string
  providers: Provider[]
  subVariants?: SubVariant[]
}

// ── Helpers ─────────────────────────────────────────────────

function parseDollar(s: string): number {
  return Number(s.replace(/[$,]/g, ''))
}

// ── MRI Procedure Data ──────────────────────────────────────

const MRI_PROCEDURES = [
  { value: 'brain-mri', label: 'Brain MRI', price: '$900–$1,200', additionalInfo: '$900–$1,200', rangeMin: '$500', rangeMax: '$1,800' },
  { value: 'knee-mri', label: 'Knee MRI', price: '$850–$1,100', additionalInfo: '$850–$1,100', rangeMin: '$450', rangeMax: '$1,600' },
  { value: 'lumbar-mri', label: 'Lumbar spine MRI', price: '$900–$1,150', additionalInfo: '$900–$1,150', rangeMin: '$500', rangeMax: '$1,700' },
  { value: 'full-body-mri', label: 'Full body MRI', price: '$1,800–$2,400', additionalInfo: '$1,800–$2,400', rangeMin: '$1,000', rangeMax: '$3,500' },
  { value: 'shoulder-mri', label: 'Shoulder MRI', price: '$850–$1,100', additionalInfo: '$850–$1,100', rangeMin: '$450', rangeMax: '$1,600' },
]

const MRI_PROVIDERS_DEFAULT: Provider[] = [
  {
    name: 'Lenox Hill Radiology',
    specialty: 'Imaging center',
    address: '457 Broome St, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '40%',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'LH',
  },
  {
    name: 'NYU Langone Imaging',
    specialty: 'Hospital radiology',
    address: '120 Broadway, New York, NY',
    rating: 4.5,
    reviews: 218,
    distance: '1.2 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '40%',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'NL',
  },
  {
    name: 'SimonMed Imaging',
    specialty: 'Radiology center',
    address: '89 5th Ave, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '2.3 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '40%',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'SM',
  },
]

const MRI_PROVIDERS_SELECTED: Provider[] = [
  {
    name: 'Lenox Hill Radiology',
    specialty: 'Imaging center',
    address: '457 Broome St, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$750',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'LH',
  },
  {
    name: 'NYU Langone Imaging',
    specialty: 'Hospital radiology',
    address: '120 Broadway, New York, NY',
    rating: 4.5,
    reviews: 218,
    distance: '1.2 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,050',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'NL',
  },
  {
    name: 'SimonMed Imaging',
    specialty: 'Radiology center',
    address: '89 5th Ave, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '2.3 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,450',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'SM',
  },
]

const COPAY_PROVIDERS: Provider[] = [
  {
    name: 'Dr. Lisa Chen',
    specialty: 'General dentistry',
    address: '200 W 57th St, New York, NY',
    rating: 4.8,
    reviews: 412,
    distance: '0.8 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LC',
  },
  {
    name: 'Dr. Mark Thompson',
    specialty: 'General dentistry',
    address: '350 5th Ave, New York, NY',
    rating: 4.2,
    reviews: 156,
    distance: '1.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    initials: 'MT',
  },
  {
    name: 'Dr. Amy Park',
    specialty: 'General dentistry',
    address: '55 E 34th St, New York, NY',
    rating: 4.6,
    reviews: 289,
    distance: '2.1 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/33.jpg',
    initials: 'AP',
  },
]

const SAME_PRICE_PROVIDERS: Provider[] = [
  {
    name: 'Lenox Hill Radiology',
    specialty: 'Imaging center',
    address: '61 E 77th St, New York, NY',
    rating: 4.1,
    reviews: 287,
    distance: '0.3 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=100&h=100&fit=crop',
    initials: 'LH',
  },
  {
    name: 'NYU Langone Imaging',
    specialty: 'Hospital radiology',
    address: '660 1st Ave, New York, NY',
    rating: 4.4,
    reviews: 512,
    distance: '0.7 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'NL',
  },
  {
    name: 'Mount Sinai Imaging',
    specialty: 'Hospital radiology',
    address: '1 Gustave L. Levy Pl, New York, NY',
    rating: 4.3,
    reviews: 398,
    distance: '1.0 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&h=100&fit=crop',
    initials: 'MS',
  },
  {
    name: 'Columbia Radiology',
    specialty: 'Imaging center',
    address: '51 W 51st St, New York, NY',
    rating: 4.0,
    reviews: 175,
    distance: '1.4 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'May 9',
    photo: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=100&h=100&fit=crop',
    initials: 'CR',
  },
  {
    name: 'Weill Cornell Imaging',
    specialty: 'Hospital radiology',
    address: '520 E 70th St, New York, NY',
    rating: 4.6,
    reviews: 441,
    distance: '0.9 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=100&h=100&fit=crop',
    initials: 'WC',
  },
  {
    name: 'East Side Imaging',
    specialty: 'Radiology center',
    address: '165 E 84th St, New York, NY',
    rating: 3.8,
    reviews: 132,
    distance: '1.6 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=100&h=100&fit=crop',
    initials: 'ES',
  },
  {
    name: 'Park Avenue Radiology',
    specialty: 'Imaging center',
    address: '812 Park Ave, New York, NY',
    rating: 4.2,
    reviews: 203,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'May 10',
    photo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100&h=100&fit=crop',
    initials: 'PA',
  },
  {
    name: 'Manhattan Diagnostic',
    specialty: 'Imaging center',
    address: '400 E 66th St, New York, NY',
    rating: 4.5,
    reviews: 367,
    distance: '0.8 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=100&h=100&fit=crop',
    initials: 'MD',
  },
  {
    name: 'Yorkville Imaging',
    specialty: 'Radiology center',
    address: '1623 3rd Ave, New York, NY',
    rating: 3.9,
    reviews: 98,
    distance: '1.8 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'May 9',
    photo: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=100&h=100&fit=crop',
    initials: 'YI',
  },
  {
    name: 'Upper East Radiology',
    specialty: 'Imaging center',
    address: '233 E 69th St, New York, NY',
    rating: 4.1,
    reviews: 156,
    distance: '1.1 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$1,400',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=100&h=100&fit=crop',
    initials: 'UE',
  },
]

// ── No-Deductible Provider Data (est. provider charge) ────────
const NO_DEDUCTIBLE_PROVIDERS: Provider[] = [
  {
    name: 'Manhattan Eye & Imaging',
    specialty: 'Ophthalmology clinic',
    address: '457 Broome St, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$2,100',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'ME',
  },
  {
    name: 'NYC Vision Center',
    specialty: 'Eye care facility',
    address: '120 Broadway, New York, NY',
    rating: 4.5,
    reviews: 218,
    distance: '1.2 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$2,800',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'NV',
  },
  {
    name: 'ClearSight Diagnostics',
    specialty: 'Imaging center',
    address: '89 5th Ave, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '2.3 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$3,400',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'CD',
  },
]

const MULTI_NO_DEDUCTIBLE_PROVIDERS: Provider[] = [
  {
    name: 'Manhattan Eye & Imaging',
    specialty: 'Ophthalmology clinic',
    address: '457 Broome St, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: 'Pardee & Family',
    networkLabel: 'In-network',
    cost: '$2,100',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'ME',
  },
  {
    name: 'NYC Vision Center',
    specialty: 'Eye care facility',
    address: '120 Broadway, New York, NY',
    rating: 4.5,
    reviews: 218,
    distance: '1.2 miles',
    virtual: false,
    networkKey: 'tier-2',
    networkName: 'Aetna tier 2',
    networkLabel: 'In-network',
    cost: '$2,800',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'NV',
  },
  {
    name: 'ClearSight Diagnostics',
    specialty: 'Imaging center',
    address: '89 5th Ave, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '2.3 miles',
    virtual: false,
    networkKey: 'tier-3',
    networkName: 'BlueCross tier 3',
    networkLabel: 'In-network',
    cost: '$3,400',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'CD',
  },
]

const NO_DEDUCTIBLE_COPAY_PROVIDERS: Provider[] = [
  {
    name: 'Dr. Lisa Chen',
    specialty: 'General dentistry',
    address: '200 W 57th St, New York, NY',
    rating: 4.8,
    reviews: 412,
    distance: '0.8 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$30–$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LC',
  },
  {
    name: 'Dr. Mark Thompson',
    specialty: 'General dentistry',
    address: '350 5th Ave, New York, NY',
    rating: 4.2,
    reviews: 156,
    distance: '1.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$30–$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    initials: 'MT',
  },
  {
    name: 'Dr. Amy Park',
    specialty: 'General dentistry',
    address: '55 E 34th St, New York, NY',
    rating: 4.6,
    reviews: 289,
    distance: '2.1 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$30–$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/33.jpg',
    initials: 'AP',
  },
]

const MULTI_NO_DEDUCTIBLE_COPAY_PROVIDERS: Provider[] = [
  {
    name: 'Dr. Lisa Chen',
    specialty: 'General dentistry',
    address: '200 W 57th St, New York, NY',
    rating: 4.8,
    reviews: 412,
    distance: '0.8 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: 'Pardee & Family',
    networkLabel: 'In-network',
    cost: '$20–$30',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LC',
  },
  {
    name: 'Dr. Mark Thompson',
    specialty: 'General dentistry',
    address: '350 5th Ave, New York, NY',
    rating: 4.2,
    reviews: 156,
    distance: '1.5 miles',
    virtual: false,
    networkKey: 'tier-2',
    networkName: 'Aetna tier 2',
    networkLabel: 'In-network',
    cost: '$35–$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    initials: 'MT',
  },
  {
    name: 'Dr. Amy Park',
    specialty: 'General dentistry',
    address: '55 E 34th St, New York, NY',
    rating: 4.6,
    reviews: 289,
    distance: '2.1 miles',
    virtual: false,
    networkKey: 'tier-3',
    networkName: 'BlueCross tier 3',
    networkLabel: 'In-network',
    cost: '$50–$75',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/33.jpg',
    initials: 'AP',
  },
]

const USE_CASES: UseCaseConfig[] = [
  {
    id: 'connected',
    tabLabel: 'Connected',
    title: 'Connected',
    description: '',
    highlights: [],
    subVariants: [
      {
        id: 'a',
        label: 'Option A',
        subtitle: 'Coinsurance',
        description: 'The member\'s plan covers a percentage of the procedure cost (e.g. 80/20 split). Since each provider charges a different rate, the final out-of-pocket amount varies.',
        highlights: [
          'Price range bar shows the typical cost window',
          'Each card displays estimated out-of-pocket cost',
          'Cost chips flag outliers (lower / higher than typical)',
        ],
      },
      {
        id: 'b',
        label: 'Option B',
        subtitle: 'Copay',
        description: 'The member\'s plan specifies a flat copay per visit. Every in-network provider costs the same, so the differentiator becomes rating, distance, and availability.',
        highlights: [
          'No price range — cost is identical across all providers',
          'Each card shows the flat copay amount',
          'No cost chips needed (no cost variation)',
        ],
      },
      {
        id: 'c',
        label: 'Option C',
        subtitle: 'Procedure Selection',
        description: 'After searching "MRI", a loader appears for 2 seconds, then a bottom sheet asks the user to pick the specific type. Results show only after selection, with the search bar updated to the chosen procedure.',
        highlights: [
          'Loading state before showing the bottom sheet',
          'Search bar updates to show selected procedure name',
          'User changes procedure via the search bar',
          'Price range bar + cost chips appear after selection',
        ],
      },
      {
        id: 'd',
        label: 'Option D',
        subtitle: 'Same Price',
        description: 'All providers found charge the same price. Common in areas with few providers or when all results belong to the same facility group.',
        highlights: [
          'Single price point instead of range',
          'No cost comparison chips',
          'Banner shows exact price with position on scale',
        ],
      },
    ],
    searchQuery: 'Retinal imaging',
    resultCount: '839 results',
    bannerType: 'price-range',
    showCostChips: true,
    showPrice: true,
    costLabel: 'est. out-of-pocket',
    providers: [
      {
        name: 'Manhattan Eye & Imaging',
        specialty: 'Ophthalmology clinic',
        address: '457 Broome St, New York, NY',
        rating: 3.9,
        reviews: 320,
        distance: '0.5 miles',
        virtual: false,
        networkKey: 'in-network',
        networkName: '',
        networkLabel: 'In-network',
        cost: '$1,250',
        costLevel: 'lower',
        nextApptLabel: 'Next available appointment',
        nextApptDate: 'Today, May 7',
        photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
        initials: 'ME',
      },
      {
        name: 'NYC Vision Center',
        specialty: 'Eye care facility',
        address: '120 Broadway, New York, NY',
        rating: 4.5,
        reviews: 218,
        distance: '1.2 miles',
        virtual: false,
        networkKey: 'in-network',
        networkName: '',
        networkLabel: 'In-network',
        cost: '$1,800',
        costLevel: 'typical',
        nextApptLabel: 'Next available appointment',
        nextApptDate: 'Tomorrow, May 8',
        photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
        initials: 'NV',
      },
      {
        name: 'ClearSight Diagnostics',
        specialty: 'Imaging center',
        address: '89 5th Ave, New York, NY',
        rating: 3.9,
        reviews: 320,
        distance: '2.3 miles',
        virtual: false,
        networkKey: 'in-network',
        networkName: '',
        networkLabel: 'In-network',
        cost: '$2,800',
        costLevel: 'higher',
        nextApptLabel: 'Next available appointment',
        nextApptDate: 'Today, May 7',
        photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
        initials: 'CD',
      },
    ],
  },
  {
    id: 'not-connected',
    tabLabel: 'Not Connected',
    title: 'No Deductible Status',
    description: '',
    highlights: [],
    subVariants: [
      {
        id: 'a',
        label: 'Option A',
        subtitle: 'Coinsurance',
        description: 'The member hasn\'t connected their deductible status yet. We know the coverage percentage but can\'t calculate dollar amounts without deductible info.',
        highlights: [
          'Banner prompts user to connect deductible',
          'Cards show coverage % instead of dollar amount',
          'No cost chips (can\'t compare without exact prices)',
        ],
      },
      {
        id: 'b',
        label: 'Option B',
        subtitle: 'Copay',
        description: 'The member has a copay plan but hasn\'t connected. Without knowing deductible status, we can\'t confirm costs — so no price or coverage info is shown on cards.',
        highlights: [
          'Banner prompts user to connect to see coverage and costs',
          'Cards show no price or coverage info',
          'User differentiates by rating, distance, and availability',
        ],
      },
      {
        id: 'c',
        label: 'Option C',
        subtitle: 'Procedure Selection',
        description: 'The member searches for a procedure (e.g. MRI) but isn\'t connected. A modal asks them to select the specific type (Step 1), then prompts them to connect (Step 2). Cards show no prices.',
        highlights: [
          'Step 1/2 modal guides the user through procedure selection',
          'After selection, connect banner references the specific procedure',
          'If modal dismissed, re-open prompt with button',
          'Cards show no prices — same as other not-connected variants',
        ],
      },
    ],
    searchQuery: 'Retinal imaging',
    resultCount: '839 results',
    bannerType: 'connect',
    showCostChips: false,
    showPrice: false,
    costLabel: 'coinsurance',
    providers: [
      {
        name: 'Manhattan Eye & Imaging',
        specialty: 'Ophthalmology clinic',
        address: '457 Broome St, New York, NY',
        rating: 3.9,
        reviews: 320,
        distance: '0.5 miles',
        virtual: false,
        networkKey: 'in-network',
        networkName: '',
        networkLabel: 'In-network',
        cost: '40%',
        costLevel: 'typical',
        nextApptLabel: 'Next available appointment',
        nextApptDate: 'Today, May 7',
        photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
        initials: 'ME',
      },
      {
        name: 'NYC Vision Center',
        specialty: 'Eye care facility',
        address: '120 Broadway, New York, NY',
        rating: 4.5,
        reviews: 218,
        distance: '1.2 miles',
        virtual: false,
        networkKey: 'in-network',
        networkName: '',
        networkLabel: 'In-network',
        cost: '40%',
        costLevel: 'typical',
        nextApptLabel: 'Next available appointment',
        nextApptDate: 'Tomorrow, May 8',
        photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
        initials: 'NV',
      },
      {
        name: 'ClearSight Diagnostics',
        specialty: 'Imaging center',
        address: '89 5th Ave, New York, NY',
        rating: 3.9,
        reviews: 320,
        distance: '2.3 miles',
        virtual: false,
        networkKey: 'in-network',
        networkName: '',
        networkLabel: 'In-network',
        cost: '40%',
        costLevel: 'typical',
        nextApptLabel: 'Next available appointment',
        nextApptDate: 'Today, May 7',
        photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
        initials: 'CD',
      },
    ],
  },
  {
    id: 'no-deductible',
    tabLabel: 'No Deductible Available',
    title: 'No Deductible Available',
    description: '',
    highlights: [],
    subVariants: [
      {
        id: 'a',
        label: 'Option A',
        subtitle: 'Coinsurance',
        description: 'Deductible connection is not available for this plan. We show estimated provider charges so users can compare costs across providers, along with their coverage terms.',
        highlights: [
          'Banner shows est. provider charge range + coverage terms',
          'No CTA button (nothing to connect to)',
          'Cards show "est. provider charge" with cost chips',
          'Users can compare relative cost across providers',
        ],
      },
      {
        id: 'b',
        label: 'Option B',
        subtitle: 'Copay',
        description: 'Deductible connection unavailable, copay plan. We know the copay but it differs before/after deductible, so cards show a range (e.g. $30–$50). Banner explains the before/after amounts.',
        highlights: [
          'Banner shows before/after deductible copay amounts',
          'No CTA button (nothing to connect to)',
          'Cards show copay range (before–after deductible)',
          'No cost chips (same range for all providers)',
        ],
      },
    ],
    searchQuery: 'Retinal imaging',
    resultCount: '839 results',
    bannerType: 'provider-charge',
    showCostChips: true,
    showPrice: true,
    costLabel: 'est. provider charge',
    providers: NO_DEDUCTIBLE_PROVIDERS,
  },
]

// ── Multi Network Provider Data ─────────────────────────────

const MULTI_CONNECTED_PROVIDERS: Provider[] = [
  {
    name: 'Manhattan Eye & Imaging',
    specialty: 'Ophthalmology clinic',
    address: '457 Broome St, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: 'Pardee & Family',
    networkLabel: 'In-network',
    cost: '$1,250',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'ME',
  },
  {
    name: 'NYC Vision Center',
    specialty: 'Eye care facility',
    address: '120 Broadway, New York, NY',
    rating: 4.5,
    reviews: 218,
    distance: '1.2 miles',
    virtual: false,
    networkKey: 'tier-2',
    networkName: 'Aetna tier 2',
    networkLabel: 'In-network',
    cost: '$1,800',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'NV',
  },
  {
    name: 'ClearSight Diagnostics',
    specialty: 'Imaging center',
    address: '89 5th Ave, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '2.3 miles',
    virtual: false,
    networkKey: 'tier-3',
    networkName: 'BlueCross tier 3',
    networkLabel: 'In-network',
    cost: '$2,800',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'CD',
  },
]

const MULTI_COPAY_PROVIDERS: Provider[] = [
  {
    name: 'Dr. Lisa Chen',
    specialty: 'General dentistry',
    address: '200 W 57th St, New York, NY',
    rating: 4.8,
    reviews: 412,
    distance: '0.8 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: 'Pardee & Family',
    networkLabel: 'In-network',
    cost: '$30',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LC',
  },
  {
    name: 'Dr. Mark Thompson',
    specialty: 'General dentistry',
    address: '350 5th Ave, New York, NY',
    rating: 4.2,
    reviews: 156,
    distance: '1.5 miles',
    virtual: false,
    networkKey: 'tier-2',
    networkName: 'Aetna tier 2',
    networkLabel: 'In-network',
    cost: '$50',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    initials: 'MT',
  },
  {
    name: 'Dr. Amy Park',
    specialty: 'General dentistry',
    address: '55 E 34th St, New York, NY',
    rating: 4.6,
    reviews: 289,
    distance: '2.1 miles',
    virtual: false,
    networkKey: 'tier-3',
    networkName: 'BlueCross tier 3',
    networkLabel: 'In-network',
    cost: '$75',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://randomuser.me/api/portraits/women/33.jpg',
    initials: 'AP',
  },
]

const MULTI_MRI_PROVIDERS_DEFAULT: Provider[] = [
  {
    name: 'Lenox Hill Radiology',
    specialty: 'Imaging center',
    address: '457 Broome St, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: 'Pardee & Family',
    networkLabel: 'In-network',
    cost: '40%',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'LH',
  },
  {
    name: 'NYU Langone Imaging',
    specialty: 'Hospital radiology',
    address: '120 Broadway, New York, NY',
    rating: 4.5,
    reviews: 218,
    distance: '1.2 miles',
    virtual: false,
    networkKey: 'tier-2',
    networkName: 'Aetna tier 2',
    networkLabel: 'In-network',
    cost: '40%',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'NL',
  },
  {
    name: 'SimonMed Imaging',
    specialty: 'Radiology center',
    address: '89 5th Ave, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '2.3 miles',
    virtual: false,
    networkKey: 'tier-3',
    networkName: 'BlueCross tier 3',
    networkLabel: 'In-network',
    cost: '40%',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'SM',
  },
]

const MULTI_MRI_PROVIDERS_SELECTED: Provider[] = [
  {
    name: 'Lenox Hill Radiology',
    specialty: 'Imaging center',
    address: '457 Broome St, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '0.5 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: 'Pardee & Family',
    networkLabel: 'In-network',
    cost: '$750',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'LH',
  },
  {
    name: 'NYU Langone Imaging',
    specialty: 'Hospital radiology',
    address: '120 Broadway, New York, NY',
    rating: 4.5,
    reviews: 218,
    distance: '1.2 miles',
    virtual: false,
    networkKey: 'tier-2',
    networkName: 'Aetna tier 2',
    networkLabel: 'In-network',
    cost: '$1,050',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'NL',
  },
  {
    name: 'SimonMed Imaging',
    specialty: 'Radiology center',
    address: '89 5th Ave, New York, NY',
    rating: 3.9,
    reviews: 320,
    distance: '2.3 miles',
    virtual: false,
    networkKey: 'tier-3',
    networkName: 'BlueCross tier 3',
    networkLabel: 'In-network',
    cost: '$1,450',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'SM',
  },
]

const MULTI_NOT_CONNECTED_PROVIDERS: Provider[] = MULTI_CONNECTED_PROVIDERS.map(p => ({
  ...p,
  cost: '40%',
  costLevel: 'typical' as CostLevel,
}))

const MULTI_NETWORK_USE_CASES: UseCaseConfig[] = [
  {
    id: 'connected',
    tabLabel: 'Connected',
    title: 'Connected',
    description: '',
    highlights: [],
    subVariants: [
      {
        id: 'a',
        label: 'Coinsurance',
        subtitle: 'Coinsurance',
        description: 'Multiple in-network tiers (Pardee & Family, Aetna tier 2, BlueCross tier 3) shown together. Cost varies by provider and network tier. Each card shows which network it belongs to.',
        highlights: [
          'Cards display network name + colored tier dot',
          'Price range reflects all in-network providers combined',
          'Cost chips compare across all networks',
        ],
      },
      {
        id: 'b',
        label: 'Copay',
        subtitle: 'Copay',
        description: 'Copay varies by network tier. Pardee & Family: $30, Aetna tier 2: $50, BlueCross tier 3: $75. Each card shows the copay for that provider\'s network.',
        highlights: [
          'Banner shows copay range ($30–$75) instead of single amount',
          'Each card shows its own copay based on network',
          'Cards display network name + colored tier dot',
        ],
      },
      {
        id: 'c',
        label: 'Procedure Selection',
        subtitle: 'Procedure Selection',
        description: 'Same MRI selection flow as single network, but after selection, cards show network names and costs vary by network tier.',
        highlights: [
          'Loading → modal flow (same as single network)',
          'After selection, cards show network name + tier dot',
          'Price range + cost chips reflect all networks combined',
        ],
      },
    ],
    searchQuery: 'Retinal imaging',
    resultCount: '839 results',
    bannerType: 'price-range',
    showCostChips: true,
    showPrice: true,
    costLabel: 'est. out-of-pocket',
    providers: MULTI_CONNECTED_PROVIDERS,
  },
  {
    id: 'not-connected',
    tabLabel: 'Not Connected',
    title: 'No Deductible Status',
    description: '',
    highlights: [],
    subVariants: [
      {
        id: 'a',
        label: 'Coinsurance',
        subtitle: 'Coinsurance',
        description: 'Member hasn\'t connected deductible. Multiple networks shown but without dollar amounts. Coverage percentage displayed instead. Each card shows its network tier.',
        highlights: [
          'Banner prompts user to connect deductible',
          'Cards show coverage % and network name + tier dot',
          'No cost chips (can\'t compare without exact prices)',
        ],
      },
      {
        id: 'b',
        label: 'Copay',
        subtitle: 'Copay',
        description: 'Copay plan, not connected. Cards show network names but no prices. User needs to connect to see per-network copay amounts.',
        highlights: [
          'Banner prompts user to connect',
          'Cards show network name but no price info',
          'User differentiates by rating, distance, availability',
        ],
      },
      {
        id: 'c',
        label: 'Procedure Selection',
        subtitle: 'Procedure Selection',
        description: 'MRI search, not connected, multi-network. Modal asks to select MRI type (no prices). After selection, connect banner shown. Cards show network names but no prices.',
        highlights: [
          'Modal shows MRI types without prices',
          'After selection, connect banner appears',
          'Cards show network name + tier dot, no prices',
        ],
      },
    ],
    searchQuery: 'Retinal imaging',
    resultCount: '839 results',
    bannerType: 'connect',
    showCostChips: false,
    showPrice: false,
    costLabel: 'coinsurance',
    providers: MULTI_NOT_CONNECTED_PROVIDERS,
  },
  {
    id: 'no-deductible',
    tabLabel: 'No Deductible Available',
    title: 'No Deductible Available',
    description: '',
    highlights: [],
    subVariants: [
      {
        id: 'a',
        label: 'Coinsurance',
        subtitle: 'Coinsurance',
        description: 'Deductible connection unavailable, multi-network. Provider charges shown as estimates across network tiers so users can compare. Coverage terms displayed in the banner.',
        highlights: [
          'Banner shows est. provider charge range + coverage terms',
          'Coverage varies by network tier noted in subtitle',
          'Cards show "est. provider charge" with cost chips + network tier',
          'No CTA button (nothing to connect to)',
        ],
      },
      {
        id: 'b',
        label: 'Copay',
        subtitle: 'Copay',
        description: 'Deductible connection unavailable, copay plan, multi-network. Copay differs before/after deductible and by network tier, so cards show a range per tier. Banner explains before/after amounts.',
        highlights: [
          'Banner shows before/after deductible copay amounts',
          'Cards show copay range per network tier',
          'No cost chips (range already conveys variation)',
          'No CTA button (nothing to connect to)',
        ],
      },
    ],
    searchQuery: 'Retinal imaging',
    resultCount: '839 results',
    bannerType: 'provider-charge',
    showCostChips: true,
    showPrice: true,
    costLabel: 'est. provider charge',
    providers: MULTI_NO_DEDUCTIBLE_PROVIDERS,
  },
]

// ── Stat Column ─────────────────────────────────────────────

function StatColumn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: SPACE_XXXS,
        flex: 1,
      }}
    >
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DEFAULT, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}

// ── Headline renderer — highlights $amounts and %values in blue ──

function RenderHeadline({ text }: { text: string }) {
  // Split on dollar amounts, percentages, and {placeholders}
  const parts = text.split(/(\$[\d,]+(?:–\$[\d,]+)?(?:\s+per\s+visit)?|\d+%\s*coinsurance|\{[^}]+\})/g)
  return (
    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 20, lineHeight: '24px', color: TEXT_DEFAULT }}>
      {parts.map((part, i) => {
        if (/^\$|^\d+%|\{/.test(part)) {
          return <span key={i} style={{ color: BLUE_TEXT_DARK }}>{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

function RenderSubtitle({ text }: { text: string }) {
  const parts = text.split(/(\$[\d,]+(?:–\$[\d,]+)?(?:\s+per\s+visit)?|\d+%\s*coinsurance)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (/^\$|^\d+%/.test(part)) {
          return <span key={i} style={{ fontWeight: W_MEDIUM, color: BLUE_TEXT_DARK }}>{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

// ── Price Range Bar (Co-Insurance) ──────────────────────────

function PriceRangeBar({ copy }: { copy: BannerCopyEntry }) {
  // Parse price range from headline (e.g. "$185–$310" or "$1,400–$2,200")
  const priceMatch = copy.headline.match(/\$([\d,]+)[–-]\$([\d,]+)/)
  const lo = priceMatch ? parseDollar(`$${priceMatch[1]}`) : 1400
  const hi = priceMatch ? parseDollar(`$${priceMatch[2]}`) : 2200
  // Compute sensible min/max for the bar (padding on each side)
  const range = hi - lo || 1
  const min = Math.max(0, Math.round(lo - range * 0.6))
  const max = Math.round(hi + range * 0.8)
  const formatPrice = (n: number) => `$${n.toLocaleString()}`

  return (
    <div>
      {copy.label && (
        <p style={{ margin: 0, marginBottom: SPACE_XXS, fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK }}>
          {copy.label}
        </p>
      )}
      <p style={{ margin: 0 }}>
        <RenderHeadline text={copy.headline} />
      </p>

      {/* Price bar — proportional to actual price positions */}
      {(() => {
        const leftFlex = lo - min
        const midFlex = hi - lo
        const rightFlex = max - hi
        const leftMarker = `${((lo - min) / (max - min)) * 100}%`
        const rightMarker = `${((hi - min) / (max - min)) * 100}%`
        return (
          <div style={{ marginTop: SPACE_L, position: 'relative', height: 12 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ flex: leftFlex, backgroundColor: '#e4e4e4' }} />
              <div style={{ flex: midFlex, backgroundColor: BLUE_SELECTED }} />
              <div style={{ flex: rightFlex, backgroundColor: '#e4e4e4' }} />
            </div>
            <div style={{ position: 'absolute', left: leftMarker, top: 0, bottom: 0, width: 2, backgroundColor: BLUE_TEXT_DARK, borderRadius: RADIUS_FULL }} />
            <div style={{ position: 'absolute', left: rightMarker, top: 0, bottom: 0, width: 2, backgroundColor: BLUE_TEXT_DARK, borderRadius: RADIUS_FULL }} />
          </div>
        )
      })()}

      {/* Min/Max labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: SPACE_XXXS }}>
        <span style={{ fontFamily: FONT, fontSize: 12, color: TEXT_DARK }}>{formatPrice(min)}</span>
        <span style={{ fontFamily: FONT, fontSize: 12, color: TEXT_DARK }}>{formatPrice(max)}</span>
      </div>
    </div>
  )
}

// ── Single Price Banner (Same Price for All) ────────────────

function SinglePriceBanner({ copy }: { copy: BannerCopyEntry }) {
  return (
    <div>
      <p style={{ margin: 0 }}>
        <RenderHeadline text={copy.headline} />
      </p>
      {copy.subtitle && (
        <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '18px', color: TEXT_DARK, marginTop: SPACE_XXS }}>
          {copy.subtitle}
        </p>
      )}
    </div>
  )
}

// ── Copay Banner (Fixed Copay) ──────────────────────────────

function CopayBanner({ copy }: { copy: BannerCopyEntry }) {
  return (
    <div>
      {copy.label && (
        <p style={{ margin: 0, marginBottom: SPACE_XXS, fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK }}>
          {copy.label}
        </p>
      )}
      <p style={{ margin: 0 }}>
        <RenderHeadline text={copy.headline} />
      </p>
    </div>
  )
}

// ── Connect Banner (Not Connected) ──────────────────────────

function ConnectBanner({ copy }: { copy: BannerCopyEntry }) {
  return (
    <div>
      <p style={{ margin: 0 }}>
        <RenderHeadline text={copy.headline} />
      </p>
      {copy.subtitle && (
        <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '18px', color: TEXT_DARK, marginTop: SPACE_XXS }}>
          <RenderSubtitle text={copy.subtitle} />
        </p>
      )}
      {copy.button && (
        <div style={{ marginTop: SPACE_S }}>
          <Button variant="primary" size="sm">
            {copy.button}
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Connect Banner — Copay (Not Connected, Variant B) ───────

function ConnectCopayBanner({ copy }: { copy: BannerCopyEntry }) {
  return (
    <div>
      <p style={{ margin: 0 }}>
        <RenderHeadline text={copy.headline} />
      </p>
      {copy.subtitle && (
        <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '18px', color: TEXT_DARK, marginTop: SPACE_XXS }}>
          <RenderSubtitle text={copy.subtitle} />
        </p>
      )}
      {copy.button && (
        <div style={{ marginTop: SPACE_S }}>
          <Button variant="primary" size="sm">
            {copy.button}
          </Button>
        </div>
      )}
    </div>
  )
}

function ConnectProcedureBanner({ copy, procedureName }: { copy: BannerCopyEntry; procedureName: string }) {
  const headline = copy.headline.replace('{procedure}', procedureName)
  return (
    <div>
      <p style={{ margin: 0 }}>
        <RenderHeadline text={headline} />
      </p>
      {copy.subtitle && (
        <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '18px', color: TEXT_DARK, marginTop: SPACE_XXS }}>
          <RenderSubtitle text={copy.subtitle} />
        </p>
      )}
      {copy.button && (
        <div style={{ marginTop: SPACE_S }}>
          <Button variant="primary" size="sm">
            {copy.button}
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Provider Charge Banner (No Deductible Available) ─────────

function ProviderChargeBanner({ copy }: { copy: BannerCopyEntry }) {
  return (
    <div>
      {copy.label && (
        <p style={{ margin: 0, marginBottom: SPACE_XXS, fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK }}>
          {copy.label}
        </p>
      )}
      <p style={{ margin: 0 }}>
        <RenderHeadline text={copy.headline} />
      </p>
      {copy.subtitle && (
        <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '18px', color: TEXT_DARK, marginTop: SPACE_XXS }}>
          <RenderSubtitle text={copy.subtitle} />
        </p>
      )}
    </div>
  )
}

// ── Loading Skeleton (Procedure Selection — Variant A) ──────

function SkeletonBlock({ width, height, radius = 8 }: { width: string | number; height: number; radius?: number }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: BORDER_LIGHT,
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  )
}

function LoadingSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: BG_WHITE,
        fontFamily: FONT,
        position: 'relative',
      }}
    >
      {/* Inline shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ── Sticky Header (same as real) ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: BG_WHITE }}>
        {/* Status Bar */}
        <div style={{ height: 54, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
          <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 15, color: TEXT_DEFAULT }}>9:41</span>
        </div>

        {/* Search Bar */}
        <div style={{ padding: `${SPACE_XXS}px ${SPACE_S}px`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <TextInput value="MRI" onChange={() => {}} shape="rounded" size="sm" iconRight={<CloseIcon size="sm" />} />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, color: TEXT_DEFAULT }}>Cancel</span>
        </div>

        {/* Searching Near */}
        <div style={{ padding: `${SPACE_XXXS}px ${SPACE_S}px ${SPACE_XS}px`, display: 'flex', alignItems: 'center', gap: SPACE_XXXS }}>
          <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>Searching near </span>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: W_MEDIUM, color: PRIMARY_TEXT, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            Home (1236 N Wood S...)
            <ChevronSmallDownIcon size="sm" />
          </span>
        </div>

        {/* Preferences + Map View */}
        <div style={{ padding: `${SPACE_XXS}px ${SPACE_S}px ${SPACE_S}px`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACE_XS, borderBottom: `1px solid ${BORDER_LIGHT}` }}>
          <Button variant="outline" size="sm" fullWidth iconLeft={<SettingsAdjustIcon size="md" />}>Preferences</Button>
          <Button variant="outline" size="sm" fullWidth iconLeft={<MapIcon size="md" />}>Map view</Button>
        </div>
      </div>

      {/* ── Skeleton Banner ── */}
      <div style={{ backgroundColor: BG_WHITE, padding: `${SPACE_S}px ${SPACE_M}px ${SPACE_L}px` }}>
        <div style={{ backgroundColor: BG_EXTRA_SUBTLE, padding: SPACE_S, borderRadius: RADIUS_XXS, display: 'flex', flexDirection: 'column', gap: SPACE_XXS }}>
          <SkeletonBlock width="85%" height={24} />
          <SkeletonBlock width="70%" height={18} />
          <SkeletonBlock width="60%" height={18} />
        </div>
      </div>

      {/* ── Skeleton Cards ── */}
      <div style={{ backgroundColor: BG_EXTRA_SUBTLE, padding: `${SPACE_S}px ${SPACE_S}px`, display: 'flex', flexDirection: 'column', gap: SPACE_S }}>
        <SkeletonBlock width={100} height={19} />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: BG_WHITE,
              borderRadius: RADIUS_S,
              border: `1px solid ${BORDER_LIGHT}`,
              padding: SPACE_S,
              display: 'flex',
              flexDirection: 'column',
              gap: SPACE_XS,
            }}
          >
            <div style={{ display: 'flex', gap: SPACE_XXS, alignItems: 'center' }}>
              <SkeletonBlock width={52} height={52} radius={999} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SPACE_XXXS }}>
                <SkeletonBlock width="70%" height={20} />
                <SkeletonBlock width="50%" height={16} />
                <SkeletonBlock width="80%" height={16} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: SPACE_XS }}>
              <SkeletonBlock width="30%" height={32} />
              <SkeletonBlock width="30%" height={32} />
              <SkeletonBlock width="30%" height={32} />
            </div>
            <SkeletonBlock width="40%" height={20} />
          </div>
        ))}
      </div>

      {/* Home Indicator */}
      <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: BG_EXTRA_SUBTLE }}>
        <div style={{ width: 134, height: 5, backgroundColor: TEXT_DEFAULT, borderRadius: 100 }} />
      </div>
    </div>
  )
}

// ── Procedure Modal (Bottom Sheet — Variant A) ──────────────

function ProcedureModal({
  onSelect,
  onClose,
  showPrices = true,
}: {
  onSelect: (value: string) => void
  onClose: () => void
  showPrices?: boolean
}) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'relative',
          backgroundColor: BG_WHITE,
          borderRadius: `${RADIUS_S}px ${RADIUS_S}px 0 0`,
          padding: `${SPACE_L}px ${SPACE_M}px ${SPACE_L}px`,
          maxHeight: '70%',
          overflow: 'auto',
        }}
      >
        <p style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: W_MEDIUM,
          fontSize: 22,
          lineHeight: '28px',
          color: TEXT_DEFAULT,
          margin: 0,
        }}>
          What type of MRI?
        </p>
        <p style={{
          fontFamily: FONT,
          fontWeight: W_REGULAR,
          fontSize: 14,
          lineHeight: '18px',
          color: TEXT_DARK,
          marginTop: SPACE_XXS,
        }}>
          {showPrices ? 'Choose a specific procedure to see estimated costs.' : 'Choose a specific procedure to continue.'}
        </p>

        {/* Option list */}
        <div style={{ marginTop: SPACE_S, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {MRI_PROCEDURES.map((proc) => {
            const isSelected = selected === proc.value
            return (
              <button
                key={proc.value}
                onClick={() => setSelected(proc.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${SPACE_XS}px ${SPACE_S}px`,
                  backgroundColor: isSelected ? sc.primary.surface.subtle : 'transparent',
                  border: 'none',
                  borderRadius: RADIUS_XXS,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background-color 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACE_XS }}>
                  {/* Radio circle */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: RADIUS_FULL,
                      border: `2px solid ${isSelected ? PRIMARY_TEXT : BORDER_STRONG}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        width: 10,
                        height: 10,
                        borderRadius: RADIUS_FULL,
                        backgroundColor: PRIMARY_TEXT,
                      }} />
                    )}
                  </div>
                  <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 16, color: TEXT_DEFAULT }}>
                    {proc.label}
                  </span>
                </div>
                {showPrices && (
                  <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, color: TEXT_DARK }}>
                    {proc.price}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Select button */}
        <div style={{ marginTop: SPACE_L }}>
          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Procedure Picker Banner ─────────────────────────────────

function ProcedurePickerBannerContent({
  selectedProcedure,
  onSelectProcedure,
  onOpenModal,
  copyBefore,
  copyAfter,
}: {
  selectedProcedure: string | null
  onSelectProcedure: (value: string) => void
  onOpenModal: () => void
  copyBefore: BannerCopyEntry
  copyAfter: BannerCopyEntry
}) {
  const selectedProc = MRI_PROCEDURES.find(p => p.value === selectedProcedure)

  // After selection — show price range for selected procedure
  if (selectedProcedure && selectedProc) {
    const headline = copyAfter.headline
      .replace('{price}', selectedProc.price)
      .replace('{procedure}', selectedProc.label.toLowerCase())
    return (
      <div>
        {copyAfter.label && (
          <p style={{ margin: 0, marginBottom: SPACE_XXS, fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK }}>
            {copyAfter.label}
          </p>
        )}
        <p style={{ margin: 0 }}>
          <RenderHeadline text={headline} />
        </p>

        {/* Price bar — proportional to actual price positions */}
        {(() => {
          const min = parseDollar(selectedProc.rangeMin)
          const max = parseDollar(selectedProc.rangeMax)
          const [loStr, hiStr] = selectedProc.price.split('–')
          const lo = parseDollar(loStr)
          const hi = parseDollar(hiStr)
          const leftFlex = lo - min
          const midFlex = hi - lo
          const rightFlex = max - hi
          const leftMarker = `${((lo - min) / (max - min)) * 100}%`
          const rightMarker = `${((hi - min) / (max - min)) * 100}%`
          return (
            <div style={{ marginTop: SPACE_L, position: 'relative', height: 12 }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ flex: leftFlex, backgroundColor: '#e4e4e4' }} />
                <div style={{ flex: midFlex, backgroundColor: BLUE_SELECTED }} />
                <div style={{ flex: rightFlex, backgroundColor: '#e4e4e4' }} />
              </div>
              <div style={{ position: 'absolute', left: leftMarker, top: 0, bottom: 0, width: 2, backgroundColor: BLUE_TEXT_DARK, borderRadius: RADIUS_FULL }} />
              <div style={{ position: 'absolute', left: rightMarker, top: 0, bottom: 0, width: 2, backgroundColor: BLUE_TEXT_DARK, borderRadius: RADIUS_FULL }} />
            </div>
          )
        })()}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: SPACE_XXXS }}>
          <span style={{ fontFamily: FONT, fontSize: 12, color: TEXT_DARK }}>{selectedProc.rangeMin}</span>
          <span style={{ fontFamily: FONT, fontSize: 12, color: TEXT_DARK }}>{selectedProc.rangeMax}</span>
        </div>
      </div>
    )
  }

  // Before selection — button to open modal
  return (
    <div>
      {copyBefore.label && (
        <p style={{ margin: 0, marginBottom: SPACE_XXS, fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK }}>
          {copyBefore.label}
        </p>
      )}
      <p style={{ margin: 0 }}>
        <RenderHeadline text={copyBefore.headline} />
      </p>
      {copyBefore.subtitle && (
        <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '18px', color: TEXT_DARK, marginTop: SPACE_XXS }}>
          {copyBefore.subtitle}
        </p>
      )}
      {copyBefore.button && (
        <div style={{ marginTop: SPACE_S }}>
          <Button variant="primary" size="sm" onClick={onOpenModal}>
            {copyBefore.button}
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Provider Card (adapter → DS ProviderCard) ──────────────

function ProviderCard({
  provider,
  showCostChip = true,
  showPrice = true,
  costLabel = 'est. out-of-pocket',
  onClick,
}: {
  provider: Provider
  showCostChip?: boolean
  showPrice?: boolean
  costLabel?: string
  onClick?: () => void
}) {
  return (
    <DSProviderCard
      name={provider.name}
      specialty={provider.specialty}
      photoUrl={provider.photo}
      address={provider.address}
      distance={provider.distance}
      rating={provider.rating}
      reviewCount={provider.reviews}
      networkTier={provider.networkKey}
      networkName={provider.networkName}
      networkLabel={provider.networkLabel}
      cost={provider.cost}
      costLevel={provider.costLevel}
      costLabel={costLabel}
      showCostChip={showCostChip}
      showPrice={showPrice}
      nextAppointmentLabel={provider.nextApptLabel}
      nextAppointmentDate={provider.nextApptDate}
      onCallClick={() => {}}
      onBookClick={() => {}}
      onClick={onClick}
    />
  )
}

// ── Screen Content ──────────────────────────────────────────

function ScreenContent({
  config,
  subVariant = 'a',
  selectedProcedure,
  onSelectProcedure,
  onOpenModal,
  isLoading = false,
  multiNetwork = false,
  bannerCopy,
  onProviderClick,
  usePriceBarV2,
}: {
  config: UseCaseConfig
  subVariant?: string
  selectedProcedure?: string | null
  onSelectProcedure?: (value: string | null) => void
  onOpenModal?: () => void
  isLoading?: boolean
  multiNetwork?: boolean
  bannerCopy: BannerCopyEntry[]
  onProviderClick?: (provider: Provider) => void
  usePriceBarV2?: { leftFraction: number; min: string; max: string }
}) {
  const networkKey: NetworkType = multiNetwork ? 'multi' : 'single'
  const planKey: PlanType = config.id
  // Determine overrides based on active sub-variant
  const isConnected = config.id === 'connected'
  const isConnectedCopay = isConnected && subVariant === 'b'
  const isConnectedProcedure = isConnected && subVariant === 'c'
  const isConnectedSamePrice = isConnected && subVariant === 'd'
  const isNotConnected = config.bannerType === 'connect'
  const isNotConnectedCopay = config.id === 'not-connected' && subVariant === 'b'
  const isNotConnectedProcedure = config.id === 'not-connected' && subVariant === 'c'
  const isNoDeductible = config.id === 'no-deductible'
  const isNoDeductibleCopay = isNoDeductible && subVariant === 'b'
  const hasProcedureFlow = isConnectedProcedure || isNotConnectedProcedure

  // Show selected procedure name in search bar, or default query
  const selectedProc = hasProcedureFlow ? MRI_PROCEDURES.find(p => p.value === selectedProcedure) : null
  const searchValue = selectedProc ? selectedProc.label : (hasProcedureFlow ? 'MRI' : config.searchQuery)

  // If loading, show skeleton (for procedure picker modal flow)
  if (isLoading && (isConnectedProcedure || isNotConnectedProcedure)) {
    return <LoadingSkeleton />
  }

  // Effective banner type
  const effectiveBannerType = isConnectedSamePrice ? 'same-price' as BannerType
    : isConnectedCopay ? 'copay' as BannerType
    : isConnectedProcedure ? 'procedure-picker' as BannerType
    : isNotConnectedProcedure ? 'connect' as BannerType
    : config.bannerType
  const effectiveSearchQuery = (isConnectedCopay || isNotConnectedCopay || isNoDeductibleCopay) ? 'Dentist' : searchValue
  const effectiveResultCount = isConnectedSamePrice ? '10 results'
    : (isConnectedCopay || isNotConnectedCopay || isNoDeductibleCopay) ? '1,204 results'
    : hasProcedureFlow ? '1,523 results'
    : config.resultCount

  const providers = isConnectedSamePrice
    ? SAME_PRICE_PROVIDERS
    : (isConnectedProcedure || isNotConnectedProcedure) && selectedProcedure
      ? (multiNetwork ? MULTI_MRI_PROVIDERS_SELECTED : MRI_PROVIDERS_SELECTED)
      : (isConnectedProcedure || isNotConnectedProcedure)
        ? (multiNetwork ? MULTI_MRI_PROVIDERS_DEFAULT : MRI_PROVIDERS_DEFAULT)
        : isNoDeductibleCopay
          ? (multiNetwork ? MULTI_NO_DEDUCTIBLE_COPAY_PROVIDERS : NO_DEDUCTIBLE_COPAY_PROVIDERS)
        : (isConnectedCopay || isNotConnectedCopay)
          ? (multiNetwork ? MULTI_COPAY_PROVIDERS : COPAY_PROVIDERS)
          : config.providers
  const showCostChips = isConnectedSamePrice
    ? false
    : isConnectedProcedure && selectedProcedure
      ? true
      : isConnectedProcedure && !selectedProcedure
        ? false
        : isNotConnected ? false
        : isConnectedCopay ? false
        : isNoDeductibleCopay ? false
        : config.showCostChips
  const showPrice = isNotConnected && !isNoDeductible ? false : true
  const costLabel = isConnectedSamePrice
    ? 'est. out-of-pocket'
    : isConnectedProcedure && selectedProcedure
      ? 'est. out-of-pocket'
      : isConnectedProcedure
        ? 'coinsurance'
        : isConnectedCopay
          ? 'copay per visit'
          : isNoDeductibleCopay
            ? 'copay range (depends on deductible)'
            : config.costLabel

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: BG_WHITE,
        fontFamily: FONT,
        position: 'relative',
      }}
    >
      {/* ── Sticky Header ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: BG_WHITE,
        }}
      >
        {/* Status Bar */}
        <div
          style={{
            height: 54,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 8,
          }}
        >
          <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 15, color: TEXT_DEFAULT }}>
            9:41
          </span>
        </div>

        {/* Search Bar */}
        <div
          style={{
            padding: `${SPACE_XXS}px ${SPACE_S}px`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ flex: 1 }}>
            <TextInput
              value={effectiveSearchQuery}
              onChange={() => {}}
              shape="rounded"
              size="sm"
              iconRight={
                <span
                  style={{ cursor: 'pointer', display: 'flex' }}
                  onClick={() => {
                    if (isConnectedProcedure && selectedProcedure) {
                      onSelectProcedure?.(null)
                    }
                  }}
                >
                  <CloseIcon size="sm" />
                </span>
              }
            />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, color: TEXT_DEFAULT, cursor: 'pointer' }}>
            Cancel
          </span>
        </div>

        {/* Searching Near */}
        <div
          style={{
            padding: `${SPACE_XXXS}px ${SPACE_S}px ${SPACE_XS}px`,
            display: 'flex',
            alignItems: 'center',
            gap: SPACE_XXXS,
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>
            Searching near{' '}
          </span>
          <span
            style={{
              fontFamily: FONT, fontSize: 14, fontWeight: W_MEDIUM, color: PRIMARY_TEXT,
              textDecoration: 'underline', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 2,
            }}
          >
            Home (1236 N Wood S...)
            <ChevronSmallDownIcon size="sm" />
          </span>
        </div>

        {/* Preferences + Map View */}
        <div
          style={{
            padding: `${SPACE_XXS}px ${SPACE_S}px ${SPACE_S}px`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: SPACE_XS,
            borderBottom: `1px solid ${BORDER_LIGHT}`,
          }}
        >
          <Button variant="outline" size="sm" fullWidth iconLeft={<SettingsAdjustIcon size="md" />}>
            Preferences
          </Button>
          <Button variant="outline" size="sm" fullWidth iconLeft={<MapIcon size="md" />}>
            Map view
          </Button>
        </div>
      </div>

      {/* ── Price Range / Copay Section ── */}
      <div
        style={{
          backgroundColor: BG_WHITE,
          padding: `${SPACE_S}px ${SPACE_M}px ${SPACE_L}px`,
        }}
      >
        <div
          style={{
            backgroundColor: effectiveBannerType === 'connect' ? sc.primary.surface.subtle : BG_EXTRA_SUBTLE,
            padding: SPACE_S,
            borderRadius: RADIUS_XXS,
          }}
        >
          {effectiveBannerType === 'price-range' && (() => {
            const copy = findBannerCopy(bannerCopy, networkKey, planKey, 'coinsurance')
            if (!copy) return null
            // Always use V2 — compute position from headline if not explicitly provided
            const v2Props = usePriceBarV2 || (() => {
              const m = copy.headline.match(/\$([\d,]+)[–-]\$([\d,]+)/)
              if (!m) return { leftFraction: 0.111, min: '$100', max: '$22,200' }
              const lo = parseDollar(`$${m[1]}`)
              const hi = parseDollar(`$${m[2]}`)
              const { leftFraction } = calcPriceBarPosition(lo, hi, 100, 22200)
              return { leftFraction, min: '$100', max: '$22,200' }
            })()
            return (
              <div>
                {copy.label && (
                  <p style={{ margin: 0, marginBottom: SPACE_XXS, fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK }}>
                    {copy.label}
                  </p>
                )}
                <p style={{ margin: '0 0 16px' }}>
                  <RenderHeadline text={copy.headline} />
                </p>
                <PriceRangeBarV2 {...v2Props} />
              </div>
            )
          })()}
          {effectiveBannerType === 'same-price' && (() => {
            const copy = findBannerCopy(bannerCopy, networkKey, planKey, 'same-price')
            return copy ? <SinglePriceBanner copy={copy} /> : null
          })()}
          {effectiveBannerType === 'copay' && (() => {
            const copy = findBannerCopy(bannerCopy, networkKey, planKey, 'copay')
            return copy ? <CopayBanner copy={copy} /> : null
          })()}
          {effectiveBannerType === 'connect' && subVariant === 'a' && (() => {
            const copy = findBannerCopy(bannerCopy, networkKey, 'not-connected', 'coinsurance')
            return copy ? <ConnectBanner copy={copy} /> : null
          })()}
          {effectiveBannerType === 'connect' && subVariant === 'c' && selectedProcedure && (() => {
            const selectedProc = MRI_PROCEDURES.find(p => p.value === selectedProcedure)
            const copy = findBannerCopy(bannerCopy, networkKey, 'not-connected', 'procedure-after')
            return copy ? <ConnectProcedureBanner copy={copy} procedureName={selectedProc?.label.toLowerCase() || 'procedure'} /> : null
          })()}
          {effectiveBannerType === 'connect' && subVariant === 'c' && !selectedProcedure && (() => {
            const copy = findBannerCopy(bannerCopy, networkKey, 'not-connected', 'procedure-before')
            if (!copy) return null
            return (
              <div>
                <p style={{ margin: 0 }}>
                  <RenderHeadline text={copy.headline} />
                </p>
                {copy.subtitle && (
                  <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '18px', color: TEXT_DARK, marginTop: SPACE_XXS }}>
                    {copy.subtitle}
                  </p>
                )}
                {copy.button && (
                  <div style={{ marginTop: SPACE_S }}>
                    <Button variant="primary" size="sm" onClick={() => onOpenModal?.()}>
                      {copy.button}
                    </Button>
                  </div>
                )}
              </div>
            )
          })()}
          {effectiveBannerType === 'connect' && subVariant === 'b' && (() => {
            const copy = findBannerCopy(bannerCopy, networkKey, 'not-connected', 'copay')
            return copy ? <ConnectCopayBanner copy={copy} /> : null
          })()}
          {effectiveBannerType === 'procedure-picker' && (() => {
            const copyBefore = findBannerCopy(bannerCopy, networkKey, 'connected', 'procedure-before')
            const copyAfter = findBannerCopy(bannerCopy, networkKey, 'connected', 'procedure-after')
            if (!copyBefore || !copyAfter) return null
            return (
              <ProcedurePickerBannerContent
                selectedProcedure={selectedProcedure || null}
                onSelectProcedure={(val) => { onSelectProcedure?.(val || null) }}
                onOpenModal={() => onOpenModal?.()}
                copyBefore={copyBefore}
                copyAfter={copyAfter}
              />
            )
          })()}
          {effectiveBannerType === 'provider-charge' && (() => {
            const variant = isNoDeductibleCopay ? 'copay' : 'coinsurance'
            const copy = findBannerCopy(bannerCopy, networkKey, 'no-deductible', variant)
            return copy ? <ProviderChargeBanner copy={copy} /> : null
          })()}
        </div>
      </div>

      {/* ── Results List ── */}
      <div
        style={{
          backgroundColor: BG_EXTRA_SUBTLE,
          padding: `${SPACE_S}px ${SPACE_S}px ${SPACE_S}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: SPACE_S,
        }}
      >
        <p style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 16, color: TEXT_DARK, lineHeight: '19px', margin: 0, paddingLeft: SPACE_XXXS }}>
          {effectiveResultCount}
        </p>
        {providers.map((p) => (
          <ProviderCard
            key={p.name + (selectedProcedure || '')}
            provider={p}
            showCostChip={showCostChips}
            showPrice={showPrice}
            costLabel={costLabel}
            onClick={onProviderClick ? () => onProviderClick(p) : undefined}
          />
        ))}
      </div>

      {/* ── Home Indicator ── */}
      <div
        style={{
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: BG_EXTRA_SUBTLE,
        }}
      >
        <div
          style={{
            width: 134,
            height: 5,
            backgroundColor: TEXT_DEFAULT,
            borderRadius: 100,
          }}
        />
      </div>

    </div>
  )
}

// ── iPhone 16 Frame ─────────────────────────────────────────

const IPHONE_WIDTH = 393
const IPHONE_HEIGHT = 852
const BEZEL = 12
const FRAME_RADIUS = 55

function IPhoneFrame({ children, overlay }: { children: React.ReactNode; overlay?: React.ReactNode }) {
  return (
    <div
      style={{
        width: IPHONE_WIDTH + BEZEL * 2,
        height: IPHONE_HEIGHT + BEZEL * 2,
        backgroundColor: '#000000',
        borderRadius: FRAME_RADIUS,
        padding: BEZEL,
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: BEZEL + 11,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 126,
          height: 37,
          backgroundColor: '#000000',
          borderRadius: 20,
          zIndex: 10,
        }}
      />

      {/* Screen */}
      <div
        style={{
          width: IPHONE_WIDTH,
          height: IPHONE_HEIGHT,
          borderRadius: FRAME_RADIUS - BEZEL,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className="phone-screen"
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            backgroundColor: BG_WHITE,
          }}
        >
          {children}
        </div>
        {overlay}
      </div>
    </div>
  )
}

// ── Use Case Description Panel ──────────────────────────────

/* Sidebar nav item */
function SidebarNavItem({
  label,
  isActive,
  indent,
  onClick,
  badge,
}: {
  label: string
  isActive: boolean
  indent?: boolean
  onClick: () => void
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        textAlign: 'left',
        fontFamily: FONT,
        fontWeight: isActive ? W_MEDIUM : W_REGULAR,
        fontSize: 13,
        lineHeight: '18px',
        color: isActive ? '#000000' : '#666666',
        backgroundColor: isActive ? '#efefef' : 'transparent',
        border: 'none',
        borderRadius: 8,
        padding: `8px 12px`,
        paddingLeft: indent ? 28 : 12,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {isActive && <span style={{ width: 3, height: 14, backgroundColor: PRIMARY_TEXT, borderRadius: 2, flexShrink: 0 }} />}
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontFamily: FONT,
          fontSize: 10,
          fontWeight: W_MEDIUM,
          color: '#666666',
          backgroundColor: '#d5d5d5',
          padding: '2px 6px',
          borderRadius: 4,
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}

/* Description panel below the iPhone */
function DescriptionPanel({
  config,
  activeSub,
}: {
  config: UseCaseConfig
  activeSub: { description: string; highlights: string[] } | null
}) {
  const description = activeSub ? activeSub.description : config.description
  const highlights = activeSub ? activeSub.highlights : config.highlights

  return (
    <div style={{
      maxWidth: 420,
      padding: '20px 0',
    }}>
      <p style={{
        fontFamily: FONT,
        fontWeight: W_REGULAR,
        fontSize: 13,
        lineHeight: '20px',
        color: '#666666',
        margin: 0,
      }}>
        {description}
      </p>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {highlights.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: PRIMARY_TEXT, fontSize: 6, lineHeight: '18px', flexShrink: 0, marginTop: 1 }}>●</span>
            <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 12, lineHeight: '18px', color: '#777777' }}>
              {h}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Copy Reference Modal ─────────────────────────────────────

function EditableField({
  value,
  onChange,
  isHeadline,
  isButton,
}: {
  value: string
  onChange: (val: string) => void
  isHeadline?: boolean
  isButton?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => { setDraft(value) }, [value])

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false) }}
        onKeyDown={(e) => { if (e.key === 'Enter') { onChange(draft); setEditing(false) } if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
        style={{
          fontFamily: FONT,
          fontSize: isHeadline ? 13 : 12,
          lineHeight: '18px',
          color: isButton ? PRIMARY_TEXT : isHeadline ? '#000000' : '#666666',
          fontWeight: isHeadline ? W_MEDIUM : W_REGULAR,
          backgroundColor: '#f5f5f5',
          border: `1px solid #d5d5d5`,
          borderRadius: 4,
          padding: '2px 6px',
          outline: 'none',
          width: '100%',
        }}
      />
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      style={{
        fontFamily: FONT,
        fontSize: isButton ? 12 : 13,
        lineHeight: '18px',
        color: isButton ? PRIMARY_TEXT : isHeadline ? '#000000' : '#666666',
        fontWeight: isHeadline || isButton ? W_MEDIUM : W_REGULAR,
        cursor: 'text',
        borderBottom: '1px dashed #d5d5d5',
        paddingBottom: 1,
        ...(isButton ? { backgroundColor: 'rgba(230, 80, 44, 0.1)', padding: '1px 8px', borderRadius: 4, borderBottom: 'none' } : {}),
      }}
    >
      {value}
    </span>
  )
}

function CopyReferenceModal({
  onClose,
  bannerCopy,
  setBannerCopy,
}: {
  onClose: () => void
  bannerCopy: BannerCopyEntry[]
  setBannerCopy: React.Dispatch<React.SetStateAction<BannerCopyEntry[]>>
}) {
  const sections = [
    { network: 'single' as NetworkType, plan: 'connected' as PlanType, title: 'Single Network', badge: 'Connected', badgeColor: '#22c55e' },
    { network: 'single', plan: 'not-connected' as PlanType, title: 'Single Network', badge: 'Not Connected', badgeColor: '#f59e0b' },
    { network: 'single', plan: 'no-deductible' as PlanType, title: 'Single Network', badge: 'No Deductible', badgeColor: '#a78bfa' },
    { network: 'multi' as NetworkType, plan: 'connected' as PlanType, title: 'Multi Network', badge: 'Connected', badgeColor: '#22c55e' },
    { network: 'multi', plan: 'not-connected' as PlanType, title: 'Multi Network', badge: 'Not Connected', badgeColor: '#f59e0b' },
    { network: 'multi', plan: 'no-deductible' as PlanType, title: 'Multi Network', badge: 'No Deductible', badgeColor: '#a78bfa' },
  ] as const

  const variantLabels: Record<string, string> = {
    'coinsurance': 'Coinsurance',
    'copay': 'Copay',
    'procedure-before': 'Procedure (before selection)',
    'procedure-after': 'Procedure (after selection)',
    'same-price': 'Same Price',
  }

  const variantBadgeColors: Record<string, { bg: string; color: string }> = {
    'coinsurance': { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
    'copay': { bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
    'procedure-before': { bg: 'rgba(250,204,21,0.12)', color: '#facc15' },
    'procedure-after': { bg: 'rgba(250,204,21,0.12)', color: '#facc15' },
    'same-price': { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
  }

  const updateEntry = (network: NetworkType, plan: PlanType, variant: string, field: keyof BannerCopyEntry, value: string) => {
    setBannerCopy(prev => prev.map(entry =>
      entry.network === network && entry.plan === plan && entry.variant === variant
        ? { ...entry, [field]: value }
        : entry
    ))
  }

  const isModified = JSON.stringify(bannerCopy) !== JSON.stringify(INITIAL_BANNER_COPY)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 24px',
        overflow: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 960,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '1px solid #d5d5d5',
          boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          borderBottom: '1px solid #d5d5d5',
          position: 'sticky',
          top: 0,
          backgroundColor: '#ffffff',
          zIndex: 10,
        }}>
          <div>
            <h2 style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: W_MEDIUM,
              fontSize: 20,
              color: '#000000',
              margin: 0,
              letterSpacing: '-0.2px',
            }}>
              Cost box copy reference
            </h2>
            <p style={{
              fontFamily: FONT,
              fontSize: 13,
              color: '#666666',
              margin: 0,
              marginTop: 4,
            }}>
              Click any text to edit. Changes update the mockups instantly.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isModified && (
              <button
                onClick={() => setBannerCopy(INITIAL_BANNER_COPY)}
                style={{
                  fontFamily: FONT,
                  fontWeight: W_MEDIUM,
                  fontSize: 12,
                  color: '#666666',
                  background: '#efefef',
                  border: '1px solid #d5d5d5',
                  borderRadius: 6,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Reset to defaults
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#efefef',
                border: 'none',
                borderRadius: 8,
                color: '#666666',
                cursor: 'pointer',
                fontSize: 18,
                fontFamily: FONT,
                lineHeight: 1,
                transition: 'background 0.15s ease',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 32, maxHeight: '75vh', overflow: 'auto' }}>
          {sections.map(({ network, plan, title, badge, badgeColor }) => {
            const entries = bannerCopy.filter(c => c.network === network && c.plan === plan)
            if (entries.length === 0) return null
            return (
              <div key={`${network}-${plan}`}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{
                    fontFamily: FONT,
                    fontWeight: W_MEDIUM,
                    fontSize: 14,
                    color: '#000000',
                  }}>
                    {title}
                  </span>
                  <span style={{
                    fontFamily: FONT,
                    fontWeight: W_MEDIUM,
                    fontSize: 11,
                    color: badgeColor,
                    backgroundColor: `${badgeColor}18`,
                    padding: '2px 8px',
                    borderRadius: RADIUS_FULL,
                    letterSpacing: '0.2px',
                  }}>
                    {badge}
                  </span>
                </div>

                {/* Entries */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {entries.map((entry) => {
                    const badgeStyle = variantBadgeColors[entry.variant] || { bg: '#efefef', color: '#666666' }
                    return (
                      <div
                        key={`${entry.network}-${entry.plan}-${entry.variant}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '180px 1fr',
                          backgroundColor: '#f5f5f5',
                          borderRadius: 10,
                          padding: '14px 18px',
                          gap: 16,
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#efefef' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                      >
                        {/* Left: Variant badge */}
                        <div>
                          <span style={{
                            fontFamily: FONT,
                            fontWeight: W_MEDIUM,
                            fontSize: 12,
                            color: badgeStyle.color,
                            backgroundColor: badgeStyle.bg,
                            padding: '3px 10px',
                            borderRadius: RADIUS_FULL,
                            display: 'inline-block',
                          }}>
                            {variantLabels[entry.variant] || entry.variant}
                          </span>
                          {entry.label && (
                            <div style={{ marginTop: 8 }}>
                              <span style={{
                                fontFamily: FONT,
                                fontWeight: W_MEDIUM,
                                fontSize: 10,
                                color: '#666666',
                                textTransform: 'uppercase' as const,
                                letterSpacing: '0.5px',
                                display: 'block',
                                marginBottom: 2,
                              }}>
                                Label
                              </span>
                              <EditableField
                                value={entry.label}
                                onChange={(val) => updateEntry(entry.network, entry.plan, entry.variant, 'label', val)}
                              />
                            </div>
                          )}
                        </div>

                        {/* Right: Copy fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {/* Headline */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{
                              fontFamily: FONT,
                              fontWeight: W_MEDIUM,
                              fontSize: 10,
                              color: '#666666',
                              textTransform: 'uppercase' as const,
                              letterSpacing: '0.5px',
                              width: 64,
                              flexShrink: 0,
                              paddingTop: 3,
                            }}>
                              Headline
                            </span>
                            <EditableField
                              value={entry.headline}
                              onChange={(val) => updateEntry(entry.network, entry.plan, entry.variant, 'headline', val)}
                              isHeadline
                            />
                          </div>

                          {/* Subtitle */}
                          {entry.subtitle && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <span style={{
                                fontFamily: FONT,
                                fontWeight: W_MEDIUM,
                                fontSize: 10,
                                color: '#666666',
                                textTransform: 'uppercase' as const,
                                letterSpacing: '0.5px',
                                width: 64,
                                flexShrink: 0,
                                paddingTop: 3,
                              }}>
                                Subtitle
                              </span>
                              <EditableField
                                value={entry.subtitle}
                                onChange={(val) => updateEntry(entry.network, entry.plan, entry.variant, 'subtitle', val)}
                              />
                            </div>
                          )}

                          {/* Button */}
                          {entry.button && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <span style={{
                                fontFamily: FONT,
                                fontWeight: W_MEDIUM,
                                fontSize: 10,
                                color: '#666666',
                                textTransform: 'uppercase' as const,
                                letterSpacing: '0.5px',
                                width: 64,
                                flexShrink: 0,
                                paddingTop: 3,
                              }}>
                                Button
                              </span>
                              <EditableField
                                value={entry.button}
                                onChange={(val) => updateEntry(entry.network, entry.plan, entry.variant, 'button', val)}
                                isButton
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Demo Flow: Search Screen ────────────────────────────────

// ── Demo Flow: Orthopedist Copay-specific data ───────────────

const DEMO_ORTHO_PROVIDERS: Provider[] = [
  {
    name: 'Dr. David Hoffman',
    specialty: 'Orthopedist',
    address: '520 E 70th St, New York, NY',
    rating: 4.9,
    reviews: 487,
    distance: '0.6 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$45',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop',
    initials: 'DH',
  },
  {
    name: 'Dr. Maria Santos',
    specialty: 'Orthopedist',
    address: '333 E 38th St, New York, NY',
    rating: 4.7,
    reviews: 312,
    distance: '1.0 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$45',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=100&h=100&fit=crop',
    initials: 'MS',
  },
  {
    name: 'Dr. Kevin Patel',
    specialty: 'Orthopedist',
    address: '1190 Fifth Ave, New York, NY',
    rating: 4.6,
    reviews: 245,
    distance: '1.5 miles',
    virtual: true,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$45',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
    initials: 'KP',
  },
  {
    name: 'Dr. Rachel Nguyen',
    specialty: 'Orthopedist',
    address: '245 W 47th St, New York, NY',
    rating: 4.5,
    reviews: 198,
    distance: '1.8 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$45',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Thu, May 8',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
    initials: 'RN',
  },
  {
    name: 'Dr. Anthony Brooks',
    specialty: 'Orthopedist',
    address: '10 Union Square E, New York, NY',
    rating: 4.4,
    reviews: 176,
    distance: '2.3 miles',
    virtual: true,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$45',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Fri, May 9',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop',
    initials: 'AB',
  },
]

// ── Demo Flow: Retinal Imaging-specific data ─────────────────

const DEMO_RETINAL_PROVIDERS: Provider[] = [
  {
    name: 'Dr. Emily Park',
    specialty: 'Ophthalmologist',
    address: '133 E 58th St, New York, NY',
    rating: 4.9,
    reviews: 412,
    distance: '0.5 miles',
    virtual: true,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$72',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=100&h=100&fit=crop',
    initials: 'EP',
  },
  {
    name: 'Manhattan Eye Center',
    specialty: 'Retinal imaging center',
    address: '30 E 40th St, New York, NY',
    rating: 4.6,
    reviews: 287,
    distance: '0.9 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$95',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=100&h=100&fit=crop',
    initials: 'ME',
  },
  {
    name: 'Dr. Michael Torres',
    specialty: 'Ophthalmologist',
    address: '1000 Park Ave, New York, NY',
    rating: 4.7,
    reviews: 339,
    distance: '1.3 miles',
    virtual: true,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$155',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
    initials: 'MT',
  },
  {
    name: 'Dr. Lisa Wang',
    specialty: 'Ophthalmologist',
    address: '234 W 56th St, New York, NY',
    rating: 4.5,
    reviews: 198,
    distance: '1.6 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$185',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Thu, May 8',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
    initials: 'LW',
  },
  {
    name: 'NYC Vision Diagnostics',
    specialty: 'Ophthalmology clinic',
    address: '485 Madison Ave, New York, NY',
    rating: 4.4,
    reviews: 221,
    distance: '1.9 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$198',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Fri, May 9',
    photo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&h=100&fit=crop',
    initials: 'NV',
  },
  {
    name: 'Dr. Robert Kim',
    specialty: 'Ophthalmologist',
    address: '161 Madison Ave, New York, NY',
    rating: 4.3,
    reviews: 156,
    distance: '2.2 miles',
    virtual: true,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$210',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Mon, May 12',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop',
    initials: 'RK',
  },
]

// ── Demo Flow: MRI-specific data ─────────────────────────────

const DEMO_MAMMOGRAPHY_PROVIDERS: Provider[] = [
  {
    name: 'CityMed Diagnostics',
    specialty: 'MRI & imaging facility',
    address: '220 E 42nd St, New York, NY',
    rating: 4.5,
    reviews: 318,
    distance: '1.1 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$380',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&h=100&fit=crop',
    initials: 'CD',
  },
  {
    name: 'Mount Sinai Radiology',
    specialty: 'Radiology & imaging',
    address: '5 E 98th St, New York, NY',
    rating: 4.6,
    reviews: 389,
    distance: '1.4 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$425',
    costLevel: 'typical',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Tomorrow, May 8',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=100&h=100&fit=crop',
    initials: 'MS',
  },
  {
    name: 'Dr. James Rivera',
    specialty: 'Rheumatologist',
    address: '310 E 14th St, New York, NY',
    rating: 4.4,
    reviews: 163,
    distance: '2.5 miles',
    virtual: true,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$305',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Mon, May 12',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
    initials: 'JR',
  },
  {
    name: 'NYU Langone Imaging',
    specialty: 'Diagnostic imaging center',
    address: '160 E 34th St, New York, NY',
    rating: 4.8,
    reviews: 542,
    distance: '0.7 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$245',
    costLevel: 'lower',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Today, May 7',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    initials: 'NL',
  },
  {
    name: 'Dr. Sarah Chen',
    specialty: 'Rheumatologist',
    address: '635 Madison Ave, New York, NY',
    rating: 4.7,
    reviews: 205,
    distance: '1.8 miles',
    virtual: true,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$610',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Thu, May 8',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
    initials: 'SC',
  },
  {
    name: 'Manhattan Imaging Center',
    specialty: 'Radiology clinic',
    address: '425 Madison Ave, New York, NY',
    rating: 4.3,
    reviews: 276,
    distance: '2.1 miles',
    virtual: false,
    networkKey: 'in-network',
    networkName: '',
    networkLabel: 'In-network',
    cost: '$890',
    costLevel: 'higher',
    nextApptLabel: 'Next available appointment',
    nextApptDate: 'Fri, May 9',
    photo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    initials: 'MB',
  },
]

const DEMO_MAMMOGRAPHY_CONFIG: UseCaseConfig = {
  id: 'connected',
  tabLabel: 'Connected',
  title: 'Connected',
  description: '',
  highlights: [],
  subVariants: [],
  searchQuery: 'Mammography',
  resultCount: '1,204 results',
  bannerType: 'price-range',
  showCostChips: true,
  showPrice: true,
  costLabel: 'est. out-of-pocket',
  providers: DEMO_MAMMOGRAPHY_PROVIDERS,
}

const DEMO_BANNER_COPY: BannerCopyEntry[] = [
  ...INITIAL_BANNER_COPY.map(entry =>
    entry.network === 'single' && entry.plan === 'connected' && entry.variant === 'coinsurance'
      ? { ...entry, headline: 'Most people pay $305–$500 for this service in this area' }
      : entry
  ),
]

// ── Demo Scenarios ──────────────────────────────────────────

type DemoScenario = {
  id: string
  label: string
  title: string
  desc: string
  searchQuery: string
  resultCount: string
  headline: string
  variant?: 'coinsurance' | 'copay'
  priceBar: { lo: number; hi: number; min: number; max: number; minLabel: string; maxLabel: string; position?: number }
  providers: Provider[]
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'retinal-imaging',
    label: 'Scenario 1',
    title: 'Retinal Imaging',
    desc: 'Coinsurance plan — the member pays a percentage of the cost. Prices vary by provider, shown as a range.',
    searchQuery: 'Retinal imaging',
    resultCount: '847 results',
    headline: 'Most people pay $150–$200 for this service in this area',
    priceBar: { lo: 150, hi: 200, min: 69, max: 212, minLabel: '$69', maxLabel: '$212' },
    providers: DEMO_RETINAL_PROVIDERS,
  },
  {
    id: 'mammography',
    label: 'Scenario 2',
    title: 'MRI Scan',
    desc: 'Coinsurance plan — wide cost variation across providers. The price range bar highlights the typical window.',
    searchQuery: 'MRI scan',
    resultCount: '1,204 results',
    headline: 'Most people pay $305–$500 for this service in this area',
    priceBar: { lo: 305, hi: 500, min: 201, max: 5400, minLabel: '$201', maxLabel: '$5,400', position: 2 },
    providers: DEMO_MAMMOGRAPHY_PROVIDERS,
  },
  {
    id: 'orthopedist-copay',
    label: 'Scenario 3',
    title: 'Orthopedist Visit',
    desc: 'Copay plan — the member pays a flat fee per visit. All in-network providers cost the same.',
    searchQuery: 'Orthopedist',
    resultCount: '312 results',
    headline: "You'll pay $45 per visit",
    variant: 'copay',
    priceBar: { lo: 0, hi: 0, min: 0, max: 0, minLabel: '', maxLabel: '' },
    providers: DEMO_ORTHO_PROVIDERS,
  },
]

const SPECIALTIES = [
  { label: 'Primary care', Icon: PrimaryCareIcon },
  { label: 'Dentists', Icon: DentistIcon },
  { label: 'Eye doctor', Icon: EyeDoctorIcon },
  { label: 'OB-GYN', Icon: ObGynIcon },
  { label: 'Dermatologist', Icon: DermatologyIcon },
  { label: 'Orthopedist', Icon: OrthopedistIcon },
]

const PROCEDURES = ['MRI scan', 'Retinal imaging', 'X-ray', 'Blood test', 'Lipids', 'Mammography']

const RECENT_SEARCHES = [
  'Primary care provider',
  'Urgent care',
  'Mental health specialist',
]

// iOS keyboard rows (simplified)
const KB_ROW_1 = ['Q','W','E','R','T','Y','U','I','O','P']
const KB_ROW_2 = ['A','S','D','F','G','H','J','K','L']
const KB_ROW_3 = ['Z','X','C','V','B','N','M']

function DemoSearchScreen({ onSelect }: { onSelect: (term: string) => void }) {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: BG_WHITE, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      {/* Status Bar */}
      <div style={{ height: 54, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 15, color: TEXT_DEFAULT }}>9:41</span>
      </div>

      {/* Search Bar */}
      <div style={{ padding: `${SPACE_XXS}px ${SPACE_S}px`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#f2f2f2',
            borderRadius: RADIUS_FULL,
            padding: '10px 14px',
          }}>
            <SearchIcon size="sm" color={TEXT_LIGHT} />
            <div style={{
              width: 1.5,
              height: 18,
              backgroundColor: PRIMARY_TEXT,
              animation: 'blink 1s step-end infinite',
            }} />
          </div>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, color: PRIMARY_TEXT, cursor: 'pointer' }}>Cancel</span>
      </div>

      {/* Blink cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Search Near */}
      <div style={{ padding: `${SPACE_XXXS}px ${SPACE_S}px ${SPACE_XS}px`, display: 'flex', alignItems: 'center', gap: SPACE_XXXS, flexShrink: 0 }}>
        <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>Search near </span>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: W_MEDIUM, color: PRIMARY_TEXT, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          Home (1236 N Wood S...)
          <ChevronSmallDownIcon size="sm" />
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* Frequently searched specialties */}
        <div style={{ padding: `${SPACE_S}px ${SPACE_S}px ${SPACE_XXS}px` }}>
          <h3 style={{
            fontFamily: FONT,
            fontWeight: W_MEDIUM,
            fontSize: 16,
            color: TEXT_DEFAULT,
            margin: `0 0 ${SPACE_XS}px`,
          }}>
            Frequently searched specialities
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: SPACE_XXS,
          }}>
            {SPECIALTIES.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => onSelect(label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  backgroundColor: BG_WHITE,
                  border: `1px solid ${BORDER_LIGHT}`,
                  borderRadius: RADIUS_XXS,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: W_REGULAR,
                  color: TEXT_DEFAULT,
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG_EXTRA_SUBTLE)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = BG_WHITE)}
              >
                <Icon size="md" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Frequently searched procedures */}
        <div style={{ padding: `${SPACE_S}px ${SPACE_S}px ${SPACE_XXS}px` }}>
          <h3 style={{
            fontFamily: FONT,
            fontWeight: W_MEDIUM,
            fontSize: 16,
            color: TEXT_DEFAULT,
            margin: `0 0 ${SPACE_XS}px`,
          }}>
            Frequently searched procedures
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACE_XXS }}>
            {PROCEDURES.map((proc) => (
              <button
                key={proc}
                onClick={() => onSelect(proc)}
                style={{
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: W_REGULAR,
                  color: TEXT_DEFAULT,
                  backgroundColor: BG_WHITE,
                  border: `1px solid ${BORDER_LIGHT}`,
                  borderRadius: RADIUS_FULL,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG_EXTRA_SUBTLE)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = BG_WHITE)}
              >
                {proc}
              </button>
            ))}
          </div>
        </div>

        {/* Recent searches */}
        <div style={{ padding: `${SPACE_S}px ${SPACE_S}px ${SPACE_XXS}px` }}>
          <h3 style={{
            fontFamily: FONT,
            fontWeight: W_MEDIUM,
            fontSize: 16,
            color: TEXT_DEFAULT,
            margin: `0 0 ${SPACE_XXS}px`,
          }}>
            Recent searches
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RECENT_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => onSelect(term)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${BORDER_LIGHT}`,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: W_REGULAR,
                  color: TEXT_DEFAULT,
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG_EXTRA_SUBTLE)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Clock16Icon size="sm" color={TEXT_LIGHT} />
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated iOS Keyboard */}
      <div style={{
        flexShrink: 0,
        backgroundColor: '#d1d4db',
        padding: '8px 3px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {[KB_ROW_1, KB_ROW_2, KB_ROW_3].map((row, ri) => (
          <div key={ri} style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
          }}>
            {ri === 2 && (
              <div style={{
                width: 38, height: 42, backgroundColor: '#abb0ba', borderRadius: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: TEXT_DEFAULT,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor"/></svg>
              </div>
            )}
            {row.map(key => (
              <div
                key={key}
                style={{
                  width: ri === 0 ? 33 : ri === 1 ? 36 : 33,
                  height: 42,
                  backgroundColor: '#ffffff',
                  borderRadius: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT,
                  fontSize: 22,
                  fontWeight: W_REGULAR,
                  color: TEXT_DEFAULT,
                  boxShadow: '0 1px 0 rgba(0,0,0,0.3)',
                }}
              >
                {key}
              </div>
            ))}
            {ri === 2 && (
              <div style={{
                width: 38, height: 42, backgroundColor: '#abb0ba', borderRadius: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
        ))}
        {/* Bottom row: 123 / space / search */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <div style={{
            width: 82, height: 42, backgroundColor: '#abb0ba', borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT, fontSize: 15, fontWeight: W_REGULAR, color: TEXT_DEFAULT,
          }}>
            123
          </div>
          <div style={{
            flex: 1, height: 42, backgroundColor: '#ffffff', borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT, fontSize: 15, fontWeight: W_REGULAR, color: TEXT_LIGHT,
          }}>
            space
          </div>
          <div style={{
            width: 82, height: 42, backgroundColor: '#abb0ba', borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT, fontSize: 15, fontWeight: W_MEDIUM, color: TEXT_DEFAULT,
          }}>
            search
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Demo Flow: Loading Screen ───────────────────────────────

function DemoLoadingScreen({ searchTerm }: { searchTerm: string }) {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: BG_WHITE, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      {/* Inline shimmer animation */}
      <style>{`
        @keyframes demoShimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Status Bar */}
      <div style={{ height: 54, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 15, color: TEXT_DEFAULT }}>9:41</span>
      </div>

      {/* Search Bar with search term */}
      <div style={{ padding: `${SPACE_XXS}px ${SPACE_S}px`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <TextInput value={searchTerm} onChange={() => {}} shape="rounded" size="sm" iconRight={<CloseIcon size="sm" />} />
        </div>
        <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, color: TEXT_DEFAULT }}>Cancel</span>
      </div>

      {/* Search Near */}
      <div style={{ padding: `${SPACE_XXXS}px ${SPACE_S}px ${SPACE_XS}px`, display: 'flex', alignItems: 'center', gap: SPACE_XXXS, flexShrink: 0 }}>
        <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>Searching near </span>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: W_MEDIUM, color: PRIMARY_TEXT, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          Home (1236 N Wood S...)
          <ChevronSmallDownIcon size="sm" />
        </span>
      </div>

      {/* Preferences + Map View */}
      <div style={{ padding: `${SPACE_XXS}px ${SPACE_S}px ${SPACE_S}px`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACE_XS, borderBottom: `1px solid ${BORDER_LIGHT}`, flexShrink: 0 }}>
        <Button variant="outline" size="sm" fullWidth iconLeft={<SettingsAdjustIcon size="md" />}>Preferences</Button>
        <Button variant="outline" size="sm" fullWidth iconLeft={<MapIcon size="md" />}>Map view</Button>
      </div>

      {/* Loading area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: SPACE_M }}>
        {/* Spinner */}
        <div style={{
          width: 40,
          height: 40,
          border: `3px solid ${BORDER_LIGHT}`,
          borderTopColor: PRIMARY_TEXT,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: W_REGULAR,
          color: TEXT_LIGHT,
        }}>
          Searching for {searchTerm.toLowerCase()}...
        </span>
      </div>

      {/* Skeleton cards at bottom */}
      <div style={{ padding: `0 ${SPACE_S}px ${SPACE_S}px`, display: 'flex', flexDirection: 'column', gap: SPACE_XS }}>
        {[1, 2].map(i => (
          <div key={i} style={{
            backgroundColor: BG_WHITE,
            borderRadius: RADIUS_S,
            border: `1px solid ${BORDER_LIGHT}`,
            padding: SPACE_S,
            display: 'flex',
            gap: SPACE_XXS,
            alignItems: 'center',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              backgroundColor: '#eeeeee',
              animation: 'demoShimmer 1.5s ease-in-out infinite',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ width: '70%', height: 16, backgroundColor: '#eeeeee', borderRadius: 4, animation: 'demoShimmer 1.5s ease-in-out infinite' }} />
              <div style={{ width: '50%', height: 14, backgroundColor: '#eeeeee', borderRadius: 4, animation: 'demoShimmer 1.5s ease-in-out infinite', animationDelay: '0.2s' }} />
              <div style={{ width: '85%', height: 14, backgroundColor: '#eeeeee', borderRadius: 4, animation: 'demoShimmer 1.5s ease-in-out infinite', animationDelay: '0.4s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Demo Flow: Provider Detail Page ─────────────────────────

interface ProcedureItem {
  name: string
  description: string
  beforeInsurance: string
  oopCost: string | null
  oopExplanation: string | null
  isSearched: boolean
}

function buildDemoProcedures(provider: Provider, searchQuery = 'MRI scan'): ProcedureItem[] {
  const oopNum = parseDollar(provider.cost)
  const beforeIns = Math.round(oopNum * 2.5 / 10) * 10 // ~2.5x multiplier, rounded
  const fmtD = (n: number) => '$' + n.toLocaleString('en-US')

  if (searchQuery.toLowerCase().includes('orthopedist')) {
    return [
      { name: 'Office visit — Orthopedist', description: 'Initial or follow-up consultation with an orthopedic specialist.', beforeInsurance: fmtD(250), oopCost: '$45', oopExplanation: "Copay", isSearched: true },
      { name: 'X-ray, knee', description: 'Diagnostic X-ray imaging of the knee joint.', beforeInsurance: fmtD(180), oopCost: '$72', oopExplanation: "You'll pay 40% coinsurance after deductible", isSearched: false },
      { name: 'Joint injection', description: 'Corticosteroid or hyaluronic acid injection for joint pain relief.', beforeInsurance: fmtD(350), oopCost: '$140', oopExplanation: "You'll pay 40% coinsurance after deductible", isSearched: false },
      { name: 'Physical therapy evaluation', description: 'Initial evaluation for a physical therapy treatment plan.', beforeInsurance: fmtD(300), oopCost: '$45', oopExplanation: "Copay — same as office visit", isSearched: false },
    ]
  }

  if (searchQuery.toLowerCase().includes('retinal')) {
    return [
      { name: 'Retinal imaging', description: 'High-resolution imaging of the retina to detect conditions such as macular degeneration.', beforeInsurance: fmtD(beforeIns), oopCost: provider.cost, oopExplanation: "You'll pay 40% of the service price", isSearched: true },
      { name: 'OCT scan', description: 'Optical coherence tomography of the retina for cross-sectional imaging.', beforeInsurance: fmtD(Math.round(beforeIns * 1.4 / 10) * 10), oopCost: fmtD(Math.round(oopNum * 1.5 / 10) * 10), oopExplanation: "You'll pay 40% of the service price", isSearched: false },
      { name: 'Visual field test', description: 'Automated perimetry to assess peripheral vision loss.', beforeInsurance: fmtD(Math.round(beforeIns * 0.6 / 10) * 10), oopCost: fmtD(Math.round(oopNum * 0.55 / 10) * 10), oopExplanation: "You'll pay 40% of the service price", isSearched: false },
      { name: 'Fundus photography', description: 'Detailed photograph of the back of the eye for diagnostic review.', beforeInsurance: fmtD(Math.round(beforeIns * 1.8 / 10) * 10), oopCost: null, oopExplanation: 'Not available. Cost depends on your plan details.', isSearched: false },
    ]
  }

  // Default: MRI procedures
  return [
    { name: 'MRI scan', description: 'Magnetic resonance imaging of the brain without contrast.', beforeInsurance: fmtD(beforeIns), oopCost: provider.cost, oopExplanation: "You'll pay $45 copay plus 40% of the service price", isSearched: true },
    { name: 'MRI, lumbar spine', description: 'MRI of the lower back to evaluate spinal conditions.', beforeInsurance: fmtD(Math.round(beforeIns * 1.5 / 10) * 10), oopCost: fmtD(Math.round(oopNum * 1.6 / 10) * 10), oopExplanation: "You'll pay $45 copay plus 40% of the service price", isSearched: false },
    { name: 'MRI, knee', description: 'MRI of the knee joint to assess ligament or cartilage issues.', beforeInsurance: fmtD(Math.round(beforeIns * 0.75 / 10) * 10), oopCost: fmtD(Math.round(oopNum * 0.7 / 10) * 10), oopExplanation: "You'll pay a $45 copay plus 30% of your remaining deductible", isSearched: false },
    { name: 'MRI, with contrast', description: 'MRI with gadolinium contrast for enhanced imaging detail.', beforeInsurance: fmtD(Math.round(beforeIns * 1.9 / 10) * 10), oopCost: null, oopExplanation: 'Not available. Cost depends on your plan details.', isSearched: false },
  ]
}

const PROVIDER_DETAIL_TABS = ['Info', 'Locations & costs', 'Reviews', 'Similar providers']

function DemoProviderDetailPage({ provider, onBack, searchQuery }: { provider: Provider; onBack: () => void; searchQuery?: string }) {
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: BG_WHITE, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      {/* Status Bar */}
      <div style={{ height: 54, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 15, color: TEXT_DEFAULT }}>9:41</span>
      </div>

      {/* Top nav: back + bookmark */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${SPACE_XXS}px ${SPACE_S}px`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <ChevronLeftIcon size="md" color={TEXT_DEFAULT} />
        </button>
        <button onClick={() => setBookmarked(!bookmarked)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          {bookmarked ? <BookmarkSolidIcon size="md" color={PRIMARY_TEXT} /> : <BookmarkLineIcon size="md" color={TEXT_DEFAULT} />}
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* Provider header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${SPACE_XXS}px ${SPACE_S}px ${SPACE_S}px` }}>
          {/* Avatar */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%', overflow: 'hidden',
            backgroundColor: BG_EXTRA_SUBTLE, flexShrink: 0, marginBottom: SPACE_XS,
          }}>
            <img src={provider.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>

          {/* Name */}
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 24, lineHeight: '29px',
            color: TEXT_DEFAULT, margin: 0, textAlign: 'center',
          }}>
            {provider.name}
          </h2>

          {/* Specialty */}
          <p style={{
            fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, lineHeight: '19px',
            color: TEXT_DARK, margin: `${SPACE_XXXS}px 0 0`,
          }}>
            {provider.specialty}
          </p>

          {/* In-network badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: SPACE_XXS,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: SUCCESS_DEFAULT }} />
            <span style={{ fontFamily: FONT, fontSize: 16, color: TEXT_DEFAULT }}>{provider.networkLabel}</span>
          </div>
        </div>

        {/* Details row */}
        <div style={{ padding: `0 ${SPACE_S}px ${SPACE_XS}px`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StarLineIcon size="sm" color={TEXT_LIGHT} />
            <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>{provider.rating}/5 ({provider.reviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <LocationIcon size="sm" color={TEXT_LIGHT} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>{provider.distance} · {provider.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <VideoCameraIcon size="sm" color={TEXT_LIGHT} />
            <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>Virtual appointment</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 0, padding: `${SPACE_S}px ${SPACE_S}px 0`,
          borderBottom: `1px solid ${BORDER_LIGHT}`, flexShrink: 0, overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {PROVIDER_DETAIL_TABS.map(tab => {
            const isActive = tab === 'Locations & costs'
            return (
              <div key={tab} style={{
                padding: '8px 12px',
                borderRadius: `${RADIUS_XXS}px ${RADIUS_XXS}px 0 0`,
                backgroundColor: isActive ? TEXT_DEFAULT : 'transparent',
                color: isActive ? BG_WHITE : TEXT_DARK,
                fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 14,
                whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
              }}>
                {tab}
              </div>
            )
          })}
        </div>

        {/* Locations & Costs content */}
        <div style={{ padding: `${SPACE_S}px 0` }}>
          {/* Section heading */}
          <h3 style={{
            fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 24, lineHeight: '29px',
            color: TEXT_DEFAULT, margin: 0, padding: `0 ${SPACE_S}px ${SPACE_S}px`,
          }}>
            Locations & Costs (2)
          </h3>

          {/* Map placeholder */}
          <div style={{
            margin: `0 ${SPACE_S}px ${SPACE_S}px`,
            height: 160, borderRadius: RADIUS_XXS, backgroundColor: '#e8e8e8',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Simplified map pins */}
            {[[120, 70], [220, 90]].map(([x, y], i) => (
              <div key={i} style={{
                position: 'absolute', left: x, top: y,
                width: 24, height: 24, borderRadius: '50% 50% 50% 0',
                backgroundColor: PRIMARY_TEXT, transform: 'rotate(-45deg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: BG_WHITE, transform: 'rotate(45deg)' }} />
              </div>
            ))}
          </div>

          {/* Location address block */}
          <div style={{ padding: `0 ${SPACE_S}px ${SPACE_XS}px` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 14, color: TEXT_DEFAULT, flex: 1 }}>
                {provider.address}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: SUCCESS_DEFAULT }} />
                <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>In-network</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <PhoneIcon size="sm" color={PRIMARY_TEXT} />
              <span style={{ fontFamily: FONT, fontSize: 14, color: PRIMARY_TEXT }}>+1 555-757-9011</span>
            </div>
          </div>

          {/* Procedures heading */}
          <div style={{ padding: `${SPACE_S}px ${SPACE_S}px ${SPACE_XXS}px`, borderTop: `1px solid ${BORDER_LIGHT}` }}>
            <h4 style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 20, lineHeight: '24px', color: TEXT_DEFAULT, margin: 0 }}>
              Procedures for this location
            </h4>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: '19px', color: TEXT_DARK, margin: `${SPACE_XXS}px 0 0` }}>
              Procedure availability may vary by location. Call ahead to confirm what's offered at this site.
            </p>
          </div>

          {/* Procedure cards */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {buildDemoProcedures(provider, searchQuery).map((proc, idx) => (
              <div key={idx} style={{
                padding: `${SPACE_M}px ${SPACE_S}px`,
                borderTop: `1px solid ${BORDER_LIGHT}`,
                ...(proc.isSearched ? {
                  borderLeft: `3px solid ${PRIMARY_TEXT}`,
                  backgroundColor: 'rgba(253, 82, 1, 0.04)',
                } : {}),
              }}>
                {/* Procedure name + searched badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 18, lineHeight: '22px', color: TEXT_DEFAULT }}>
                    {proc.name}
                  </span>
                  {proc.isSearched && (
                    <span style={{
                      fontFamily: FONT, fontSize: 11, fontWeight: W_MEDIUM,
                      color: PRIMARY_TEXT, backgroundColor: 'rgba(253, 82, 1, 0.1)',
                      padding: '2px 8px', borderRadius: RADIUS_FULL,
                    }}>
                      Searched
                    </span>
                  )}
                </div>

                {/* Description */}
                <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: '19px', color: TEXT_DARK, margin: `0 0 ${SPACE_S}px` }}>
                  {proc.description}
                </p>

                {/* Two-column pricing */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACE_S }}>
                  {/* Before insurance */}
                  <div>
                    <div style={{ marginBottom: SPACE_XXS }}>
                      <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 16, lineHeight: '19px', color: TEXT_DARK }}>
                        Before insurance
                      </span>
                    </div>
                    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 20, lineHeight: '24px', color: TEXT_DEFAULT }}>
                      {proc.beforeInsurance}
                    </span>
                  </div>

                  {/* Est. out-of-pocket */}
                  <div>
                    <div style={{ marginBottom: SPACE_XXS }}>
                      <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 16, lineHeight: '19px', color: TEXT_DARK }}>
                        Est. out-of-pocket-cost
                      </span>
                    </div>
                    {proc.oopCost ? (
                      <>
                        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 20, lineHeight: '24px', color: TEXT_DEFAULT }}>
                          {proc.oopCost}
                        </span>
                        {proc.oopExplanation && (
                          <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: '19px', color: TEXT_DEFAULT, margin: `${SPACE_XXS}px 0 0` }}>
                            {proc.oopExplanation}
                          </p>
                        )}
                      </>
                    ) : (
                      <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: '19px', color: TEXT_DEFAULT, margin: 0 }}>
                        {proc.oopExplanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search all procedures */}
          <div style={{
            margin: `${SPACE_XS}px ${SPACE_S}px ${SPACE_S}px`,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', border: `1px solid ${BORDER_STRONG}`,
            borderRadius: RADIUS_FULL, cursor: 'pointer',
          }}>
            <SearchIcon size="sm" color={TEXT_LIGHT} />
            <span style={{ fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 14, color: TEXT_DARK }}>
              Search all procedures (11)
            </span>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div style={{
        flexShrink: 0, borderTop: `1px solid ${BORDER_LIGHT}`,
        padding: `${SPACE_XXS}px ${SPACE_S}px ${SPACE_L}px`,
        backgroundColor: BG_WHITE,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: SPACE_XXS }}>
          <CalendarIcon size="sm" color={TEXT_DEFAULT} />
          <span style={{ fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT }}>
            Next available appointment <strong>{provider.nextApptDate}</strong>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACE_XXS }}>
          <Button variant="outline" size="md" fullWidth iconLeft={<PhoneIcon size="sm" />}>Call</Button>
          <Button variant="secondary" size="md" fullWidth>Book</Button>
        </div>
      </div>
    </div>
  )
}

// ── Price Bar Explorer ──────────────────────────────────────

const BAR_EXPLORER_VARIANTS = [
  { position: 1,  lo: '$100',    hi: '$400',    min: '$100',   max: '$22,200' },
  { position: 2,  lo: '$2,400',  hi: '$3,800',  min: '$100',   max: '$22,200' },
  { position: 3,  lo: '$4,600',  hi: '$6,200',  min: '$100',   max: '$22,200' },
  { position: 4,  lo: '$7,000',  hi: '$8,600',  min: '$100',   max: '$22,200' },
  { position: 5,  lo: '$9,500',  hi: '$11,200', min: '$100',   max: '$22,200' },
  { position: 6,  lo: '$11,800', hi: '$13,400', min: '$100',   max: '$22,200' },
  { position: 7,  lo: '$14,000', hi: '$15,800', min: '$100',   max: '$22,200' },
  { position: 8,  lo: '$16,200', hi: '$17,800', min: '$100',   max: '$22,200' },
  { position: 9,  lo: '$18,500', hi: '$20,000', min: '$100',   max: '$22,200' },
  { position: 10, lo: '$20,800', hi: '$22,200', min: '$100',   max: '$22,200' },
]

function calcBarLeftFraction(v: typeof BAR_EXPLORER_VARIANTS[0]): number {
  // Use the predefined position directly: position 1 = 0.0 (far left), 10 = 1.0 (far right)
  return (v.position - 1) / 9
}

/**
 * calcPriceBarPosition — Determines which of 10 fixed positions the blue segment should occupy.
 *
 * HOW IT WORKS:
 * 1. The bar is divided into 10 equal visual positions (1 = far left, 5 = center, 10 = far right)
 * 2. The midpoint of the blue range (lo+hi)/2 is calculated
 * 3. That midpoint is mapped linearly to the min–max scale and snapped to 1 of 10 positions
 * 4. Returns { position (1–10), leftFraction (0–1) } for use with PriceRangeBarV2
 *
 * USAGE:
 *   const { leftFraction } = calcPriceBarPosition(1400, 2200, 100, 22200)
 *   <PriceRangeBarV2 leftFraction={leftFraction} min="$100" max="$22,200" />
 *
 * FADE LOGIC (handled by PriceRangeBarV2):
 *   - Positions 1–3 (left side): right grey fades out
 *   - Positions 4–7 (center): both sides fade out
 *   - Positions 8–10 (right side): left grey fades out
 */
function calcPriceBarPosition(lo: number, hi: number, min: number, max: number): { position: number; leftFraction: number } {
  const midpoint = (lo + hi) / 2
  const raw = (midpoint - min) / (max - min)
  const position = Math.max(1, Math.min(10, Math.round(raw * 9 + 1)))
  const leftFraction = (position - 1) / 9
  return { position, leftFraction }
}

// V2 Bar matching Figma design: flex layout, solid left grey, gradient right grey, fixed pill
function PriceRangeBarV2({ leftFraction, min, max }: { leftFraction: number; min: string; max: string }) {
  // leftFraction: 0–1, determines how far right the pill sits
  // Pill width is fixed at 65px (from Figma), left grey fills proportionally
  const PILL_W = 65
  const leftFlexGrow = leftFraction
  const rightFlexGrow = Math.max(0, 1 - leftFraction)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Bar row */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center', overflow: 'clip' }}>
        {/* Left grey — fade only when pill is right or center */}
        {leftFraction > 0 && (
          <div style={{
            flexGrow: leftFlexGrow, height: 10, flexShrink: 0, minWidth: leftFraction > 0 ? 4 : 0,
            background: leftFraction > 0.65 || (leftFraction >= 0.35 && leftFraction <= 0.65)
              ? 'linear-gradient(to right, rgba(255,255,255,0) 0%, #e4e4e4 86%, #e4e4e4 100%)'
              : '#e4e4e4',
          }} />
        )}
        {/* Blue segment */}
        <div style={{ width: PILL_W, height: 14, backgroundColor: '#245eff', borderRadius: 0, flexShrink: 0 }} />
        {/* Right grey — fade only when pill is left or center; hidden at far right */}
        {rightFlexGrow > 0 && (
          <div style={{
            flexGrow: rightFlexGrow, height: 10, minWidth: 4, flexShrink: 0,
            background: leftFraction < 0.35 || (leftFraction >= 0.35 && leftFraction <= 0.65)
              ? 'linear-gradient(to right, #e4e4e4 0%, #e4e4e4 14%, rgba(255,255,255,0) 100%)'
              : '#e4e4e4',
          }} />
        )}
      </div>
      {/* Min/Max labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: FONT, fontSize: 12, color: '#949494' }}>{min}</span>
        <span style={{ fontFamily: FONT, fontSize: 12, color: '#949494' }}>{max}</span>
      </div>
    </div>
  )
}

function PriceBarExplorer({ onClose, bannerCopy }: { onClose: () => void; bannerCopy: BannerCopyEntry[] }) {
  const [selected, setSelected] = useState(5)
  const [docOpen, setDocOpen] = useState(false)
  const selectedVariant = BAR_EXPLORER_VARIANTS.find(v => v.position === selected)!

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#ffffff',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: `1px solid ${BORDER_LIGHT}`,
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 24, color: TEXT_DEFAULT }}>
            Price Range Bar V2
          </h1>
          <p style={{ margin: '4px 0 0', fontFamily: FONT, fontSize: 14, color: TEXT_DARK }}>
            Fixed-size pill · 10 positions · Click a variant to preview in phone
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: '50%', border: `1px solid ${BORDER_LIGHT}`,
            backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, color: TEXT_DARK, fontFamily: FONT,
          }}
        >
          ✕
        </button>
      </div>

      {/* Split layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: variant cards */}
        <div style={{ width: 420, flexShrink: 0, overflow: 'auto', padding: '24px 20px', borderRight: `1px solid ${BORDER_LIGHT}` }}>
          {/* Developer Documentation — Accordion */}
          <div style={{
            marginBottom: 20, padding: '16px 20px', borderRadius: 16,
            border: `1px solid ${BORDER_LIGHT}`, backgroundColor: '#f9fafb',
          }}>
            <div
              onClick={() => setDocOpen(!docOpen)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', userSelect: 'none' as const,
              }}
            >
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: W_MEDIUM, color: TEXT_DEFAULT, textTransform: 'uppercase' as const, letterSpacing: '0.8px' }}>
                How it works — Developer Reference
              </div>
              <span style={{ fontSize: 14, color: TEXT_DARK, transition: 'transform 0.2s', transform: docOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
            </div>
            {docOpen && (
              <div style={{ fontFamily: FONT, fontSize: 13, lineHeight: '20px', color: TEXT_DARK, marginTop: 16 }}>
                <p style={{ margin: '0 0 8px' }}><strong>10 fixed positions</strong> — The bar has 10 visual slots. Position 1 = far left, position 5 = center, position 10 = far right. The blue segment is always 65px wide.</p>
                <p style={{ margin: '0 0 8px' }}><strong>Position selection</strong> — Use <code style={{ backgroundColor: '#e8e8e8', padding: '1px 4px', borderRadius: 4, fontSize: 12 }}>calcPriceBarPosition(lo, hi, min, max)</code> to compute the position. It calculates the midpoint of the blue range, maps it linearly across the min–max span, and snaps to the nearest of 10 positions.</p>
                <p style={{ margin: '0 0 8px' }}><strong>Fade logic</strong> — The grey bar fades out on the longer side. Left positions (1–3): right side fades. Center (4–7): both sides fade. Right (8–10): left side fades.</p>
                <p style={{ margin: '0 0 8px' }}><strong>Usage:</strong></p>
                <pre style={{ backgroundColor: '#e8e8e8', padding: 12, borderRadius: 8, fontSize: 11, lineHeight: '16px', overflow: 'auto', margin: 0 }}>{`const { leftFraction } = calcPriceBarPosition(
  1400, 2200,  // blue range (lo, hi)
  100, 22200   // full range (min, max)
)

<PriceRangeBarV2
  leftFraction={leftFraction}
  min="$100"
  max="$22,200"
/>`}</pre>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {BAR_EXPLORER_VARIANTS.map((v) => {
              const isSelected = v.position === selected
              const leftFraction = calcBarLeftFraction(v)
              return (
                <div
                  key={v.position}
                  onClick={() => setSelected(v.position)}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    border: isSelected ? `2px solid ${BLUE_SELECTED}` : `1px solid ${BORDER_LIGHT}`,
                    backgroundColor: isSelected ? '#f8f9ff' : BG_EXTRA_SUBTLE,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Position label */}
                  <div style={{
                    fontFamily: FONT, fontSize: 11, fontWeight: W_MEDIUM,
                    color: isSelected ? BLUE_TEXT_DARK : TEXT_DARK,
                    textTransform: 'uppercase' as const, letterSpacing: '0.8px', marginBottom: 8,
                  }}>
                    Position {v.position}/10
                  </div>

                  {/* Headline */}
                  <p style={{ margin: '0 0 12px', fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 16, lineHeight: '20px', color: TEXT_DEFAULT }}>
                    Most people pay{' '}
                    <span style={{ color: BLUE_TEXT_DARK }}>{v.lo}–{v.hi}</span>
                    {' '}for this service in this area
                  </p>

                  {/* V2 Bar */}
                  <PriceRangeBarV2 leftFraction={leftFraction} min={v.min} max={v.max} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: iPhone preview with real ScreenContent */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#f5f5f5', overflow: 'auto', padding: 24,
        }}>
          <div style={{ transform: 'scale(0.82)', transformOrigin: 'center center' }}>
            <IPhoneFrame>
              <ScreenContent
                config={USE_CASES[0]}
                subVariant="a"
                bannerCopy={bannerCopy.map(entry =>
                  entry.network === 'single' && entry.plan === 'connected' && entry.variant === 'coinsurance'
                    ? { ...entry, headline: `Most people pay ${selectedVariant.lo}–${selectedVariant.hi} for this service in this area` }
                    : entry
                )}
                usePriceBarV2={{
                  leftFraction: calcBarLeftFraction(selectedVariant),
                  min: selectedVariant.min,
                  max: selectedVariant.max,
                }}
              />
            </IPhoneFrame>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Demo Flow: Main Wrapper ─────────────────────────────────

type DemoStep = 'search' | 'loading' | 'results' | 'provider-detail'

function DemoFlow({ onClose }: { onClose: () => void }) {
  const [scenarioIdx, setScenarioIdx] = useState(1) // default to Scenario 2
  const [step, setStep] = useState<DemoStep>('search')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)

  const activeScenario = DEMO_SCENARIOS[scenarioIdx]
  const isPlaceholder = activeScenario.providers.length === 0

  const handleSelectScenario = useCallback((idx: number) => {
    setScenarioIdx(idx)
    setStep('search')
    setSearchTerm('')
    setSelectedProvider(null)
  }, [])

  const handleSelect = useCallback((term: string) => {
    setSearchTerm(term)
    setStep('loading')
  }, [])

  // 2s loading timer
  useEffect(() => {
    if (step !== 'loading') return
    const timer = setTimeout(() => setStep('results'), 2000)
    return () => clearTimeout(timer)
  }, [step])

  const handleProviderClick = useCallback((provider: Provider) => {
    setSelectedProvider(provider)
    setStep('provider-detail')
  }, [])

  const handleBack = useCallback(() => {
    if (step === 'provider-detail') { setStep('results'); setSelectedProvider(null) }
    else if (step === 'results') { setStep('search'); setSearchTerm('') }
    else if (step === 'loading') { setStep('search'); setSearchTerm('') }
    else onClose()
  }, [step, onClose])

  // Build config from active scenario
  const config: UseCaseConfig = {
    ...DEMO_MAMMOGRAPHY_CONFIG,
    searchQuery: activeScenario.searchQuery || 'Mammography',
    resultCount: activeScenario.resultCount || '0 results',
    providers: activeScenario.providers,
    ...(activeScenario.variant === 'copay' ? {
      bannerType: 'copay' as BannerType,
      showCostChips: false,
    } : {}),
  }

  const scenarioBannerCopy: BannerCopyEntry[] = activeScenario.headline
    ? INITIAL_BANNER_COPY.map(entry => {
        if (entry.network === 'single' && entry.plan === 'connected') {
          if (entry.variant === 'coinsurance' && activeScenario.variant !== 'copay') {
            return { ...entry, headline: activeScenario.headline }
          }
          if (entry.variant === 'copay' && activeScenario.variant === 'copay') {
            return { ...entry, headline: activeScenario.headline }
          }
        }
        return entry
      })
    : DEMO_BANNER_COPY

  const scenarioPriceBarV2 = activeScenario.priceBar.max > 0
    ? {
        leftFraction: activeScenario.priceBar.position != null
          ? (activeScenario.priceBar.position - 1) / 9
          : calcPriceBarPosition(
              activeScenario.priceBar.lo, activeScenario.priceBar.hi,
              activeScenario.priceBar.min, activeScenario.priceBar.max
            ).leftFraction,
        min: activeScenario.priceBar.minLabel,
        max: activeScenario.priceBar.maxLabel,
      }
    : undefined

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      overflow: 'hidden',
    }}>
      {/* Left: Flow info + controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 300 }}>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: W_MEDIUM,
            color: '#666666',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ChevronSmallLeftIcon size="sm" />
          Back to gallery
        </button>

        <h2 style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: W_MEDIUM,
          fontSize: 26,
          lineHeight: '32px',
          color: '#000000',
          margin: 0,
          letterSpacing: '-0.3px',
        }}>
          Interactive Demo
        </h2>

        {/* Scenario selector */}
        <div style={{ display: 'flex', gap: 8 }}>
          {DEMO_SCENARIOS.map((s, idx) => {
            const isActive = idx === scenarioIdx
            return (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(idx)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: W_MEDIUM,
                  color: isActive ? '#ffffff' : TEXT_DARK,
                  backgroundColor: isActive ? '#000000' : '#ffffff',
                  border: `1px solid ${isActive ? '#000000' : BORDER_LIGHT}`,
                  borderRadius: 999,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Scenario-specific info */}
        <div>
          <h3 style={{
            fontFamily: FONT,
            fontWeight: W_MEDIUM,
            fontSize: 18,
            lineHeight: '24px',
            color: TEXT_DEFAULT,
            margin: 0,
          }}>
            {activeScenario.title}
          </h3>
          <p style={{
            fontFamily: FONT,
            fontWeight: W_REGULAR,
            fontSize: 14,
            lineHeight: '21px',
            color: TEXT_LIGHT,
            marginTop: 8,
            marginBottom: 0,
          }}>
            {activeScenario.desc}
          </p>
        </div>

        {/* Action buttons */}
        {step !== 'search' && (
          <button
            onClick={handleBack}
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: W_MEDIUM,
              color: PRIMARY_TEXT,
              backgroundColor: 'transparent',
              border: `1px solid ${PRIMARY_TEXT}`,
              borderRadius: RADIUS_XXS,
              padding: '8px 16px',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            ← Restart flow
          </button>
        )}
      </div>

      {/* Right: iPhone Frame */}
      <div style={{
        width: (IPHONE_WIDTH + BEZEL * 2) * 0.82,
        height: (IPHONE_HEIGHT + BEZEL * 2) * 0.82,
        flexShrink: 0,
        position: 'relative',
      }}>
        <div style={{
          transform: 'scale(0.82)',
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
          <IPhoneFrame>
            {isPlaceholder ? (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT,
                fontSize: 16,
                color: TEXT_DARK,
                padding: 32,
                textAlign: 'center' as const,
              }}>
                Coming soon — select Scenario 2 to see the demo
              </div>
            ) : (
              <>
                {step === 'search' && (
                  <DemoSearchScreen onSelect={handleSelect} />
                )}
                {step === 'loading' && (
                  <DemoLoadingScreen searchTerm={searchTerm} />
                )}
                {step === 'results' && (
                  <ScreenContent
                    key="demo-results"
                    config={config}
                    subVariant="a"
                    selectedProcedure={null}
                    onSelectProcedure={() => {}}
                    onOpenModal={() => {}}
                    isLoading={false}
                    multiNetwork={false}
                    bannerCopy={scenarioBannerCopy}
                    onProviderClick={handleProviderClick}
                    usePriceBarV2={scenarioPriceBarV2}
                  />
                )}
              </>
            )}
            {step === 'provider-detail' && selectedProvider && (
              <DemoProviderDetailPage provider={selectedProvider} onBack={handleBack} searchQuery={activeScenario.searchQuery} />
            )}
          </IPhoneFrame>
        </div>
      </div>
    </div>
  )
}

// ── Gallery Page ────────────────────────────────────────────

export function SearchResultsPage() {
  const [networkType, setNetworkType] = useState<NetworkType>('single')
  const [activeCase, setActiveCase] = useState<PlanType>('connected')
  const [activeSubVariant, setActiveSubVariant] = useState<string>('a')
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCopyRef, setShowCopyRef] = useState(false)
  const [bannerCopy, setBannerCopy] = useState<BannerCopyEntry[]>(INITIAL_BANNER_COPY)
  const [showDemoFlow, setShowDemoFlow] = useState(false)
  const [showBarExplorer, setShowBarExplorer] = useState(false)
  const useCases = networkType === 'single' ? USE_CASES : MULTI_NETWORK_USE_CASES
  const config = useCases.find(c => c.id === activeCase)!

  // Auto loading → modal flow for variant A (procedure-selection)
  useEffect(() => {
    const isProcedureFlow =
      (activeCase === 'connected' && activeSubVariant === 'c') ||
      (activeCase === 'not-connected' && activeSubVariant === 'c')
    if (isProcedureFlow && !selectedProcedure) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
        setShowModal(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [activeCase, activeSubVariant, selectedProcedure, networkType])

  const hasSubVariants = config.subVariants && config.subVariants.length > 0
  const activeSub = hasSubVariants
    ? config.subVariants!.find(s => s.id === activeSubVariant) || config.subVariants![0]
    : null

  const resetSelection = () => { setSelectedProcedure(null); setShowModal(false); setIsLoading(false) }
  const switchNetwork = (id: NetworkType) => { setNetworkType(id); setActiveCase('connected'); setActiveSubVariant('a'); resetSelection() }
  const switchCase = (id: PlanType) => { setActiveCase(id); setActiveSubVariant('a'); resetSelection() }
  const switchSub = (id: string) => { setActiveSubVariant(id); resetSelection() }

  // Demo Flow mode
  if (showDemoFlow) {
    return <DemoFlow onClose={() => setShowDemoFlow(false)} />
  }

  // Price Bar Explorer mode
  if (showBarExplorer) {
    return <PriceBarExplorer onClose={() => setShowBarExplorer(false)} bannerCopy={bannerCopy} />
  }

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #d5d5d5',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar header */}
        <div style={{ padding: '20px 16px 16px', flexShrink: 0 }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: W_MEDIUM,
            fontSize: 15,
            color: '#000000',
            margin: 0,
            letterSpacing: '-0.1px',
          }}>
            Cost Box Gallery
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflow: 'auto', padding: '0 8px 16px' }}>
          {/* Network type sections */}
          {([
            { id: 'single' as NetworkType, label: 'Single Network' },
            { id: 'multi' as NetworkType, label: 'Multi Network' },
          ]).map((nt) => {
            const isNetworkActive = nt.id === networkType
            const cases = nt.id === 'single' ? USE_CASES : MULTI_NETWORK_USE_CASES
            return (
              <div key={nt.id} style={{ marginBottom: 8 }}>
                {/* Network header */}
                <button
                  onClick={() => switchNetwork(nt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    textAlign: 'left',
                    fontFamily: FONT,
                    fontWeight: W_MEDIUM,
                    fontSize: 11,
                    color: isNetworkActive ? '#000000' : '#666666',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '12px 12px 6px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: isNetworkActive ? PRIMARY_TEXT : '#d5d5d5',
                    flexShrink: 0,
                  }} />
                  {nt.label}
                </button>

                {/* Plan types under this network */}
                {isNetworkActive && cases.map((uc) => {
                  const isCaseActive = uc.id === activeCase
                  const caseSubVariants = uc.subVariants || []
                  return (
                    <div key={uc.id}>
                      <SidebarNavItem
                        label={uc.tabLabel}
                        isActive={isCaseActive && !hasSubVariants}
                        indent
                        onClick={() => switchCase(uc.id)}
                        badge={caseSubVariants.length > 0 ? `${caseSubVariants.length}` : undefined}
                      />
                      {/* Sub-variants */}
                      {isCaseActive && caseSubVariants.length > 0 && (
                        <div style={{ paddingLeft: 20 }}>
                          {caseSubVariants.map((sv) => (
                            <SidebarNavItem
                              key={sv.id}
                              label={sv.subtitle}
                              isActive={sv.id === activeSubVariant}
                              indent
                              onClick={() => switchSub(sv.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div style={{
          padding: '12px 8px',
          borderTop: '1px solid #d5d5d5',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <button
            onClick={() => setShowDemoFlow(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              fontFamily: FONT,
              fontWeight: W_MEDIUM,
              fontSize: 12,
              color: '#ffffff',
              backgroundColor: PRIMARY_TEXT,
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: 14 }}>▶</span>
            Interactive Demo
          </button>
          <button
            onClick={() => setShowCopyRef(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              fontFamily: FONT,
              fontWeight: W_MEDIUM,
              fontSize: 12,
              color: '#666666',
              backgroundColor: '#f5f5f5',
              border: '1px solid #d5d5d5',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: 14 }}>📋</span>
            Copy reference
          </button>
          <button
            onClick={() => setShowBarExplorer(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              fontFamily: FONT,
              fontWeight: W_MEDIUM,
              fontSize: 12,
              color: '#666666',
              backgroundColor: '#f5f5f5',
              border: '1px solid #d5d5d5',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: 14 }}>📊</span>
            Price Bar Explorer
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          padding: '24px 40px',
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        {/* Left: Description */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 340 }}>
          {/* Breadcrumb */}
          <div style={{
            fontFamily: FONT,
            fontSize: 12,
            color: '#666666',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
          }}>
            <span>{networkType === 'single' ? 'Single Network' : 'Multi Network'}</span>
            <span style={{ color: '#d5d5d5' }}>/</span>
            <span>{config.tabLabel}</span>
            {activeSub && (
              <>
                <span style={{ color: '#d5d5d5' }}>/</span>
                <span style={{ color: '#666666' }}>{activeSub.subtitle}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: W_MEDIUM,
            fontSize: 26,
            lineHeight: '32px',
            color: '#000000',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            {activeSub ? activeSub.subtitle : config.title}
          </h2>

          {/* Description */}
          <p style={{
            fontFamily: FONT,
            fontWeight: W_REGULAR,
            fontSize: 15,
            lineHeight: '23px',
            color: '#666666',
            marginTop: 16,
            marginBottom: 0,
          }}>
            {activeSub ? activeSub.description : config.description}
          </p>

          {/* Highlights */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(activeSub ? activeSub.highlights : config.highlights).map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: PRIMARY_TEXT, fontSize: 7, lineHeight: '21px', flexShrink: 0 }}>●</span>
                <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '21px', color: '#666666' }}>
                  {h}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: iPhone Frame — scaled to fit */}
        <div style={{
          width: (IPHONE_WIDTH + BEZEL * 2) * 0.78,
          height: (IPHONE_HEIGHT + BEZEL * 2) * 0.78,
          flexShrink: 0,
          position: 'relative',
        }}>
        <div style={{
          transform: 'scale(0.78)',
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
          <IPhoneFrame
            overlay={
              showModal && ((config.id === 'connected' && activeSubVariant === 'c') || (config.id === 'not-connected' && activeSubVariant === 'c')) ? (
                <ProcedureModal
                  onSelect={(value) => {
                    setSelectedProcedure(value)
                    setShowModal(false)
                  }}
                  onClose={() => setShowModal(false)}
                  showPrices={config.id !== 'not-connected'}
                />
              ) : undefined
            }
          >
            <ScreenContent
              key={`${networkType}-${config.id}-${activeSubVariant}`}
              config={config}
              subVariant={activeSubVariant}
              selectedProcedure={selectedProcedure}
              onSelectProcedure={setSelectedProcedure}
              onOpenModal={() => setShowModal(true)}
              isLoading={isLoading}
              multiNetwork={networkType === 'multi'}
              bannerCopy={bannerCopy}
            />
          </IPhoneFrame>
        </div>
        </div>
      </main>

      {showCopyRef && <CopyReferenceModal onClose={() => setShowCopyRef(false)} bannerCopy={bannerCopy} setBannerCopy={setBannerCopy} />}
    </div>
  )
}
