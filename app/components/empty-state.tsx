// Contextual empty-state illustrations — one SVG per page type

type Variant = "nozzles" | "fraud" | "employees" | "transactions" | "generic";

interface Props {
  variant?: Variant;
  title?: string;
  subtitle?: string;
}

// ── SVG illustrations ─────────────────────────────────────────────────────────

function NozzlesSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="24" fill="#F4F6F8" />
      {/* Pump body */}
      <rect x="38" y="30" width="44" height="60" rx="6" stroke="#C4CDD5" strokeWidth="2" fill="none" />
      {/* Screen */}
      <rect x="46" y="40" width="28" height="18" rx="3" fill="#E8F5F4" stroke="#B0C8C6" strokeWidth="1.5" />
      {/* Screen lines */}
      <line x1="50" y1="46" x2="70" y2="46" stroke="#00B4A6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="51" x2="64" y2="51" stroke="#00B4A6" strokeWidth="1" strokeLinecap="round" />
      {/* Nozzle hose */}
      <path d="M82 58 Q92 58 92 68 L92 80" stroke="#C4CDD5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Nozzle tip */}
      <rect x="88" y="80" width="8" height="14" rx="2" fill="#C4CDD5" />
      {/* Keypad dots */}
      <circle cx="50" cy="68" r="2" fill="#C4CDD5" />
      <circle cx="60" cy="68" r="2" fill="#C4CDD5" />
      <circle cx="70" cy="68" r="2" fill="#C4CDD5" />
      <circle cx="50" cy="76" r="2" fill="#C4CDD5" />
      <circle cx="60" cy="76" r="2" fill="#C4CDD5" />
      <circle cx="70" cy="76" r="2" fill="#C4CDD5" />
      {/* Wifi/signal at top */}
      <path d="M54 24 Q60 19 66 24" stroke="#00B4A6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M57 27 Q60 23.5 63 27" stroke="#00B4A6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="60" cy="30" r="1.5" fill="#00B4A6" />
    </svg>
  );
}

function FraudSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="24" fill="#F4F6F8" />
      {/* Shield */}
      <path d="M60 24 L84 34 L84 58 Q84 76 60 86 Q36 76 36 58 L36 34 Z" stroke="#C4CDD5" strokeWidth="2" fill="#FAFAFA" strokeLinejoin="round" />
      {/* Checkmark */}
      <path d="M48 58 L56 66 L72 50" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Stars / sparkle */}
      <circle cx="90" cy="32" r="3" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.5" />
      <circle cx="30" cy="44" r="2" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.5" />
      <circle cx="88" cy="76" r="2" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.5" />
    </svg>
  );
}

function EmployeesSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="24" fill="#F4F6F8" />
      {/* Person 1 */}
      <circle cx="44" cy="46" r="10" stroke="#C4CDD5" strokeWidth="2" fill="#FAFAFA" />
      <path d="M24 80 Q24 64 44 64 Q64 64 64 80" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Person 2 (behind) */}
      <circle cx="76" cy="46" r="10" stroke="#B0C8C6" strokeWidth="2" fill="#F4F6F8" />
      <path d="M56 80 Q56 64 76 64 Q96 64 96 80" stroke="#B0C8C6" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Plus badge */}
      <circle cx="90" cy="30" r="10" fill="#E8F5F4" stroke="#00B4A6" strokeWidth="1.5" />
      <line x1="90" y1="25" x2="90" y2="35" stroke="#00B4A6" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="30" x2="95" y2="30" stroke="#00B4A6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TransactionsSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="24" fill="#F4F6F8" />
      {/* Receipt */}
      <path d="M36 28 H84 V88 L78 84 L72 88 L66 84 L60 88 L54 84 L48 88 L42 84 L36 88 Z" stroke="#C4CDD5" strokeWidth="2" fill="#FAFAFA" strokeLinejoin="round" />
      {/* Lines */}
      <line x1="46" y1="44" x2="74" y2="44" stroke="#C4CDD5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46" y1="54" x2="68" y2="54" stroke="#C4CDD5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46" y1="64" x2="74" y2="64" stroke="#C4CDD5" strokeWidth="1.5" strokeLinecap="round" />
      {/* PKR symbol */}
      <text x="60" y="78" textAnchor="middle" fontSize="11" fill="#00B4A6" fontWeight="600">PKR</text>
    </svg>
  );
}

function GenericSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="24" fill="#F4F6F8" />
      <circle cx="60" cy="54" r="20" stroke="#C4CDD5" strokeWidth="2" fill="none" />
      <line x1="60" y1="54" x2="60" y2="43" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="63" r="2" fill="#C4CDD5" />
    </svg>
  );
}

const DEFAULTS: Record<Variant, { title: string; subtitle: string }> = {
  nozzles:      { title: "No nozzles registered yet",     subtitle: "Connect your first IoT nozzle device to start monitoring" },
  fraud:        { title: "No fraud alerts",               subtitle: "All clear — no suspicious dispensing events detected" },
  employees:    { title: "No employees added yet",        subtitle: "Add your first employee to manage station operations" },
  transactions: { title: "No transactions found",         subtitle: "Transactions appear here once dispensing sessions are recorded" },
  generic:      { title: "Nothing here yet",              subtitle: "Data will appear once activity is recorded" },
};

const SVGS: Record<Variant, React.FC> = {
  nozzles:      NozzlesSVG,
  fraud:        FraudSVG,
  employees:    EmployeesSVG,
  transactions: TransactionsSVG,
  generic:      GenericSVG,
};

export function EmptyState({ variant = "generic", title, subtitle }: Props) {
  const Icon = SVGS[variant];
  const defaults = DEFAULTS[variant];
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <Icon />
      <div>
        <p className="text-[15px] font-semibold text-[#1C2536]">{title ?? defaults.title}</p>
        <p className="text-[13px] text-[#919EAB] mt-1 max-w-xs mx-auto leading-relaxed">{subtitle ?? defaults.subtitle}</p>
      </div>
    </div>
  );
}
