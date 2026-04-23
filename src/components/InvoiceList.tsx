import React, { useState, useRef, useEffect } from 'react';
import { Invoice, FilterStatus } from '../types';
import { formatDate, formatCurrency } from '../utils/helpers';

interface Props {
  invoices: Invoice[];
  totalCount: number;
  filter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
}

const STATUSES: { value: FilterStatus; label: string }[] = [
  { value: 'draft',   label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid',    label: 'Paid' },
];

export default function InvoiceList({ invoices, totalCount, filter, onFilterChange, onSelect, onNew }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function esc(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  const toggleStatus = (val: FilterStatus) => {
    onFilterChange(filter === val ? 'all' : val);
  };

  const countLabel = () => {
    if (totalCount === 0) return 'No invoices';
    if (invoices.length === 0) return `No ${filter} invoices`;
    return `There are ${totalCount} total invoice${totalCount !== 1 ? 's' : ''}`;
  };

  return (
    <>
      <header className="list-header">
        <div className="list-header-info">
          <h1>Invoices</h1>
          <p aria-live="polite">{countLabel()}</p>
        </div>

        <div className="list-header-actions">
          {/* Filter */}
          <div className="filter-wrap" ref={ref}>
            <button
              className="filter-toggle"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-haspopup="listbox"
            >
              <span className="filter-text-full">Filter by status</span>
              <span className="filter-text-short">Filter</span>
              <svg className={`filter-chevron ${open ? 'open' : ''}`} width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
                <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {open && (
              <div className="filter-dropdown" role="listbox" aria-label="Filter invoices by status">
                {STATUSES.map(s => {
                  const checked = filter === s.value;
                  return (
                    <label key={s.value} className={`filter-item ${checked ? 'checked' : ''}`} role="option" aria-selected={checked}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleStatus(s.value)}
                        aria-label={`Filter by ${s.label}`}
                      />
                      <span className="filter-checkbox-ui" aria-hidden="true">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 3.8l2.667 2.667L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="filter-item-label">{s.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* New invoice */}
          <button className="btn-new-invoice" onClick={onNew} aria-label="Create new invoice">
            <span className="btn-new-circle" aria-hidden="true">
              <span>+</span>
            </span>
            <span className="btn-new-label-full">New Invoice</span>
            <span className="btn-new-label-short">New</span>
          </button>
        </div>
      </header>

      {invoices.length === 0 ? (
        <div className="empty-state" role="status" aria-label="No invoices found">
          <div className="empty-illustration" aria-hidden="true">
            <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="121" cy="100" r="80" fill="currentColor" fillOpacity="0.04"/>
              <ellipse cx="121" cy="85" rx="48" ry="52" fill="currentColor" fillOpacity="0.06"/>
              <rect x="73" y="48" width="96" height="120" rx="8" fill="currentColor" fillOpacity="0.08"/>
              <rect x="83" y="70" width="50" height="8" rx="4" fill="currentColor" fillOpacity="0.15"/>
              <rect x="83" y="90" width="76" height="6" rx="3" fill="currentColor" fillOpacity="0.1"/>
              <rect x="83" y="108" width="60" height="6" rx="3" fill="currentColor" fillOpacity="0.1"/>
              <circle cx="121" cy="160" r="16" fill="#7C5DFA" fillOpacity="0.15"/>
              <path d="M115 160h12M121 154v12" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Nothing to see here</h2>
          <p>
            {filter !== 'all'
              ? `There are no ${filter} invoices.`
              : 'Create an invoice by clicking the New Invoice button and get started'}
          </p>
        </div>
      ) : (
        <ul className="invoice-list" role="list" aria-label="Invoice list">
          {invoices.map(inv => (
            <li key={inv.id}>
              <button
                className="invoice-card"
                onClick={() => onSelect(inv.id)}
                aria-label={`Invoice ${inv.id}, ${inv.clientName}, due ${formatDate(inv.paymentDue)}, ${formatCurrency(inv.total)}, ${inv.status}`}
              >
                <span className="ic-id"><span aria-hidden="true">#</span>{inv.id}</span>
                <span className="ic-due">Due {formatDate(inv.paymentDue)}</span>
                <span className="ic-client">{inv.clientName}</span>
                <span className="ic-amount">{formatCurrency(inv.total)}</span>
                <span className="ic-status">
                  <StatusBadge status={inv.status} />
                </span>
                <span className="ic-arrow" aria-hidden="true">
                  <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                    <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`status-badge ${status}`} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
}
