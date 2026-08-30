import React, { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import { useLocale } from '../i18n';
import { useToast } from '../hooks/useToast';
import { IconCheck, IconCopy } from './icons';

export default function CopyButton({
  text,
  label,
  disabled,
  variant = 'primary',
  className = '',
}: {
  text: string;
  label?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [justCopied, setJustCopied] = useState(false);

  async function handleCopy() {
    if (!text || disabled) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setJustCopied(true);
      showToast(t.common.copied, 'success');
      window.setTimeout(() => setJustCopied(false), 1800);
    }
  }

  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !text}
      className={`${base} ${className}`}
      aria-live="polite"
    >
      {justCopied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
      {label ?? t.common.copy}
    </button>
  );
}
