interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#1C2536] tracking-[-0.2px]">{title}</h2>
      <p className="text-[13px] text-[#637381] mt-0.5">{subtitle}</p>
    </div>
  );
}
