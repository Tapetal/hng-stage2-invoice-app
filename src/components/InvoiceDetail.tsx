import React from 'react';
import { Invoice } from '../types';
import { formatDate, formatCurrency } from '../utils/helpers';
import { StatusBadge } from './InvoiceList';

interface Props {
  invoice: Invoice;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkPaid: () => void;
}

export default function InvoiceDetail({ invoice, onBack, onEdit, onDelete, onMarkPaid }: Props) {
  const isPaid    = invoice.status === 'paid';
  const isPending = invoice.status === 'pending';
  const canEdit   = !isPaid;

  return (
    <>
      <button className="btn-back" onClick={onBack} aria-label="Go back to invoice list">
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
          <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Go back
      </button>

      {/* Status bar */}
      <div className="detail-status-bar">
        <div className="status-bar-left">
          <span>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        {/* Desktop actions */}
        <div className="detail-actions" aria-label="Invoice actions" role="toolbar">
          <ActionButtons canEdit={canEdit} isPending={isPending} onEdit={onEdit} onDelete={onDelete} onMarkPaid={onMarkPaid} />
        </div>
      </div>

      {/* Main card */}
      <article className="detail-card" aria-label={`Invoice ${invoice.id} details`}>
        {/* Top */}
        <div className="detail-top">
          <div>
            <p className="detail-invoice-id"><span>#</span>{invoice.id}</p>
            <p className="detail-description">{invoice.description}</p>
          </div>
          <address className="sender-address" aria-label="Sender address">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </address>
        </div>

        {/* Info grid */}
        <div className="detail-grid">
          <div>
            <p className="detail-label">Invoice Date</p>
            <time className="detail-val" dateTime={invoice.createdAt}>{formatDate(invoice.createdAt)}</time>
          </div>
          <div>
            <p className="detail-label">Payment Due</p>
            <time className="detail-val" dateTime={invoice.paymentDue}>{formatDate(invoice.paymentDue)}</time>
          </div>
          <div>
            <p className="detail-label">Bill To</p>
            <p className="detail-val">{invoice.clientName}</p>
            <address aria-label="Client address">
              <p className="detail-val-sm">{invoice.clientAddress.street}</p>
              <p className="detail-val-sm">{invoice.clientAddress.city}</p>
              <p className="detail-val-sm">{invoice.clientAddress.postCode}</p>
              <p className="detail-val-sm">{invoice.clientAddress.country}</p>
            </address>
          </div>
          <div>
            <p className="detail-label">Sent To</p>
            <p className="detail-val-email">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items */}
        <div className="items-table" role="table" aria-label="Invoice items">
          <div className="items-head" role="row" aria-hidden="true">
            <span>Item Name</span>
            <span className="text-right">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          {invoice.items.map(item => (
            <div key={item.id} className="item-row" role="row">
              <div>
                <p className="item-name">{item.name}</p>
                <p className="item-qty-price">{item.quantity} × {formatCurrency(item.price)}</p>
              </div>
              <p className="item-qty" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</p>
              <p className="item-price" aria-label={`Price: ${formatCurrency(item.price)}`}>{formatCurrency(item.price)}</p>
              <p className="item-total" aria-label={`Total: ${formatCurrency(item.total)}`}>{formatCurrency(item.total)}</p>
            </div>
          ))}

          <div className="items-total">
            <span className="items-total-label">Amount Due</span>
            <span className="items-total-amount" aria-label={`Total amount: ${formatCurrency(invoice.total)}`}>
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </article>

      {/* Mobile action bar */}
      <div className="mobile-actions" role="toolbar" aria-label="Invoice actions">
        <ActionButtons canEdit={canEdit} isPending={isPending} onEdit={onEdit} onDelete={onDelete} onMarkPaid={onMarkPaid} />
      </div>
    </>
  );
}

function ActionButtons({ canEdit, isPending, onEdit, onDelete, onMarkPaid }: {
  canEdit: boolean; isPending: boolean;
  onEdit: () => void; onDelete: () => void; onMarkPaid: () => void;
}) {
  return (
    <>
      {canEdit && (
        <button className="btn btn-edit" onClick={onEdit} aria-label="Edit invoice">Edit</button>
      )}
      <button className="btn btn-delete" onClick={onDelete} aria-label="Delete invoice">Delete</button>
      {isPending && (
        <button className="btn btn-paid" onClick={onMarkPaid} aria-label="Mark invoice as paid">Mark as Paid</button>
      )}
    </>
  );
}
