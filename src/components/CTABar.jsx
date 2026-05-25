import { Button } from '@hostaway/design-system'

export default function CTABar({ onContinue, continueLabel = 'Continue' }) {
  return (
    <div className="shrink-0 bg-white border-t border-(--color-border-secondary) px-4 py-4">
      <div className="[&>button]:w-full [&>button]:h-12">
        <Button
          data-id="cta-continue"
          color="primary"
          size="xl"
          onPress={onContinue}
        >
          {continueLabel}
        </Button>
      </div>
    </div>
  )
}
