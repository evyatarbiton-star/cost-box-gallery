import { useState, useEffect } from 'react'
import { Button, TextInput } from 'glow-ds/components'
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
import ArrowDownLeftCrFrIcon from '@glow-icons/icons/solid/ArrowDownLeftCrFr'
import ArrowUpRightCrFrIcon from '@glow-icons/icons/solid/ArrowUpRightCrFr'

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

// ── Network tier colors ─────────────────────────────────────
const TIER_COLORS = {
  'in-network': { back: '#C2E5C3', front: '#5BB95E' },
  'tier-2': { back: '#FFE78F', front: '#F5C000' },
  'tier-3': { back: '#E0D4F5', front: '#9B7ED8' },
  'out-of-network': { back: '#FAB3B3', front: '#F23C3C' },
} as const

// ── Custom Icons (not available in DS) ──────────────────────

const COIN_PATH = 'M0 5.96C0 9.25 2.67 11.92 5.96 11.92C9.25 11.92 11.92 9.25 11.92 5.96C11.92 2.67 9.25 0 5.96 0C2.67 0 0 2.67 0 5.96Z'

function CoinIcon({ backColor, frontColor }: { backColor: string; frontColor: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <g transform="translate(2.5, 1.1)">
        <path d={COIN_PATH} fill={backColor} />
      </g>
      <g transform="translate(5.6, 6.7)">
        <path d={COIN_PATH} fill={frontColor} />
      </g>
    </svg>
  )
}

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
  networkKey: keyof typeof TIER_COLORS
  networkName: string
  networkLabel: string
  cost: string
  costLevel: CostLevel
  nextApptLabel: string
  nextApptDate: string
  photo: string
  initials: string
}

const COST_CHIP_CONFIG: Record<CostLevel, { label: string; bg: string; color: string; Icon: typeof ArrowDownLeftCrFrIcon | null }> = {
  lower:   { label: 'Lower cost',   bg: SUCCESS_SUBTLE,  color: SUCCESS_TEXT_DARK, Icon: ArrowDownLeftCrFrIcon },
  typical: { label: 'Typical cost',  bg: BLUE_SUBTLE,     color: BLUE_TEXT_DARK,    Icon: null },
  higher:  { label: 'Higher cost',   bg: ERROR_SUBTLE,    color: ERROR_TEXT_DARK,   Icon: ArrowUpRightCrFrIcon },
}

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
    headline: 'Most providers in this area charge $1,400–$2,200' },
  { network: 'single', plan: 'connected', variant: 'copay',
    headline: 'You\'ll pay $50 per visit' },
  { network: 'single', plan: 'connected', variant: 'procedure-before',
    headline: 'Choose your MRI type to see exact prices',
    subtitle: 'Your plan covers 40% coinsurance for MRI procedures. Prices vary by type.',
    button: 'Choose MRI type' },
  { network: 'single', plan: 'connected', variant: 'procedure-after',
    headline: 'Most providers in this area charge {price} for {procedure}' },
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
    headline: 'Most providers in this area charge $1,400–$2,200' },
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
    headline: 'Most providers in this area charge {price} for {procedure}' },

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
        const min = 1000, max = 4200, lo = 1400, hi = 2200
        const leftFlex = lo - min       // 400
        const midFlex = hi - lo         // 800
        const rightFlex = max - hi      // 2000
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
        <span style={{ fontFamily: FONT, fontSize: 12, color: TEXT_DARK }}>$1,000</span>
        <span style={{ fontFamily: FONT, fontSize: 12, color: TEXT_DARK }}>$4,200</span>
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

// ── Provider Card ───────────────────────────────────────────

function ProviderCard({
  provider,
  showCostChip = true,
  showPrice = true,
  costLabel = 'est. out-of-pocket',
}: {
  provider: Provider
  showCostChip?: boolean
  showPrice?: boolean
  costLabel?: string
}) {
  const tierColor = TIER_COLORS[provider.networkKey]
  const chip = COST_CHIP_CONFIG[provider.costLevel]
  const [isFaved, setIsFaved] = useState(false)

  return (
    <div
      style={{
        backgroundColor: BG_WHITE,
        borderRadius: RADIUS_S,
        border: `1px solid ${BORDER_LIGHT}`,
        overflow: 'hidden',
      }}
    >
      {/* Provider Info */}
      <div style={{ padding: `${SPACE_S}px ${SPACE_S}px ${SPACE_XS}px` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACE_XXS }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: RADIUS_FULL,
              backgroundColor: BG_EXTRA_SUBTLE,
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={provider.photo}
              alt={provider.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
                ;(e.target as HTMLImageElement).parentElement!.innerHTML =
                  `<span style="font-family:${FONT};font-weight:${W_MEDIUM};font-size:16px;color:${TEXT_DARK}">${provider.initials}</span>`
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: FONT, fontWeight: W_MEDIUM, fontSize: 20, lineHeight: '24px', color: TEXT_DEFAULT,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {provider.name}
            </p>
            <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, lineHeight: '19px', color: TEXT_DEFAULT, marginTop: 2 }}>
              {provider.specialty}
            </p>
            <p style={{
              fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, lineHeight: '19px', color: TEXT_DEFAULT,
              marginTop: SPACE_XXXS, textDecoration: 'underline',
            }}>
              {provider.address}
            </p>

            {/* Network tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACE_XXXS, marginTop: SPACE_XXS }}>
              <CoinIcon backColor={tierColor.back} frontColor={tierColor.front} />
              <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, color: TEXT_DEFAULT }}>
                {provider.networkName ? `${provider.networkName} · ` : ''}{provider.networkLabel}
              </span>
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => setIsFaved(!isFaved)}
            style={{
              background: isFaved ? 'transparent' : BG_EXTRA_SUBTLE,
              border: 'none',
              cursor: 'pointer',
              width: 42,
              height: 42,
              borderRadius: RADIUS_FULL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            aria-label={isFaved ? 'Remove from favorites' : 'Save to favorites'}
          >
            <span style={{ color: isFaved ? PRIMARY_TEXT : BORDER_STRONG, display: 'flex' }}>
              {isFaved ? <HeartSolidIcon size="md" /> : <HeartLineIcon size="md" />}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Bar — 3 columns with dividers */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderTop: `1px solid ${BORDER_LIGHT}`,
          borderBottom: `1px solid ${BORDER_LIGHT}`,
          padding: `${SPACE_XS}px 0`,
        }}
      >
        <StatColumn icon={<span style={{ color: '#ffd129' }}><StarSolidIcon size="sm" /></span>} label={`${provider.rating}/5 (${provider.reviews})`} />
        <div style={{ width: 1, height: 32, backgroundColor: BORDER_LIGHT }} />
        <StatColumn icon={<span style={{ color: TEXT_DARK }}><LocationIcon size="sm" /></span>} label={provider.distance} />
        <div style={{ width: 1, height: 32, backgroundColor: BORDER_LIGHT }} />
        {provider.virtual ? (
          <StatColumn icon={<span style={{ color: TEXT_DARK }}><VideoCameraIcon size="sm" /></span>} label="Virtual visit" />
        ) : (
          <StatColumn icon={<span style={{ color: TEXT_DARK }}><VideoCameraIcon size="sm" /></span>} label="In-person" />
        )}
      </div>

      {/* Price Section */}
      {showPrice && (<div style={{ padding: `${SPACE_XS}px ${SPACE_S}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {showCostChip && chip ? (
            <div>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 20, lineHeight: '24px', color: TEXT_DEFAULT }}>
                {provider.cost}
              </span>
              <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK, marginTop: 2 }}>
                {costLabel}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: SPACE_XXS }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: W_MEDIUM, fontSize: 20, lineHeight: '24px', color: TEXT_DEFAULT }}>
                {provider.cost}
              </span>
              <span style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 14, lineHeight: '17px', color: TEXT_DARK }}>
                {costLabel}
              </span>
            </div>
          )}

          {/* Cost chip */}
          {showCostChip && chip && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: SPACE_XXXS,
                backgroundColor: chip.bg,
                borderRadius: RADIUS_FULL,
                padding: `${SPACE_XXXS}px ${SPACE_XXS}px`,
                color: chip.color,
              }}
            >
              {chip.Icon && <chip.Icon size="xs" />}
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: W_MEDIUM,
                  fontSize: 14,
                  lineHeight: '18px',
                }}
              >
                {chip.label}
              </span>
            </div>
          )}
        </div>
      </div>)}

      {/* Appointment + Actions */}
      <div style={{ padding: `0 ${SPACE_S}px ${SPACE_S}px`, borderTop: `1px solid ${BORDER_LIGHT}`, paddingTop: SPACE_S }}>
        <p style={{ fontFamily: FONT, fontWeight: W_REGULAR, fontSize: 16, lineHeight: '19px', color: TEXT_DEFAULT }}>
          {provider.nextApptLabel}{' '}
          <strong style={{ fontWeight: W_MEDIUM }}>{provider.nextApptDate}</strong>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACE_XS, marginTop: SPACE_S }}>
          <Button variant="outline" size="sm" fullWidth>
            Call
          </Button>
          <Button variant="secondary" size="sm" fullWidth>
            Book
          </Button>
        </div>
      </div>
    </div>
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
}: {
  config: UseCaseConfig
  subVariant?: string
  selectedProcedure?: string | null
  onSelectProcedure?: (value: string | null) => void
  onOpenModal?: () => void
  isLoading?: boolean
  multiNetwork?: boolean
  bannerCopy: BannerCopyEntry[]
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
            return copy ? <PriceRangeBar copy={copy} /> : null
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
        }}>
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
