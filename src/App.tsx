import { useState, useEffect } from 'react'

// ── Theme ──────────────────────────────────────────────────────────────────
const C = {
  blue: '#005BBB',
  blueDark: '#004499',
  blueLight: '#E3EDFA',
  blueMid: '#CCE0F5',
  yellow: '#FFD500',
  yellowLight: '#FFF9C4',
  white: '#FFFFFF',
  bg: '#F5F5F5',
  dark: '#1C1B1F',
  medium: '#49454F',
  gray: '#79747E',
  border: '#E6E0E9',
  errorBg: '#FFEBEE',
  error: '#C62828',
  successBg: '#E8F5E9',
  success: '#1B5E20',
}

const font = "'Nunito', system-ui, sans-serif"

// ── Types ──────────────────────────────────────────────────────────────────
type NavTab = 'home' | 'translator' | 'info'
type Screen = 'splash' | 'dashboard' | 'translator' | 'info' | 'tramite-detail' | 'settings'
type InfoSubTab = 'tramites' | 'recursos'
type LangDirection = 'uk-es' | 'es-uk'
type TranslateState = 'idle' | 'loading' | 'success' | 'error'

interface Tramite {
  id: number
  title: string
  description: string
  fullDescription: string
  requirements: string[]
  documents: string[]
  link: string
}

interface Recurso {
  id: number
  name: string
  description: string
  tipo: string
  link: string
}

// ── Data ───────────────────────────────────────────────────────────────────
const TRAMITES: Tramite[] = [
  {
    id: 1,
    title: 'Protección Temporal',
    description: 'Estatuto de protección especial para ciudadanos ucranianos en España.',
    fullDescription:
      'La protección temporal es un régimen especial activado por la UE que permite a los ciudadanos ucranianos residir y trabajar legalmente en España sin necesidad de solicitar asilo de forma individual. Tiene una duración inicial de un año, prorrogable hasta tres.',
    requirements: [
      'Pasaporte ucraniano válido',
      'Ser nacional ucraniano o residente habitual en Ucrania',
      'Haber salido de Ucrania desde el 24 de febrero de 2022',
    ],
    documents: [
      'Pasaporte o documento de identidad ucraniano',
      'Formulario EX-01 cumplimentado y firmado',
      'Fotografía reciente en formato carnet (3×4 cm)',
      'Justificante de domicilio en España',
    ],
    link: 'https://extranjeros.inclusion.gob.es',
  },
  {
    id: 2,
    title: 'Tarjeta Sanitaria',
    description: 'Acceda a atención médica gratuita en toda España.',
    fullDescription:
      'Con la protección temporal activa tiene derecho a la asistencia sanitaria pública en España. Solicítela en el centro de salud más cercano a su domicilio. Es gratuita e incluye médico de cabecera, especialistas y urgencias.',
    requirements: [
      'Protección temporal activa o residencia legal',
      'Empadronamiento en el municipio',
    ],
    documents: [
      'Pasaporte o tarjeta de protección temporal',
      'Certificado de empadronamiento municipal',
    ],
    link: 'https://www.sanidad.gob.es',
  },
  {
    id: 3,
    title: 'Empadronamiento',
    description: 'Regístrese en el padrón municipal de su localidad.',
    fullDescription:
      'El empadronamiento es el registro oficial en el padrón municipal del ayuntamiento donde reside. Es el primer paso y un requisito para acceder a servicios públicos como sanidad, educación y prestaciones sociales.',
    requirements: [
      'Domicilio en España (temporal o permanente)',
      'Documento de identidad válido',
    ],
    documents: [
      'Pasaporte ucraniano',
      'Contrato de arrendamiento o carta del propietario',
      'Hoja de empadronamiento del ayuntamiento',
    ],
    link: 'https://www.mptfp.gob.es',
  },
  {
    id: 4,
    title: 'Prestación Económica',
    description: 'Solicite la ayuda económica para desplazados ucranianos.',
    fullDescription:
      'Ayuda económica gestionada por el IMSERSO para cubrir necesidades básicas de los desplazados de Ucrania que carezcan de recursos suficientes. El importe varía según la situación familiar.',
    requirements: [
      'Protección temporal activa',
      'Carecer de recursos económicos suficientes',
      'Disponer de cuenta bancaria en entidad española',
    ],
    documents: [
      'Solicitud específica del programa IMSERSO',
      'Tarjeta de protección temporal',
      'Certificado bancario de número de cuenta española',
      'Declaración de medios económicos',
    ],
    link: 'https://www.imserso.es',
  },
]

const RECURSOS: Recurso[] = [
  {
    id: 1,
    name: 'Cruz Roja España',
    description:
      'Asistencia humanitaria, alojamiento temporal, alimentación y orientación legal para refugiados en toda España.',
    tipo: 'Ayuda humanitaria',
    link: 'https://www.cruzroja.es',
  },
  {
    id: 2,
    name: 'ACNUR España',
    description:
      'Agencia de la ONU para los Refugiados. Protección legal y asistencia jurídica especializada.',
    tipo: 'Protección legal',
    link: 'https://www.acnur.org/es',
  },
  {
    id: 3,
    name: 'Cáritas España',
    description:
      'Apoyo social, alimentación, ropa y orientación para familias en situación de necesidad.',
    tipo: 'Apoyo social',
    link: 'https://www.caritas.es',
  },
  {
    id: 4,
    name: 'CEAR',
    description:
      'Comisión Española de Ayuda al Refugiado. Asesoría jurídica, acogida y programas de inserción.',
    tipo: 'Asesoría jurídica',
    link: 'https://www.cear.es',
  },
  {
    id: 5,
    name: 'Embajada de Ucrania en España',
    description:
      'Servicios consulares, renovación de documentación y asistencia oficial ucraniana en Madrid.',
    tipo: 'Servicios consulares',
    link: 'https://spain.mfa.gov.ua',
  },
]

// ── SVG Icons ──────────────────────────────────────────────────────────────
type IconProps = { size?: number; color?: string }

const IcHome = ({ size = 24, color = C.gray }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
)

const IcTranslate = ({ size = 24, color = C.gray }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7 1.62-4.33L19.12 17h-3.24z" />
  </svg>
)

const IcInfo = ({ size = 24, color = C.gray }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
)

const IcSettings = ({ size = 24, color = C.white }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.3 7.3 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 3h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.487.487 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
)

const IcBack = ({ size = 24, color = C.white }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
)

const IcDocument = ({ size = 32, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
)

const IcHelp = ({ size = 32, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  </svg>
)

const IcSwap = ({ size = 24, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.99 11 3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
  </svg>
)

const IcCopy = ({ size = 20, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
)

const IcExternal = ({ size = 18, color = C.white }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
  </svg>
)

const IcCheck = ({ size = 16, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
)

const IcFile = ({ size = 16, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
  </svg>
)

const IcErrorCircle = ({ size = 20, color = C.error }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
)

const IcFont = ({ size = 22, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
  </svg>
)

const IcSync = ({ size = 20, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
  </svg>
)

const IcLang = ({ size = 22, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
  </svg>
)

// ── Status Bar ─────────────────────────────────────────────────────────────
function StatusBar({ onDark }: { onDark?: boolean }) {
  const ic = onDark ? C.white : C.dark
  return (
    <div
      style={{
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        fontFamily: font,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: ic }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3.5" height="4" rx="0.8" fill={ic} fillOpacity="0.3" />
          <rect x="4.5" y="5.5" width="3.5" height="6.5" rx="0.8" fill={ic} fillOpacity="0.5" />
          <rect x="9" y="2.5" width="3.5" height="9.5" rx="0.8" fill={ic} fillOpacity="0.8" />
          <rect x="13.5" y="0" width="3.5" height="12" rx="0.8" fill={ic} />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill={ic}>
          <circle cx="7.5" cy="9.5" r="1.5" />
          <path
            fillOpacity="0.7"
            d="M7.5 6c1.2 0 2.3.5 3.1 1.4l1-.9A6 6 0 0 0 7.5 4.5a6 6 0 0 0-4.1 2l1 .9C5.2 6.5 6.3 6 7.5 6z"
          />
          <path
            fillOpacity="0.4"
            d="M7.5 3c2 0 3.8.9 5.1 2.3l1-.9C12 2.8 9.9 1.5 7.5 1.5S3 2.8 1.4 4.4l1 .9C3.7 3.9 5.5 3 7.5 3z"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke={ic} strokeOpacity="0.4" />
          <rect x="22" y="3.5" width="2.5" height="5" rx="1.25" fill={ic} fillOpacity="0.4" />
          <rect x="2" y="2" width="17.5" height="8" rx="1.5" fill={ic} />
        </svg>
      </div>
    </div>
  )
}

// ── App Header ─────────────────────────────────────────────────────────────
function AppHeader({
  title,
  onBack,
  rightNode,
}: {
  title: string
  onBack?: () => void
  rightNode?: React.ReactNode
}) {
  return (
    <div
      style={{
        height: 56,
        background: C.blue,
        display: 'flex',
        alignItems: 'center',
        padding: onBack ? '0 8px 0 4px' : '0 8px 0 20px',
        gap: 4,
        flexShrink: 0,
        fontFamily: font,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            border: 'none',
            background: 'rgba(255,255,255,0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IcBack />
        </button>
      )}
      <span
        style={{
          flex: 1,
          fontSize: 20,
          fontWeight: 700,
          color: C.white,
          letterSpacing: 0.15,
          fontFamily: font,
        }}
      >
        {title}
      </span>
      {rightNode}
    </div>
  )
}

// ── Bottom Navigation ──────────────────────────────────────────────────────
function BottomNav({
  active,
  onChange,
}: {
  active: NavTab
  onChange: (t: NavTab) => void
}) {
  const tabs: { id: NavTab; label: string; Icon: React.FC<IconProps> }[] = [
    { id: 'home', label: 'Inicio', Icon: IcHome },
    { id: 'translator', label: 'Traductor', Icon: IcTranslate },
    { id: 'info', label: 'Información', Icon: IcInfo },
  ]
  return (
    <div
      style={{
        height: 72,
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        flexShrink: 0,
        paddingBottom: 4,
        fontFamily: font,
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const on = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              paddingTop: 8,
            }}
          >
            {on && (
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 64,
                  height: 32,
                  borderRadius: 16,
                  background: C.blueLight,
                }}
              />
            )}
            <Icon size={22} color={on ? C.blue : C.gray} />
            <span
              style={{
                fontSize: 11,
                fontWeight: on ? 700 : 500,
                color: on ? C.blue : C.gray,
                letterSpacing: 0.3,
                fontFamily: font,
              }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Pill Badge ─────────────────────────────────────────────────────────────
function PillBadge({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
        background: accent ? C.yellow : C.blueLight,
        color: accent ? '#5C4200' : C.blue,
        fontFamily: font,
      }}
    >
      {label}
    </span>
  )
}

// ── Primary Button ─────────────────────────────────────────────────────────
function PrimaryBtn({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 24px',
        borderRadius: 14,
        border: 'none',
        background: disabled ? '#B0B0B0' : C.blue,
        color: C.white,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: font,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        letterSpacing: 0.5,
        transition: 'opacity 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ── Outline Button ─────────────────────────────────────────────────────────
function OutlineBtn({ label, onClick, icon }: { label: string; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '14px 24px',
        borderRadius: 14,
        border: `2px solid ${C.blue}`,
        background: C.white,
        color: C.blue,
        fontSize: 15,
        fontWeight: 700,
        fontFamily: font,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        letterSpacing: 0.3,
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ── SCREEN: Splash ─────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: C.white,
        fontFamily: font,
      }}
    >
      {/* Blue band */}
      <div style={{ flex: 1, background: C.blue }} />

      {/* Center content */}
      <div
        style={{
          flexShrink: 0,
          background: C.white,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
          gap: 0,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 24,
            background: C.blue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            boxShadow: `0 4px 24px rgba(0,91,187,0.28)`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {/* Stylized UA trident + translation arrow */}
            <path
              d="M24 8c-4.4 0-8 3.6-8 8 0 3.3 2 6.1 4.9 7.4L18 36h12l-2.9-12.6C30 22.1 32 19.3 32 16c0-4.4-3.6-8-8-8z"
              fill={C.yellow}
              opacity="0.9"
            />
            <path
              d="M20 36h8M22 36v4M26 36v4M20 40h8"
              stroke={C.yellow}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="24" cy="16" r="4" fill={C.white} opacity="0.9" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: C.blue,
            marginBottom: 6,
            letterSpacing: -0.5,
          }}
        >
          Ukrainian Support
        </h1>
        <p style={{ fontSize: 14, color: C.gray, fontWeight: 500, letterSpacing: 0.3 }}>
          Підтримка для українських біженців
        </p>
      </div>

      {/* Yellow band */}
      <div style={{ flex: 1, background: C.yellow }} />
    </div>
  )
}

// ── SCREEN: Dashboard ──────────────────────────────────────────────────────
function DashboardScreen({
  onNavigate,
  onSettings,
}: {
  onNavigate: (tab: NavTab, sub?: InfoSubTab) => void
  onSettings: () => void
}) {
  const cards = [
    {
      accent: C.blue,
      accentLight: C.blueLight,
      icon: <IcTranslate size={32} color={C.blue} />,
      title: 'Traductor Offline',
      desc: 'Traduzca entre ucraniano y español sin conexión a internet.',
      action: () => onNavigate('translator'),
    },
    {
      accent: C.yellow,
      accentLight: C.yellowLight,
      icon: <IcDocument size={32} color="#8B6800" />,
      title: 'Trámites Administrativos',
      desc: 'Consulte información sobre protección temporal y otros trámites.',
      action: () => onNavigate('info', 'tramites'),
      yellowAccent: true,
    },
    {
      accent: C.blue,
      accentLight: C.blueLight,
      icon: <IcHelp size={32} color={C.blue} />,
      title: 'Recursos de Apoyo',
      desc: 'Encuentre organizaciones y servicios oficiales de ayuda.',
      action: () => onNavigate('info', 'recursos'),
    },
  ]

  return (
    <>
      {/* Header area */}
      <div style={{ background: C.blue, flexShrink: 0 }}>
        <StatusBar onDark />
        <div
          style={{
            padding: '16px 20px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.white, letterSpacing: -0.3, fontFamily: font }}>
              Bienvenido
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: font }}>
              Seleccione una opción
            </p>
          </div>
          <button
            onClick={onSettings}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              border: 'none',
              background: 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IcSettings />
          </button>
        </div>
      </div>

      {/* Yellow accent stripe */}
      <div style={{ height: 6, background: C.yellow, flexShrink: 0 }} />

      {/* Cards */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px 24px',
          background: C.bg,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          fontFamily: font,
        }}
      >
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.action}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: C.white,
              borderRadius: 18,
              overflow: 'hidden',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              padding: 0,
              transition: 'transform 0.12s, box-shadow 0.12s',
            }}
          >
            {/* Left accent stripe */}
            <div style={{ width: 5, alignSelf: 'stretch', background: card.accent, flexShrink: 0 }} />

            {/* Icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: card.accentLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px 16px 20px 20px',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, padding: '20px 16px 20px 0' }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.dark,
                  marginBottom: 4,
                  fontFamily: font,
                  letterSpacing: -0.2,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.gray,
                  lineHeight: 1.4,
                  fontFamily: font,
                }}
              >
                {card.desc}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ paddingRight: 16, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={C.gray}>
                <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </div>
          </button>
        ))}

        {/* Footer info */}
        <div
          style={{
            marginTop: 8,
            padding: '14px 16px',
            borderRadius: 12,
            background: C.blueLight,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <IcInfo size={20} color={C.blue} />
          <p style={{ fontSize: 12, color: C.blue, fontFamily: font, lineHeight: 1.4, fontWeight: 600 }}>
            Esta aplicación funciona sin conexión a internet.
          </p>
        </div>
      </div>
    </>
  )
}

// ── SCREEN: Translator ─────────────────────────────────────────────────────
function TranslatorScreen() {
  const [direction, setDirection] = useState<LangDirection>('uk-es')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')
  const [state, setState] = useState<TranslateState>('idle')
  const [copied, setCopied] = useState(false)

  const srcLabel = direction === 'uk-es' ? '🇺🇦  Ucraniano' : '🇪🇸  Español'
  const dstLabel = direction === 'uk-es' ? '🇪🇸  Español' : '🇺🇦  Ucraniano'

  const mockTranslations: Record<LangDirection, string> = {
    'uk-es':
      'Esta es una traducción de demostración del ucraniano al español. El módulo de traducción offline está listo para su uso.',
    'es-uk':
      'Це демонстраційний переклад з іспанської на українську. Модуль офлайн-перекладу готовий до використання.',
  }

  const handleTranslate = () => {
    if (!inputText.trim()) {
      setState('error')
      setResult('')
      return
    }
    setState('loading')
    setResult('')
    setTimeout(() => {
      setState('success')
      setResult(mockTranslations[direction])
    }, 1100)
  }

  const handleSwap = () => {
    setDirection(d => (d === 'uk-es' ? 'es-uk' : 'uk-es'))
    setInputText(result)
    setResult('')
    setState('idle')
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div style={{ background: C.blue, flexShrink: 0 }}>
        <StatusBar onDark />
        <AppHeader title="Traductor" />
      </div>
      <div style={{ height: 4, background: C.yellow, flexShrink: 0 }} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: C.bg,
          padding: '20px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          fontFamily: font,
        }}
      >
        {/* Language selector */}
        <div
          style={{
            background: C.white,
            borderRadius: 18,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 0',
              borderRadius: 10,
              background: C.blueLight,
              fontSize: 15,
              fontWeight: 700,
              color: C.blue,
              fontFamily: font,
            }}
          >
            {srcLabel}
          </div>
          <button
            onClick={handleSwap}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              border: `2px solid ${C.blue}`,
              background: C.white,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IcSwap size={22} />
          </button>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 0',
              borderRadius: 10,
              background: C.bg,
              fontSize: 15,
              fontWeight: 700,
              color: C.medium,
              fontFamily: font,
            }}
          >
            {dstLabel}
          </div>
        </div>

        {/* Input */}
        <div
          style={{
            background: C.white,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ padding: '4px 16px 0', fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: 0.8, paddingTop: 14, fontFamily: font }}>
            {direction === 'uk-es' ? 'UCRANIANO' : 'ESPAÑOL'}
          </div>
          <textarea
            value={inputText}
            onChange={e => {
              setInputText(e.target.value)
              if (state === 'error') setState('idle')
            }}
            placeholder={direction === 'uk-es' ? 'Введіть текст тут...' : 'Escriba el texto aquí...'}
            style={{
              width: '100%',
              minHeight: 130,
              border: 'none',
              outline: 'none',
              padding: '10px 16px 16px',
              fontSize: 16,
              fontFamily: font,
              color: C.dark,
              resize: 'none',
              background: 'transparent',
              boxSizing: 'border-box',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Translate button */}
        <PrimaryBtn
          label={state === 'loading' ? 'Traduciendo...' : 'Traducir'}
          onClick={handleTranslate}
          disabled={state === 'loading'}
        />

        {/* Error card */}
        {state === 'error' && (
          <div
            style={{
              background: '#FFEBEE',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: `1px solid #FFCDD2`,
            }}
          >
            <IcErrorCircle />
            <span style={{ fontSize: 14, color: C.error, fontWeight: 600, fontFamily: font }}>
              No fue posible realizar la traducción. Introduzca texto primero.
            </span>
          </div>
        )}

        {/* Result */}
        {state === 'success' && result && (
          <div
            style={{
              background: C.white,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ padding: '14px 16px 0', fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: 0.8, fontFamily: font }}>
              {direction === 'uk-es' ? 'ESPAÑOL' : 'UCRANIANO'}
            </div>
            <div
              style={{
                padding: '10px 16px 16px',
                fontSize: 16,
                color: C.dark,
                lineHeight: 1.6,
                fontFamily: font,
              }}
            >
              {result}
            </div>
            <div style={{ height: 1, background: C.border, margin: '0 16px' }} />
            <button
              onClick={handleCopy}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: copied ? C.success : C.blue,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: font,
              }}
            >
              <IcCopy size={18} color={copied ? C.success : C.blue} />
              {copied ? 'Copiado correctamente' : 'Copiar traducción'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── SCREEN: Trámites list ──────────────────────────────────────────────────
function TramitesScreen({ onSelect }: { onSelect: (t: Tramite) => void }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: font,
      }}
    >
      {TRAMITES.map(t => (
        <div
          key={t.id}
          style={{
            background: C.white,
            borderRadius: 18,
            padding: '18px 18px 14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: C.blueLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IcDocument size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: font, letterSpacing: -0.1 }}>
                {t.title}
              </div>
              <div style={{ fontSize: 13, color: C.gray, marginTop: 3, lineHeight: 1.4, fontFamily: font }}>
                {t.description}
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelect(t)}
            style={{
              alignSelf: 'flex-end',
              padding: '9px 20px',
              borderRadius: 10,
              border: `2px solid ${C.blue}`,
              background: 'transparent',
              color: C.blue,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: font,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Ver detalles
            <svg width="14" height="14" viewBox="0 0 24 24" fill={C.blue}>
              <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

// ── SCREEN: Trámite Detail ─────────────────────────────────────────────────
function TramiteDetailScreen({ tramite, onBack }: { tramite: Tramite; onBack: () => void }) {
  return (
    <>
      <div style={{ background: C.blue, flexShrink: 0 }}>
        <StatusBar onDark />
        <AppHeader title={tramite.title} onBack={onBack} />
      </div>
      <div style={{ height: 4, background: C.yellow, flexShrink: 0 }} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px 32px',
          background: C.bg,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          fontFamily: font,
        }}
      >
        {/* Description card */}
        <div style={{ background: C.white, borderRadius: 18, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.blue, marginBottom: 10, letterSpacing: 0.2, fontFamily: font }}>
            DESCRIPCIÓN
          </h2>
          <p style={{ fontSize: 15, color: C.dark, lineHeight: 1.65, fontFamily: font }}>
            {tramite.fullDescription}
          </p>
        </div>

        {/* Requirements */}
        <div style={{ background: C.white, borderRadius: 18, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.blue, marginBottom: 14, letterSpacing: 0.2, fontFamily: font }}>
            REQUISITOS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tramite.requirements.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    background: C.blueLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <IcCheck size={14} />
                </div>
                <span style={{ fontSize: 14, color: C.dark, lineHeight: 1.5, fontFamily: font }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation */}
        <div style={{ background: C.white, borderRadius: 18, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.blue, marginBottom: 14, letterSpacing: 0.2, fontFamily: font }}>
            DOCUMENTACIÓN REQUERIDA
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tramite.documents.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    background: C.yellowLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <IcFile size={14} color="#8B6800" />
                </div>
                <span style={{ fontSize: 14, color: C.dark, lineHeight: 1.5, fontFamily: font }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <PrimaryBtn
          label="Abrir enlace oficial"
          onClick={() => window.open(tramite.link, '_blank')}
          icon={<IcExternal size={18} />}
        />
      </div>
    </>
  )
}

// ── SCREEN: Recursos ───────────────────────────────────────────────────────
function RecursosScreen() {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: font,
      }}
    >
      {RECURSOS.map(r => (
        <div
          key={r.id}
          style={{
            background: C.white,
            borderRadius: 18,
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: font, flex: 1, letterSpacing: -0.1 }}>
              {r.name}
            </div>
            <PillBadge label={r.tipo} accent={r.id % 2 === 0} />
          </div>
          <p style={{ fontSize: 13, color: C.gray, lineHeight: 1.5, fontFamily: font }}>{r.description}</p>
          <button
            onClick={() => window.open(r.link, '_blank')}
            style={{
              alignSelf: 'flex-start',
              padding: '9px 18px',
              borderRadius: 10,
              border: 'none',
              background: C.blue,
              color: C.white,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: font,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <IcExternal size={14} />
            Sitio oficial
          </button>
        </div>
      ))}
    </div>
  )
}

// ── SCREEN: Info (Trámites + Recursos tabs) ────────────────────────────────
function InfoScreen({ onSelectTramite }: { onSelectTramite: (t: Tramite) => void }) {
  const [sub, setSub] = useState<InfoSubTab>('tramites')

  return (
    <>
      {/* Sub-tab selector */}
      <div
        style={{
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          padding: '12px 16px',
          display: 'flex',
          gap: 8,
          flexShrink: 0,
          fontFamily: font,
        }}
      >
        {(['tramites', 'recursos'] as InfoSubTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setSub(tab)}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 10,
              border: 'none',
              background: sub === tab ? C.blue : C.bg,
              color: sub === tab ? C.white : C.gray,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: font,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'tramites' ? 'Trámites' : 'Recursos'}
          </button>
        ))}
      </div>

      {sub === 'tramites' ? (
        <TramitesScreen onSelect={onSelectTramite} />
      ) : (
        <RecursosScreen />
      )}
    </>
  )
}

// ── SCREEN: Settings ───────────────────────────────────────────────────────
function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<'es' | 'uk'>('es')
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal')

  const previewSize = fontSize === 'small' ? 13 : fontSize === 'normal' ? 16 : 20

  return (
    <>
      <div style={{ background: C.blue, flexShrink: 0 }}>
        <StatusBar onDark />
        <AppHeader title="Configuración" onBack={onBack} />
      </div>
      <div style={{ height: 4, background: C.yellow, flexShrink: 0 }} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: C.bg,
          padding: '20px 16px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          fontFamily: font,
        }}
      >
        {/* Language */}
        <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div
            style={{
              padding: '16px 18px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <IcLang />
            <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: font }}>Idioma de la interfaz</span>
          </div>
          <div style={{ padding: '14px 18px 18px', display: 'flex', gap: 10 }}>
            {[
              { id: 'es' as const, label: '🇪🇸  Español' },
              { id: 'uk' as const, label: '🇺🇦  Українська' },
            ].map(option => (
              <button
                key={option.id}
                onClick={() => setLang(option.id)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: 12,
                  border: lang === option.id ? `2px solid ${C.blue}` : `2px solid ${C.border}`,
                  background: lang === option.id ? C.blueLight : C.bg,
                  color: lang === option.id ? C.blue : C.medium,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: font,
                  cursor: 'pointer',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div
            style={{
              padding: '16px 18px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <IcFont />
            <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: font }}>Tamaño de fuente</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[
                { id: 'small' as const, label: 'Pequeño' },
                { id: 'normal' as const, label: 'Normal' },
                { id: 'large' as const, label: 'Grande' },
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setFontSize(option.id)}
                  style={{
                    flex: 1,
                    padding: '10px 4px',
                    borderRadius: 10,
                    border: fontSize === option.id ? `2px solid ${C.blue}` : `2px solid ${C.border}`,
                    background: fontSize === option.id ? C.blueLight : C.bg,
                    color: fontSize === option.id ? C.blue : C.medium,
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: font,
                    cursor: 'pointer',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div
              style={{
                background: C.bg,
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: previewSize,
                color: C.dark,
                fontFamily: font,
                lineHeight: 1.5,
              }}
            >
              Texto de ejemplo — Зразок тексту
            </div>
          </div>
        </div>

        {/* Sync info */}
        <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: C.successBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IcSync size={22} color={C.success} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: font }}>
                Última sincronización
              </div>
              <div style={{ fontSize: 13, color: C.gray, marginTop: 2, fontFamily: font }}>
                17 de julio de 2026, 09:15
              </div>
            </div>
          </div>
        </div>

        {/* Version */}
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <span style={{ fontSize: 12, color: C.gray, fontFamily: font }}>Ukrainian Support · Versión 1.0.0</span>
        </div>
      </div>
    </>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [navTab, setNavTab] = useState<NavTab>('home')
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const handleNavChange = (tab: NavTab, sub?: InfoSubTab) => {
    setNavTab(tab)
    setSelectedTramite(null)
    setShowSettings(false)
  }

  const handleDashboardNavigate = (tab: NavTab, sub?: InfoSubTab) => {
    setNavTab(tab)
    setSelectedTramite(null)
    setShowSettings(false)
  }

  const isFullscreen = showSplash || showSettings || selectedTramite !== null
  const showNav = !showSplash && !showSettings && !selectedTramite

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #003E8A 0%, #005BBB 40%, #0070E0 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: font,
        padding: '0',
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          height: '100dvh',
          maxHeight: 900,
          background: C.bg,
          borderRadius: window.innerWidth > 500 ? 44 : 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            window.innerWidth > 500
              ? '0 0 0 10px #111, 0 0 0 12px #333, 0 40px 80px rgba(0,0,0,0.6)'
              : 'none',
          position: 'relative',
        }}
      >
        {/* Splash */}
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

        {/* Settings overlay */}
        {!showSplash && showSettings && (
          <SettingsScreen onBack={() => setShowSettings(false)} />
        )}

        {/* Tramite detail overlay */}
        {!showSplash && !showSettings && selectedTramite && (
          <TramiteDetailScreen
            tramite={selectedTramite}
            onBack={() => setSelectedTramite(null)}
          />
        )}

        {/* Main content (hidden when overlay active) */}
        {!showSplash && !showSettings && !selectedTramite && (
          <>
            {navTab === 'home' && (
              <>
                <DashboardScreen
                  onNavigate={handleDashboardNavigate}
                  onSettings={() => setShowSettings(true)}
                />
              </>
            )}

            {navTab === 'translator' && <TranslatorScreen />}

            {navTab === 'info' && (
              <>
                <div style={{ background: C.blue, flexShrink: 0 }}>
                  <StatusBar onDark />
                  <AppHeader title="Información" />
                </div>
                <div style={{ height: 4, background: C.yellow, flexShrink: 0 }} />
                <InfoScreen onSelectTramite={t => setSelectedTramite(t)} />
              </>
            )}

            <BottomNav active={navTab} onChange={handleNavChange} />
          </>
        )}
      </div>
    </div>
  )
}
