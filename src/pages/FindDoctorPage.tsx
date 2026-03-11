import { useState } from 'react'
import { Button, Checkbox, Toggle } from 'glow-ds/components'

type InsuranceType = 'Medical' | 'Dental' | 'Vision'

interface Doctor {
  id: number
  name: string
  specialty: string
  rating: number
  insuranceTypes: InsuranceType[]
  availableToday: boolean
}

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Sarah Chen', specialty: 'Family Medicine', rating: 4.8, insuranceTypes: ['Medical', 'Vision'], availableToday: true },
  { id: 2, name: 'Dr. James Okafor', specialty: 'Dentistry', rating: 4.5, insuranceTypes: ['Dental'], availableToday: false },
  { id: 3, name: 'Dr. Maria Lopez', specialty: 'Ophthalmology', rating: 4.9, insuranceTypes: ['Medical', 'Vision'], availableToday: true },
  { id: 4, name: 'Dr. David Kim', specialty: 'Pediatrics', rating: 4.2, insuranceTypes: ['Medical'], availableToday: false },
  { id: 5, name: 'Dr. Aisha Patel', specialty: 'Orthodontics', rating: 4.7, insuranceTypes: ['Dental', 'Medical'], availableToday: true },
  { id: 6, name: 'Dr. Robert Nguyen', specialty: 'Dermatology', rating: 4.6, insuranceTypes: ['Medical', 'Dental', 'Vision'], availableToday: false },
  { id: 7, name: 'Dr. Emily Torres', specialty: 'Optometry', rating: 4.3, insuranceTypes: ['Vision'], availableToday: true },
  { id: 8, name: 'Dr. Michael Brown', specialty: 'General Dentistry', rating: 4.1, insuranceTypes: ['Dental', 'Vision'], availableToday: false },
]

const INSURANCE_TYPES: InsuranceType[] = ['Medical', 'Dental', 'Vision']

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M8 1l2.2 4.5 5 .7-3.6 3.5.9 5L8 12.4 3.5 14.7l.9-5L.8 6.2l5-.7L8 1z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-xxxs">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rounded ? 'text-primary' : 'text-neutral-border-light'}>
          <StarIcon filled={i < rounded} />
        </span>
      ))}
    </div>
  )
}

function BookingModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const [formData, setFormData] = useState({ fullName: '', phone: '', date: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/40" onClick={onClose}>
        <div className="bg-neutral-negative rounded-xs shadow-lg p-xl flex flex-col items-center gap-l max-w-[400px] w-full mx-s" onClick={e => e.stopPropagation()}>
          <div className="w-[64px] h-[64px] rounded-full bg-success-subtle flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success" />
            </svg>
          </div>
          <h2 className="font-default font-medium text-[24px] leading-[28px] text-neutral text-center">
            Booking Confirmed!
          </h2>
          <p className="font-default text-[16px] leading-[19px] text-neutral-text-light text-center">
            Your appointment with {doctor.name} has been booked for {formData.date}.
          </p>
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/40" onClick={onClose}>
      <div className="bg-neutral-negative rounded-xs shadow-lg p-xl flex flex-col gap-l max-w-[480px] w-full mx-s" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col gap-xxs">
          <h2 className="font-default font-medium text-[24px] leading-[28px] text-neutral">
            Book Appointment
          </h2>
          <p className="font-default text-[14px] leading-[17px] text-neutral-text-light">
            {doctor.name} — {doctor.specialty}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-m">
          <label className="flex flex-col gap-xxs">
            <span className="font-default font-medium text-[14px] text-neutral">Full Name</span>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="font-default text-[16px] text-neutral border border-neutral-border-light rounded-xs px-s py-xs outline-none focus:border-primary"
              placeholder="John Doe"
            />
          </label>

          <label className="flex flex-col gap-xxs">
            <span className="font-default font-medium text-[14px] text-neutral">Phone Number</span>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="font-default text-[16px] text-neutral border border-neutral-border-light rounded-xs px-s py-xs outline-none focus:border-primary"
              placeholder="(555) 123-4567"
            />
          </label>

          <label className="flex flex-col gap-xxs">
            <span className="font-default font-medium text-[14px] text-neutral">Preferred Date</span>
            <input
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="font-default text-[16px] text-neutral border border-neutral-border-light rounded-xs px-s py-xs outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-xxs">
            <span className="font-default font-medium text-[14px] text-neutral">Notes (optional)</span>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="font-default text-[16px] text-neutral border border-neutral-border-light rounded-xs px-s py-xs outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="Any special requirements..."
            />
          </label>

          <div className="flex gap-s pt-xs">
            <Button variant="outline" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="secondary" size="md" type="submit">
              Confirm Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: (doctor: Doctor) => void }) {
  return (
    <div className="bg-neutral-negative rounded-xs shadow-card p-l flex flex-col gap-s">
      <h3 className="font-default font-medium text-[18px] leading-[22px] text-neutral">
        {doctor.name}
      </h3>
      <p className="font-default text-[14px] leading-[17px] text-neutral-text-light">
        {doctor.specialty}
      </p>
      <div className="flex items-center gap-xxs">
        <StarRating rating={doctor.rating} />
        <span className="font-default text-[14px] text-neutral-text-light">
          {doctor.rating.toFixed(1)}
        </span>
      </div>
      <div className="flex flex-wrap gap-xxs">
        {doctor.insuranceTypes.map(type => (
          <span key={type} className="bg-accent-blue-subtle text-accent-blue-text-dark font-default font-medium text-[12px] px-xxs py-xxxs rounded-full">
            {type}
          </span>
        ))}
      </div>
      {doctor.availableToday && (
        <span className="bg-success-subtle text-success-text-dark font-default font-medium text-[12px] px-xxs py-xxxs rounded-full self-start">
          Available Today
        </span>
      )}
      <div className="mt-auto pt-xs">
        <Button variant="secondary" size="sm" fullWidth onClick={() => onBook(doctor)}>
          Book
        </Button>
      </div>
    </div>
  )
}

export function FindDoctorPage() {
  const [selectedInsurance, setSelectedInsurance] = useState<Set<InsuranceType>>(new Set())
  const [appliedInsurance, setAppliedInsurance] = useState<Set<InsuranceType>>(new Set())
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false)
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null)

  const filteredDoctors = DOCTORS.filter(doc => {
    if (availableTodayOnly && !doc.availableToday) return false
    if (appliedInsurance.size > 0) {
      if (!doc.insuranceTypes.some(t => appliedInsurance.has(t))) return false
    }
    return true
  })

  const handleInsuranceChange = (type: InsuranceType) => {
    setSelectedInsurance(prev => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const handleSearch = () => {
    setAppliedInsurance(new Set(selectedInsurance))
  }

  return (
    <div className="min-h-screen bg-neutral-extra-subtle p-xl">
      <div className="max-w-[960px] mx-auto flex flex-col gap-xl">
        <h1 className="font-display font-medium text-[40px] leading-[48px]">
          Find a Doctor
        </h1>

        <div className="flex flex-col gap-m">
          <p className="font-default font-medium text-[16px] text-neutral">
            Filter by Insurance
          </p>
          <div className="flex flex-wrap gap-l">
            {INSURANCE_TYPES.map(type => (
              <Checkbox
                key={type}
                label={type}
                checked={selectedInsurance.has(type)}
                onChange={() => handleInsuranceChange(type)}
              />
            ))}
          </div>

          <Toggle
            checked={availableTodayOnly}
            onChange={() => setAvailableTodayOnly(prev => !prev)}
            label="Available today only"
          />

          <div>
            <Button variant="primary" size="lg" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        <p className="font-default text-[14px] text-neutral-text-light">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </p>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-l">
            {filteredDoctors.map(doc => (
              <DoctorCard key={doc.id} doctor={doc} onBook={setBookingDoctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-xxxl">
            <p className="font-default text-[16px] text-neutral-text-light">
              No doctors match your filters. Try adjusting your criteria.
            </p>
          </div>
        )}
      </div>

      {bookingDoctor && (
        <BookingModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} />
      )}
    </div>
  )
}
