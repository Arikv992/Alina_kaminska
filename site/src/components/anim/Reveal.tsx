'use client';
import { useReveal } from './useReveal';

export default function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const root = useReveal();
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
