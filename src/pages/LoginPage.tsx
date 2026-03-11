import { useState } from 'react'
import { Button, TextInput } from 'glow-ds/components'

function DividerOr() {
  return (
    <div className="flex items-center w-full">
      <div className="flex-1 h-px bg-neutral-border-light" />
      <span className="font-default text-[18px] text-neutral-text-light px-xs">or</span>
      <div className="flex-1 h-px bg-neutral-border-light" />
    </div>
  )
}

function HealtheeLogo() {
  return (
    <div className="flex items-center gap-xxs">
      <svg width="36" height="20" viewBox="0 0 36 20" fill="none" aria-hidden="true">
        <path d="M18 0C8.06 0 0 8.06 0 18c0 .55.03 1.1.08 1.64A17.93 17.93 0 0 1 14.5 2.28c1.12-.15 2.27-.23 3.5-.23s2.38.08 3.5.23A17.93 17.93 0 0 1 35.92 19.64c.05-.54.08-1.09.08-1.64C36 8.06 27.94 0 18 0z" fill="#FD5201" />
        <path d="M6 10a12 12 0 0 1 24 0" stroke="#FD5201" strokeWidth="2" fill="none" />
        <path d="M10 10a8 8 0 0 1 16 0" stroke="#FD5201" strokeWidth="2" fill="none" />
        <path d="M14 10a4 4 0 0 1 8 0" stroke="#FD5201" strokeWidth="2" fill="none" />
      </svg>
      <span className="font-default font-medium text-[20px] text-neutral">healthee</span>
    </div>
  )
}

export function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('')

  return (
    <div className="flex min-h-screen">
      {/* Left panel — white form area */}
      <div className="bg-neutral-negative flex flex-col justify-between flex-1 min-w-0 lg:min-w-[720px]">
        {/* Logo */}
        <div className="px-xxxxl py-m">
          <HealtheeLogo />
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col items-center justify-center px-xl">
          <div className="w-full max-w-[420px] flex flex-col gap-l">
            {/* Title */}
            <h1 className="font-display font-medium text-[40px] leading-[48px] text-neutral">
              Access your{'\n'}Healthee account
            </h1>

            {/* Login form */}
            <div className="flex flex-col gap-l">
              <TextInput
                label="Email or phone"
                showInfoIcon
                placeholder="Enter email or phone number"
                size="md"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
              <Button variant="secondary" size="md" fullWidth>
                Continue
              </Button>
            </div>

            {/* Divider */}
            <DividerOr />

            {/* Alternative login */}
            <Button variant="outline" size="md" fullWidth>
              Access with medical member ID
            </Button>
          </div>
        </div>

        {/* Terms footer */}
        <div className="px-xl py-xl">
          <div className="max-w-[420px] mx-auto">
            <p className="font-default text-[12px] leading-[14px] text-neutral-text-light">
              By continuing, you agree to Healthee's{' '}
              <a href="#" className="underline">Consumer Terms and Conditions</a>
              , and acknowledge their{' '}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — orange hero */}
      <div className="hidden lg:flex flex-col justify-end items-center bg-primary relative overflow-hidden max-w-[780px] min-w-[280px] flex-1">
        {/* Hero background image */}
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay for depth */}
        <div className="absolute inset-0 bg-neutral/40" />

        {/* Gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-primary via-primary/90 to-transparent" />

        {/* Content at bottom */}
        <div className="relative z-10 flex flex-col items-center gap-xxl pb-xxxl px-xxxxl w-full">
          {/* Tagline */}
          <p className="font-display italic text-[20px] leading-[24px] text-neutral-negative text-center">
            Healthcare navigation made easy.
          </p>

          {/* App download card */}
          <div className="backdrop-blur-sm bg-neutral-negative/20 rounded-[20px] px-xxs py-xxs flex items-center gap-xxs w-full max-w-[392px]">
            <div className="bg-neutral-negative/20 rounded-[17px] size-[100px] flex items-center justify-center shrink-0">
              <div className="bg-neutral-negative rounded-[8px] p-xxs">
                <div className="size-[67px] flex items-center justify-center">
                  {/* Fake QR code */}
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                    {/* Background */}
                    <rect width="60" height="60" fill="white" />
                    {/* Top-left finder */}
                    <rect x="2" y="2" width="16" height="16" fill="#1a1a1a" />
                    <rect x="4" y="4" width="12" height="12" fill="white" />
                    <rect x="6" y="6" width="8" height="8" fill="#1a1a1a" />
                    {/* Top-right finder */}
                    <rect x="42" y="2" width="16" height="16" fill="#1a1a1a" />
                    <rect x="44" y="4" width="12" height="12" fill="white" />
                    <rect x="46" y="6" width="8" height="8" fill="#1a1a1a" />
                    {/* Bottom-left finder */}
                    <rect x="2" y="42" width="16" height="16" fill="#1a1a1a" />
                    <rect x="4" y="44" width="12" height="12" fill="white" />
                    <rect x="6" y="46" width="8" height="8" fill="#1a1a1a" />
                    {/* Data dots - row patterns */}
                    <rect x="20" y="2" width="2" height="2" fill="#1a1a1a" />
                    <rect x="24" y="2" width="2" height="2" fill="#1a1a1a" />
                    <rect x="28" y="2" width="2" height="2" fill="#1a1a1a" />
                    <rect x="34" y="2" width="2" height="2" fill="#1a1a1a" />
                    <rect x="38" y="2" width="2" height="2" fill="#1a1a1a" />
                    <rect x="20" y="6" width="2" height="2" fill="#1a1a1a" />
                    <rect x="26" y="6" width="2" height="2" fill="#1a1a1a" />
                    <rect x="30" y="6" width="2" height="2" fill="#1a1a1a" />
                    <rect x="36" y="6" width="2" height="2" fill="#1a1a1a" />
                    <rect x="22" y="10" width="2" height="2" fill="#1a1a1a" />
                    <rect x="28" y="10" width="2" height="2" fill="#1a1a1a" />
                    <rect x="32" y="10" width="2" height="2" fill="#1a1a1a" />
                    <rect x="38" y="10" width="2" height="2" fill="#1a1a1a" />
                    <rect x="20" y="14" width="2" height="2" fill="#1a1a1a" />
                    <rect x="26" y="14" width="2" height="2" fill="#1a1a1a" />
                    <rect x="34" y="14" width="2" height="2" fill="#1a1a1a" />
                    {/* Timing pattern row */}
                    <rect x="2" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="6" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="10" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="14" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="20" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="26" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="30" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="36" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="42" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="48" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="52" y="20" width="2" height="2" fill="#1a1a1a" />
                    <rect x="56" y="20" width="2" height="2" fill="#1a1a1a" />
                    {/* Middle data area */}
                    <rect x="22" y="24" width="2" height="2" fill="#1a1a1a" />
                    <rect x="28" y="24" width="2" height="2" fill="#1a1a1a" />
                    <rect x="32" y="24" width="2" height="2" fill="#1a1a1a" />
                    <rect x="38" y="24" width="2" height="2" fill="#1a1a1a" />
                    <rect x="44" y="24" width="2" height="2" fill="#1a1a1a" />
                    <rect x="50" y="24" width="2" height="2" fill="#1a1a1a" />
                    <rect x="56" y="24" width="2" height="2" fill="#1a1a1a" />
                    <rect x="20" y="28" width="2" height="2" fill="#1a1a1a" />
                    <rect x="24" y="28" width="2" height="2" fill="#1a1a1a" />
                    <rect x="30" y="28" width="2" height="2" fill="#1a1a1a" />
                    <rect x="36" y="28" width="2" height="2" fill="#1a1a1a" />
                    <rect x="42" y="28" width="2" height="2" fill="#1a1a1a" />
                    <rect x="46" y="28" width="2" height="2" fill="#1a1a1a" />
                    <rect x="52" y="28" width="2" height="2" fill="#1a1a1a" />
                    <rect x="22" y="32" width="2" height="2" fill="#1a1a1a" />
                    <rect x="26" y="32" width="2" height="2" fill="#1a1a1a" />
                    <rect x="32" y="32" width="2" height="2" fill="#1a1a1a" />
                    <rect x="38" y="32" width="2" height="2" fill="#1a1a1a" />
                    <rect x="44" y="32" width="2" height="2" fill="#1a1a1a" />
                    <rect x="48" y="32" width="2" height="2" fill="#1a1a1a" />
                    <rect x="54" y="32" width="2" height="2" fill="#1a1a1a" />
                    <rect x="20" y="36" width="2" height="2" fill="#1a1a1a" />
                    <rect x="26" y="36" width="2" height="2" fill="#1a1a1a" />
                    <rect x="30" y="36" width="2" height="2" fill="#1a1a1a" />
                    <rect x="34" y="36" width="2" height="2" fill="#1a1a1a" />
                    <rect x="42" y="36" width="2" height="2" fill="#1a1a1a" />
                    <rect x="50" y="36" width="2" height="2" fill="#1a1a1a" />
                    <rect x="56" y="36" width="2" height="2" fill="#1a1a1a" />
                    {/* Bottom-right data */}
                    <rect x="20" y="42" width="2" height="2" fill="#1a1a1a" />
                    <rect x="24" y="42" width="2" height="2" fill="#1a1a1a" />
                    <rect x="30" y="42" width="2" height="2" fill="#1a1a1a" />
                    <rect x="36" y="42" width="2" height="2" fill="#1a1a1a" />
                    <rect x="42" y="42" width="2" height="2" fill="#1a1a1a" />
                    <rect x="48" y="42" width="2" height="2" fill="#1a1a1a" />
                    <rect x="54" y="42" width="2" height="2" fill="#1a1a1a" />
                    <rect x="22" y="46" width="2" height="2" fill="#1a1a1a" />
                    <rect x="28" y="46" width="2" height="2" fill="#1a1a1a" />
                    <rect x="34" y="46" width="2" height="2" fill="#1a1a1a" />
                    <rect x="38" y="46" width="2" height="2" fill="#1a1a1a" />
                    <rect x="44" y="46" width="2" height="2" fill="#1a1a1a" />
                    <rect x="50" y="46" width="2" height="2" fill="#1a1a1a" />
                    <rect x="20" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="26" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="32" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="36" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="42" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="46" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="52" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="56" y="50" width="2" height="2" fill="#1a1a1a" />
                    <rect x="22" y="54" width="2" height="2" fill="#1a1a1a" />
                    <rect x="28" y="54" width="2" height="2" fill="#1a1a1a" />
                    <rect x="34" y="54" width="2" height="2" fill="#1a1a1a" />
                    <rect x="40" y="54" width="2" height="2" fill="#1a1a1a" />
                    <rect x="46" y="54" width="2" height="2" fill="#1a1a1a" />
                    <rect x="52" y="54" width="2" height="2" fill="#1a1a1a" />
                    <rect x="56" y="54" width="2" height="2" fill="#1a1a1a" />
                    {/* Alignment pattern */}
                    <rect x="44" y="44" width="8" height="8" fill="#1a1a1a" />
                    <rect x="45" y="45" width="6" height="6" fill="white" />
                    <rect x="47" y="47" width="2" height="2" fill="#1a1a1a" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-s flex-1 min-w-0">
              <p className="font-default font-medium text-[18px] leading-[21px] text-neutral-negative">
                Download the Healthee app
              </p>
              <div className="flex items-center gap-xxs">
                {/* Apple icon */}
                <div className="px-xxxs">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </div>
                {/* Separator */}
                <div className="w-px h-[24px] bg-neutral-negative/40" />
                {/* Android icon */}
                <div className="px-xxxs">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.93 5.93 0 0 0 6 7h12c0-2.12-1.1-3.98-2.77-5.05zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
