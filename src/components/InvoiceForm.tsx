import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Invoice, InvoiceItem, Address } from '../types';
import { today, addDays, generateItemId } from '../utils/helpers';

interface Props {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onCreate: (data: Omit<Invoice, 'id' | 'total'>, asDraft: boolean) => void;
  onUpdate: (id: string, data: Omit<Invoice, 'id' | 'total'>) => void;
}

const emptyAddr = (): Address => ({ street: '', city: '', postCode: '', country: '' });
const emptyItem = (): InvoiceItem => ({ id: generateItemId(), name: '', quantity: 1, price: 0, total: 0 });

interface Errs {
  senderStreet?: string;
  clientName?: string;
  clientEmail?: string;
  description?: string;
  items?: string;
  itemName?: Record<string, string>;
  itemQty?: Record<string, string>;
  itemPrice?: Record<string, string>;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function InvoiceForm({ open, invoice, onClose, onCreate, onUpdate }: Props) {
  const isEdit = !!invoice;
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstRef  = useRef<HTMLInputElement>(null);

  const [fromStreet, setFromStreet] = useState('');
  const [fromCity,   setFromCity]   = useState('');
  const [fromPost,   setFromPost]   = useState('');
  const [fromCountry,setFromCountry]= useState('');
  const [cName,      setCName]      = useState('');
  const [cEmail,     setCEmail]     = useState('');
  const [cStreet,    setCStreet]    = useState('');
  const [cCity,      setCCity]      = useState('');
  const [cPost,      setCPost]      = useState('');
  const [cCountry,   setCCountry]   = useState('');
  const [invDate,    setInvDate]    = useState(today());
  const [terms,      setTerms]      = useState(30);
  const [desc,       setDesc]       = useState('');
  const [items,      setItems]      = useState<InvoiceItem[]>([emptyItem()]);
  const [errs,       setErrs]       = useState<Errs>({});
  const [tried,      setTried]      = useState(false);

  // Populate from invoice prop
  useEffect(() => {
    if (open && invoice) {
      setFromStreet(invoice.senderAddress.street);
      setFromCity(invoice.senderAddress.city);
      setFromPost(invoice.senderAddress.postCode);
      setFromCountry(invoice.senderAddress.country);
      setCName(invoice.clientName);
      setCEmail(invoice.clientEmail);
      setCStreet(invoice.clientAddress.street);
      setCCity(invoice.clientAddress.city);
      setCPost(invoice.clientAddress.postCode);
      setCCountry(invoice.clientAddress.country);
      setInvDate(invoice.createdAt);
      setTerms(invoice.paymentTerms);
      setDesc(invoice.description);
      setItems(invoice.items.length ? invoice.items : [emptyItem()]);
    } else if (open && !invoice) {
      setFromStreet(''); setFromCity(''); setFromPost(''); setFromCountry('');
      setCName(''); setCEmail('');
      setCStreet(''); setCCity(''); setCPost(''); setCCountry('');
      setInvDate(today()); setTerms(30); setDesc('');
      setItems([emptyItem()]);
    }
    setErrs({}); setTried(false);
  }, [open, invoice]);

  // Focus first field when opened
  useEffect(() => {
    if (open) setTimeout(() => firstRef.current?.focus(), 50);
  }, [open]);

  // ESC close + focus trap
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const els = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
      ));
      const first = els[0]; const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const validate = useCallback((): Errs => {
    const e: Errs = {};
    if (!fromStreet.trim()) e.senderStreet = 'Required';
    if (!cName.trim())      e.clientName = 'Required';
    if (!cEmail.trim())     e.clientEmail = 'Required';
    else if (!isEmail(cEmail)) e.clientEmail = 'Must be a valid email';
    if (!desc.trim())       e.description = 'Required';
    if (items.length === 0) e.items = 'An item must be added';
    const iName: Record<string,string> = {};
    const iQty:  Record<string,string> = {};
    const iPrc:  Record<string,string> = {};
    items.forEach(it => {
      if (!it.name.trim())   iName[it.id] = 'Required';
      if (it.quantity < 1)   iQty[it.id]  = '≥ 1';
      if (it.price < 0)      iPrc[it.id]  = '≥ 0';
    });
    if (Object.keys(iName).length) e.itemName  = iName;
    if (Object.keys(iQty).length)  e.itemQty   = iQty;
    if (Object.keys(iPrc).length)  e.itemPrice = iPrc;
    return e;
  }, [fromStreet, cName, cEmail, desc, items]);

  const buildData = (): Omit<Invoice, 'id' | 'total'> => ({
    senderAddress: { street: fromStreet, city: fromCity, postCode: fromPost, country: fromCountry },
    clientName: cName, clientEmail: cEmail,
    clientAddress: { street: cStreet, city: cCity, postCode: cPost, country: cCountry },
    createdAt: invDate,
    paymentTerms: terms,
    paymentDue: addDays(invDate, terms),
    description: desc,
    items: items.map(i => ({ ...i, total: i.quantity * i.price })),
    status: 'pending',
  });

  const handleSave = (asDraft = false) => {
    if (!asDraft) {
      setTried(true);
      const e = validate();
      setErrs(e);
      if (Object.keys(e).length) return;
    }
    const data = buildData();
    if (isEdit && invoice) onUpdate(invoice.id, data);
    else onCreate(data, asDraft);
  };

  const updItem = (id: string, field: keyof InvoiceItem, val: string | number) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const updated = { ...it, [field]: val };
      updated.total = updated.quantity * updated.price;
      return updated;
    }));
  };

  const hasErrs = Object.keys(errs).length > 0;

  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        className={`drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? `Edit invoice ${invoice?.id}` : 'Create new invoice'}
        aria-hidden={!open}
        id="invoice-drawer"
      >
        <div className="drawer-scroll">
        <h2 className="drawer-title">
          {isEdit ? <>Edit <span>#</span>{invoice?.id}</> : 'New Invoice'}
        </h2>

        {/* Bill From */}
        <section className="form-section" aria-label="Bill From">
          <p className="form-section-title">Bill From</p>

          <div className="form-group">
            <label className={`form-label ${errs.senderStreet && tried ? 'has-error' : ''}`} htmlFor="f-street">
              Street Address
              {tried && errs.senderStreet && <span className="form-error-inline">{errs.senderStreet}</span>}
            </label>
            <input id="f-street" ref={firstRef} className={`form-control ${tried && errs.senderStreet ? 'error' : ''}`}
              value={fromStreet} onChange={e => setFromStreet(e.target.value)}
              aria-required="true" aria-invalid={tried && !!errs.senderStreet} />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="f-city">City</label>
              <input id="f-city" className="form-control" value={fromCity} onChange={e => setFromCity(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="f-post">Post Code</label>
              <input id="f-post" className="form-control" value={fromPost} onChange={e => setFromPost(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="f-country">Country</label>
              <input id="f-country" className="form-control" value={fromCountry} onChange={e => setFromCountry(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Bill To */}
        <section className="form-section" aria-label="Bill To">
          <p className="form-section-title">Bill To</p>

          <div className="form-group">
            <label className={`form-label ${tried && errs.clientName ? 'has-error' : ''}`} htmlFor="c-name">
              Client's Name
              {tried && errs.clientName && <span className="form-error-inline">{errs.clientName}</span>}
            </label>
            <input id="c-name" className={`form-control ${tried && errs.clientName ? 'error' : ''}`}
              value={cName} onChange={e => setCName(e.target.value)}
              aria-required="true" aria-invalid={tried && !!errs.clientName} />
          </div>

          <div className="form-group">
            <label className={`form-label ${tried && errs.clientEmail ? 'has-error' : ''}`} htmlFor="c-email">
              Client's Email
              {tried && errs.clientEmail && <span className="form-error-inline">{errs.clientEmail}</span>}
            </label>
            <input id="c-email" type="email" className={`form-control ${tried && errs.clientEmail ? 'error' : ''}`}
              value={cEmail} onChange={e => setCEmail(e.target.value)}
              placeholder="e.g. email@example.com"
              aria-required="true" aria-invalid={tried && !!errs.clientEmail} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="c-street">Street Address</label>
            <input id="c-street" className="form-control" value={cStreet} onChange={e => setCStreet(e.target.value)} />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="c-city">City</label>
              <input id="c-city" className="form-control" value={cCity} onChange={e => setCCity(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="c-post">Post Code</label>
              <input id="c-post" className="form-control" value={cPost} onChange={e => setCPost(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="c-country">Country</label>
              <input id="c-country" className="form-control" value={cCountry} onChange={e => setCCountry(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Invoice details */}
        <section className="form-section" aria-label="Invoice details">
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="inv-date">Invoice Date</label>
              <input id="inv-date" type="date" className="form-control" value={invDate}
                onChange={e => setInvDate(e.target.value)} disabled={isEdit} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="inv-terms">Payment Terms</label>
              <select id="inv-terms" className="form-control" value={terms} onChange={e => setTerms(+e.target.value)}>
                <option value={1}>Net 1 Day</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className={`form-label ${tried && errs.description ? 'has-error' : ''}`} htmlFor="inv-desc">
              Project Description
              {tried && errs.description && <span className="form-error-inline">{errs.description}</span>}
            </label>
            <input id="inv-desc" className={`form-control ${tried && errs.description ? 'error' : ''}`}
              value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="e.g. Graphic Design Service"
              aria-required="true" aria-invalid={tried && !!errs.description} />
          </div>
        </section>

        {/* Items */}
        <section className="form-section" aria-label="Item list">
          <p className="items-form-title">Item List</p>

          {tried && errs.items && <p style={{ color: 'var(--red)', fontSize: 11, marginBottom: 12 }}>{errs.items}</p>}

          <div className="items-form-head" aria-hidden="true">
            <span>Item Name</span><span>Qty.</span><span>Price</span><span>Total</span><span></span>
          </div>

          {items.map((item, i) => (
            <div key={item.id} className="item-form-row" role="group" aria-label={`Item ${i + 1}`}>
              <div className="item-form-name">
                <label className="sr-only" htmlFor={`iname-${item.id}`}>Item name</label>
                <input
                  id={`iname-${item.id}`}
                  className={`form-control ${tried && errs.itemName?.[item.id] ? 'error' : ''}`}
                  value={item.name}
                  onChange={e => updItem(item.id, 'name', e.target.value)}
                  placeholder="Item Name"
                  aria-required="true"
                  aria-invalid={tried && !!errs.itemName?.[item.id]}
                  aria-label="Item name"
                />
              </div>
              <div>
                <label className="sr-only" htmlFor={`iqty-${item.id}`}>Quantity</label>
                <input
                  id={`iqty-${item.id}`}
                  type="number" min={1}
                  className={`form-control ${tried && errs.itemQty?.[item.id] ? 'error' : ''}`}
                  value={item.quantity}
                  onChange={e => updItem(item.id, 'quantity', Math.max(1, +e.target.value))}
                  aria-label="Quantity"
                />
              </div>
              <div>
                <label className="sr-only" htmlFor={`iprc-${item.id}`}>Price</label>
                <input
                  id={`iprc-${item.id}`}
                  type="number" min={0} step="0.01"
                  className={`form-control ${tried && errs.itemPrice?.[item.id] ? 'error' : ''}`}
                  value={item.price}
                  onChange={e => updItem(item.id, 'price', Math.max(0, +e.target.value))}
                  aria-label="Price"
                />
              </div>
              <div className="item-form-total">
                <p className="item-form-total-val" aria-label={`Total: ${(item.quantity * item.price).toFixed(2)}`}>
                  {(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
              <div className="item-form-del">
                <button
                  type="button" className="btn-item-delete"
                  onClick={() => setItems(p => p.filter(x => x.id !== item.id))}
                  aria-label={`Remove item ${item.name || i + 1}`}
                  disabled={items.length === 1}
                >
                  <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.47 0L9.36 .9H13v1.8H0V.9h3.63L4.52 0h3.95zM1 14.1C1 15.14 1.9 16 3 16h7c1.1 0 2-.86 2-1.9V3.6H1v10.5z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button
            type="button" className="btn-add-item"
            onClick={() => setItems(p => [...p, emptyItem()])}
          >
            + Add New Item
          </button>
        </section>

        {/* Errors */}
        {tried && hasErrs && (
          <div className="form-errors-summary" role="alert" aria-live="polite">
            <p>— All fields must be completed</p>
            {errs.items && <p>— {errs.items}</p>}
          </div>
        )}

        {/* spacer so content doesn't hide behind footer */}
        <div style={{ height: 32 }} />
        </div>{/* end drawer-scroll */}

        {/* Sticky footer — outside scroll area */}
        <div className="drawer-footer">
          {isEdit ? (
            <>
              <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-save"   onClick={() => handleSave(false)}>Save Changes</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-cancel" onClick={onClose}>Discard</button>
              <button type="button" className="btn btn-draft"  onClick={() => handleSave(true)}>Save as Draft</button>
              <button type="button" className="btn btn-save"   onClick={() => handleSave(false)}>Save &amp; Send</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
