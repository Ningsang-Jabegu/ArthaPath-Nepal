'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Modal } from './modal';
import { Button } from './button';

interface RiskWarningModalProps {
  isOpen: boolean;
  onAcknowledge: () => void;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function RiskWarningModal({
  isOpen,
  onAcknowledge,
  onClose,
  title = 'Investment Risk Warning',
  message = 'High-risk investments can result in significant losses, including partial or complete loss of capital.',
}: RiskWarningModalProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAcknowledge = () => {
    if (!accepted) {
      return;
    }
    onAcknowledge();
    setAccepted(false);
  };

  const handleClose = () => {
    onClose();
    setAccepted(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      footer={(
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAcknowledge} disabled={!accepted}>
            I Understand
          </Button>
        </>
      )}
    >
      <div className="space-y-(--spacing-md)">
        <p className="text-body text-(--color-text-primary)">{message}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-(--color-text-secondary)">
          <li>Returns are projections, not promises.</li>
          <li>Past performance does not guarantee future outcomes.</li>
          <li>Consider consulting a licensed financial professional.</li>
        </ul>
        <label className="flex items-start gap-(--spacing-sm) rounded border border-(--color-border) p-(--spacing-sm)">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-(--color-text-primary)">
            I acknowledge these risks and want to continue.
          </span>
        </label>
        <p className="text-xs text-(--color-text-secondary)">
          See full details in our <Link href="/disclaimer" className="underline">Disclaimer</Link> and <Link href="/terms" className="underline">Terms of Service</Link>.
        </p>
      </div>
    </Modal>
  );
}
