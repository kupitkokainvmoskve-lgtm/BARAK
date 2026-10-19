export function PlaneMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M32 6c-1.2 0-2 1.4-2 3v14L8 36v4l22-8v14l-8 6v4l10-3 10 3v-4l-8-6V32l22 8v-4L34 23V9c0-1.6-.8-3-2-3z"
      />
    </svg>
  );
}
