import { BrandMark } from '@/components/site/brand-mark';
import { cn } from '@/lib/utils';

type BrandLockupProps = {
  inverse?: boolean;
};

export function BrandLockup({ inverse = false }: BrandLockupProps) {
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <BrandMark className="h-8 w-8 shrink-0" inverse={inverse} />
      <span className="mt-0.5 flex flex-col items-center leading-none">
        <span
          className={cn(
            'font-heading text-[15px] font-extrabold tracking-[-0.045em]',
            inverse ? 'text-brand-ivory' : 'text-brand-navy'
          )}
        >
          UNMUTE
        </span>
        <span className="mt-0.5 text-[9px] font-extrabold tracking-[0.12em] text-brand-coral">
          DUO
        </span>
      </span>
    </span>
  );
}
