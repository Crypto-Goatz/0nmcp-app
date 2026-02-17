/**
 * Real SVG logos for every connected service in the 0nMCP catalog.
 * Simplified, monochrome-friendly, brand-accurate paths.
 */

export function ServiceLogo({ id, size = 20, className }: { id: string; size?: number; className?: string }) {
  const Logo = LOGOS[id]
  if (!Logo) return <DefaultLogo size={size} className={className} />
  return <Logo size={size} className={className} />
}

type LogoProps = { size: number; className?: string }

function DefaultLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

function StripeLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.918 3.757 7.11c0 4.46 2.72 5.592 5.514 6.57 2.172.806 3.275 1.379 3.275 2.37 0 .923-.755 1.451-2.166 1.451-1.907 0-4.81-.932-6.782-2.135l-.893 5.536C4.112 21.846 7.039 24 12.03 24c2.588 0 4.728-.636 6.282-1.895 1.647-1.334 2.488-3.268 2.488-5.593 0-4.535-2.758-5.628-6.824-7.362z" fill="#635BFF"/>
    </svg>
  )
}

function SendGridLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M8 0h8v8h8v8h-8v8H8v-8H0V8h8V0z" fill="#1A82E2" fillRule="evenodd"/>
    </svg>
  )
}

function ResendLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M2 4h20v16H2V4zm2 2v12h16V6H4zm2 2h8v2H6V8zm0 4h12v2H6v-2z" fill="#f0f0ff" fillRule="evenodd"/>
    </svg>
  )
}

function GmailLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#EA4335" opacity="0.2"/>
      <path d="M22 6l-10 7L2 6" stroke="#EA4335" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M2 6v12h20V6" stroke="#EA4335" strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

function TwilioLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#F22F46"/>
      <circle cx="9" cy="9" r="2" fill="white"/>
      <circle cx="15" cy="9" r="2" fill="white"/>
      <circle cx="9" cy="15" r="2" fill="white"/>
      <circle cx="15" cy="15" r="2" fill="white"/>
    </svg>
  )
}

function SlackLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.52 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.52 2.522v6.312z" fill="#2EB67D"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.52 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zm0-1.271a2.527 2.527 0 0 1-2.521-2.52 2.528 2.528 0 0 1 2.521-2.521h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.52h-6.313z" fill="#ECB22E"/>
    </svg>
  )
}

function DiscordLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2"/>
    </svg>
  )
}

function ZoomLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect x="1" y="4" width="22" height="16" rx="4" fill="#2D8CFF"/>
      <path d="M5 8h8v2H5V8zm0 3h12v2H5v-2zm0 3h6v2H5v-2z" fill="white" opacity="0.8"/>
    </svg>
  )
}

function TeamsLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M20.625 5.05h-6.95v12.3h6.95c.74 0 1.35-.6 1.35-1.35V6.4c0-.74-.6-1.35-1.35-1.35z" fill="#6264A7" opacity="0.6"/>
      <rect x="2" y="3" width="14" height="18" rx="1.5" fill="#6264A7"/>
      <path d="M6.5 8h5v1.5h-5V8zm0 3h7v1.5h-7V11zm0 3h4v1.5h-4V14z" fill="white"/>
      <circle cx="19" cy="3.5" r="2.5" fill="#6264A7"/>
    </svg>
  )
}

function OpenAILogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10A37F"/>
    </svg>
  )
}

function AirtableLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M11.52 2.386l-8.97 3.293a.6.6 0 0 0-.01 1.12l9 3.44a1.2 1.2 0 0 0 .86 0l9-3.44a.6.6 0 0 0-.01-1.12l-8.97-3.293a1.2 1.2 0 0 0-.9 0z" fill="#FCB400"/>
      <path d="M12.71 11.874v9.226a.6.6 0 0 0 .82.558l9.3-3.78a.6.6 0 0 0 .38-.558V8.094a.6.6 0 0 0-.82-.558l-9.3 3.78a.6.6 0 0 0-.38.558z" fill="#18BFFF"/>
      <path d="M11.29 11.874v9.226a.6.6 0 0 1-.82.558l-9.3-3.78a.6.6 0 0 1-.38-.558V8.094a.6.6 0 0 1 .82-.558l9.3 3.78a.6.6 0 0 1 .38.558z" fill="#F82B60"/>
    </svg>
  )
}

function NotionLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.29 2.16c-.42-.326-.98-.7-2.055-.607L3.01 2.71c-.467.047-.56.28-.374.466z" fill="#f0f0ff"/>
      <path d="M5.252 6.544v13.347c0 .7.374.98 1.166.933l14.475-.84c.793-.047.886-.513.886-1.073V5.797c0-.56-.213-.84-.7-.793L5.95 5.844c-.513.047-.7.28-.7.7z" fill="#f0f0ff" opacity="0.9"/>
      <path d="M18.37 7.45c.093.42 0 .84-.42.886l-.7.14v9.874c-.607.326-1.166.513-1.633.513-.746 0-.933-.233-1.493-.933l-4.571-7.18v6.947l1.446.326s0 .84-1.166.84l-3.218.187c-.093-.187 0-.653.326-.747l.84-.233V9.31L6.04 9.17c-.093-.42.14-1.026.793-1.073l3.452-.233 4.758 7.273V8.616l-1.213-.14c-.093-.513.28-.886.746-.933z" fill="#06060f"/>
    </svg>
  )
}

function SupabaseLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M13.7 21.8c-.5.7-1.6.3-1.6-.6V13h8.7c1 0 1.6 1.2.9 2l-8 6.8z" fill="#3ECF8E" opacity="0.8"/>
      <path d="M10.3 2.2c.5-.7 1.6-.3 1.6.6V11H3.2c-1 0-1.6-1.2-.9-2l8-6.8z" fill="#3ECF8E"/>
    </svg>
  )
}

function SheetsLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="#34A853" opacity="0.2"/>
      <path d="M14 2v6h6" fill="none" stroke="#34A853" strokeWidth="1.5"/>
      <path d="M6 12h12v2H6v-2zm0 3h12v2H6v-2zm0 3h8v2H6v-2z" fill="#34A853"/>
    </svg>
  )
}

function MongoDBLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M12.546 24c-.306-.038-.52-.202-.66-.48-.156-.312-.198-.648-.21-1.002-.012-.306-.042-.612-.12-.906-.156-.6-.528-1.026-1.062-1.332-.096-.054-.078-.084-.012-.138.54-.39.87-.912.996-1.56.06-.312.042-.63-.012-.942-.15-.822-.57-1.5-1.14-2.094-.33-.342-.69-.654-1.056-.954-.24-.198-.486-.39-.72-.594-.126-.108-.162-.24-.108-.396.054-.156.162-.216.33-.216.174 0 .312.072.414.21.24.318.462.648.678.984.54.84 1.032 1.71 1.446 2.622.24.528.438 1.074.588 1.638.096.372.168.75.198 1.134.018.258.024.516-.006.774-.018.186-.054.372-.114.552-.066.186-.162.354-.306.492-.132.126-.288.21-.462.24-.072.012-.15.024-.222.036h-.342l.002-.066z" fill="#47A248"/>
      <path d="M12.546 24c.072-.012.15-.024.222-.036.174-.03.33-.114.462-.24.144-.138.24-.306.306-.492.06-.18.096-.366.114-.552.03-.258.024-.516.006-.774-.03-.384-.102-.762-.198-1.134-.15-.564-.348-1.11-.588-1.638-.414-.912-.906-1.782-1.446-2.622-.216-.336-.438-.666-.678-.984-.102-.138-.24-.21-.414-.21-.168 0-.276.06-.33.216-.054.156-.018.288.108.396.234.204.48.396.72.594.366.3.726.612 1.056.954.57.594.99 1.272 1.14 2.094.054.312.072.63.012.942-.126.648-.456 1.17-.996 1.56-.066.054-.084.084.012.138.534.306.906.732 1.062 1.332.078.294.108.6.12.906.012.354.054.69.21 1.002.14.278.354.442.66.48" fill="#47A248"/>
    </svg>
  )
}

function GitHubLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#f0f0ff"/>
    </svg>
  )
}

function LinearLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M2.51 12.787l8.703 8.703a9.961 9.961 0 0 1-3.588-1.14L2.66 15.384a9.96 9.96 0 0 1-.15-2.597zm.44-2.667l11.928 11.929a9.997 9.997 0 0 1-2.3-.718L2.95 11.702a10.056 10.056 0 0 1 0-1.582zm1.143-2.477l13.05 13.052a9.97 9.97 0 0 1-1.845-.85L4.093 11.04c0-.002-.001-.001-.001-.001a10.05 10.05 0 0 1 .002-3.396zm1.89-3.213l13.776 13.776a9.965 9.965 0 0 1-1.551-.66L5.983 5.409a10.012 10.012 0 0 1 .001-.979zm3.033-2.368l13.72 13.72a10.015 10.015 0 0 1-2.065-.398L9.017 3.72a9.993 9.993 0 0 1-.001.342zm3.585-1.498l11.734 11.735A9.981 9.981 0 0 1 24 12c0 .173-.005.345-.015.517L11.49.525c.37-.028.744-.028 1.113.039z" fill="#5E6AD2"/>
    </svg>
  )
}

function JiraLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005z" fill="#2684FF"/>
      <path d="M17.11 5.986H5.539a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057a5.218 5.218 0 0 0 5.213 5.22V6.992a1.005 1.005 0 0 0-1.005-1.006z" fill="#2684FF" opacity="0.85"/>
      <path d="M22.65.458h-11.57a5.217 5.217 0 0 0 5.23 5.215h2.13v2.057A5.215 5.215 0 0 0 23.654 13V1.463a1.005 1.005 0 0 0-1.005-1.005z" fill="#2684FF" opacity="0.7"/>
    </svg>
  )
}

function ShopifyLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.74c-.021-.126-.146-.21-.252-.21s-2.167-.148-2.167-.148-.963-.963-1.174-1.174c-.043-.042-.084-.063-.127-.084l-.798 19.917zM13.553 7.275c0-.084-.441.023-.441.023s-2.338-1.614-5.188-.315c-.945.43-1.722 1.074-2.281 1.878a8.14 8.14 0 0 0-1.068 2.477c-.696 2.6-.174 5.608 1.258 7.311.164.196.35.378.546.548l.012-.014c1.584 1.364 3.91 1.673 5.872.736a6.78 6.78 0 0 0 1.29-.811V7.275z" fill="#96BF47"/>
      <path d="M13.168 6.885c-.032-.018-.063-.035-.096-.046 0 0-.021 0-.042.007.021-.042.042-.084.063-.127a4.634 4.634 0 0 0-.766-1.12 2.882 2.882 0 0 0-.975-.756c.042.007.084.015.126.028.735.232 1.308.706 1.69 1.394v.62z" fill="#5A863E"/>
    </svg>
  )
}

function HubSpotLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M17.58 10.1V7.54a2.24 2.24 0 0 0 1.3-2.02 2.26 2.26 0 0 0-2.26-2.26 2.26 2.26 0 0 0-2.26 2.26c0 .89.52 1.66 1.28 2.02V10.1a5.1 5.1 0 0 0-2.42 1.1L7 6.8a2.41 2.41 0 0 0 .08-.6A2.4 2.4 0 1 0 4.68 8.6c.62 0 1.18-.24 1.62-.62l6.08 4.36a5.09 5.09 0 0 0-.04 6.46l-1.9 1.9a1.64 1.64 0 0 0-.48-.08 1.68 1.68 0 1 0 1.68 1.68 1.64 1.64 0 0 0-.08-.48l1.88-1.88a5.12 5.12 0 1 0 4.04-9.84z" fill="#FF7A59"/>
    </svg>
  )
}

function RocketCRMLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="#ff6b35" strokeWidth="1.5"/>
      <circle cx="12" cy="9" r="2.5" fill="#ff6b35"/>
      <path d="M12 2l-2 3h4l-2-3z" fill="#ff6b35" opacity="0.6"/>
    </svg>
  )
}

function CalendlyLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="none" stroke="#006BFF" strokeWidth="1.5"/>
      <path d="M5 10h14v10H5V10z" fill="#006BFF" opacity="0.15"/>
      <circle cx="12" cy="15" r="3" fill="#006BFF"/>
    </svg>
  )
}

function GCalLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="#4285F4" strokeWidth="1.5"/>
      <path d="M3 9h18" stroke="#4285F4" strokeWidth="1.5"/>
      <rect x="7" y="2" width="2" height="4" rx="1" fill="#4285F4"/>
      <rect x="15" y="2" width="2" height="4" rx="1" fill="#4285F4"/>
      <path d="M12 12v4l3 2" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function GDriveLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M8.207 3h7.586L24 15.6H15.793z" fill="#4285F4" opacity="0.8"/>
      <path d="M0 15.6l4.207 7.2h15.586l4.207-7.2z" fill="#34A853" opacity="0.8"/>
      <path d="M4.207 22.8L0 15.6 8.207 3l4.207 7.2z" fill="#FBBC05" opacity="0.8"/>
    </svg>
  )
}

function OneDriveLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#0078D4"/>
    </svg>
  )
}

function ZendeskLogo({ size, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M11.1 6v12L2 18V6z" fill="#03363D"/>
      <path d="M11.1 6L2 18h9.1z" fill="#03363D" opacity="0.7"/>
      <path d="M12.9 18V6l9.1 0v12z" fill="#03363D"/>
      <path d="M12.9 18L22 6H12.9z" fill="#03363D" opacity="0.7"/>
    </svg>
  )
}

const LOGOS: Record<string, (props: LogoProps) => React.ReactElement> = {
  stripe: StripeLogo,
  sendgrid: SendGridLogo,
  resend: ResendLogo,
  gmail: GmailLogo,
  twilio: TwilioLogo,
  slack: SlackLogo,
  discord: DiscordLogo,
  zoom: ZoomLogo,
  teams: TeamsLogo,
  openai: OpenAILogo,
  airtable: AirtableLogo,
  notion: NotionLogo,
  supabase: SupabaseLogo,
  sheets: SheetsLogo,
  mongodb: MongoDBLogo,
  github: GitHubLogo,
  linear: LinearLogo,
  jira: JiraLogo,
  shopify: ShopifyLogo,
  hubspot: HubSpotLogo,
  crm: RocketCRMLogo,
  calendly: CalendlyLogo,
  gcal: GCalLogo,
  gdrive: GDriveLogo,
  onedrive: OneDriveLogo,
  zendesk: ZendeskLogo,
}

export default LOGOS
