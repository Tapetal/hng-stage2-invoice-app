import React, { useEffect, useRef } from 'react';

interface Props {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ invoiceId, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { cancelRef.current?.focus(); }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onCancel(); return; }
      if (e.key !== 'Tab') return;
      const modal = document.getElementById('delete-modal-inner');
      if (!modal) return;
      const els = Array.from(modal.querySelectorAll<HTMLElement>('button'));
      const first = els[0]; const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="modal" id="delete-modal-inner">
        <h2 id="modal-title">Confirm Deletion</h2>
        <p id="modal-desc">
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>? This
          action cannot be undone.
        </p>
        <div className="modal-actions">
          <button ref={cancelRef} type="button" className="btn btn-edit" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
