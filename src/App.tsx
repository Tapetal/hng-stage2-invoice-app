import React, { useState, useEffect, useCallback } from 'react';
import { Invoice, FilterStatus, InvoiceStatus } from './types';
import { loadInvoices, saveInvoices, loadTheme, saveTheme } from './utils/storage';
import { generateId, addDays, today } from './utils/helpers';
import Sidebar from './components/Sidebar';
import InvoiceList from './components/InvoiceList';
import InvoiceDetail from './components/InvoiceDetail';
import InvoiceForm from './components/InvoiceForm';
import DeleteModal from './components/DeleteModal';

type View = 'list' | 'detail';

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices);
  const [theme, setTheme] = useState<'light' | 'dark'>(loadTheme);
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  const selected = selectedId ? invoices.find(i => i.id === selectedId) ?? null : null;

  const handleCreate = useCallback((data: Omit<Invoice, 'id' | 'total'>, asDraft: boolean) => {
    const items = data.items.map(it => ({ ...it, total: it.quantity * it.price }));
    const total = items.reduce((s, i) => s + i.total, 0);
    const newInv: Invoice = {
      ...data, items, total, id: generateId(),
      status: asDraft ? 'draft' : 'pending',
      createdAt: data.createdAt || today(),
      paymentDue: addDays(data.createdAt || today(), data.paymentTerms),
    };
    setInvoices(p => [newInv, ...p]);
    setFormOpen(false);
  }, []);

  const handleUpdate = useCallback((id: string, data: Omit<Invoice, 'id' | 'total'>) => {
    const items = data.items.map(it => ({ ...it, total: it.quantity * it.price }));
    const total = items.reduce((s, i) => s + i.total, 0);
    setInvoices(p => p.map(inv => inv.id === id
      ? { ...inv, ...data, items, total, paymentDue: addDays(data.createdAt || today(), data.paymentTerms), status: inv.status === 'draft' ? 'pending' as InvoiceStatus : inv.status }
      : inv
    ));
    setFormOpen(false);
    setEditingInvoice(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setInvoices(p => p.filter(i => i.id !== id));
    setDeleteTarget(null);
    setView('list');
    setSelectedId(null);
  }, []);

  const handleMarkPaid = useCallback((id: string) => {
    setInvoices(p => p.map(i => i.id === id ? { ...i, status: 'paid' as InvoiceStatus } : i));
  }, []);

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  return (
    <div className="app">
      <Sidebar theme={theme} onToggleTheme={toggleTheme} />

      <main className="main" id="main-content" aria-label="Invoice management">
        <div className="page-inner">
          {view === 'list' ? (
            <InvoiceList
              invoices={filtered}
              totalCount={invoices.length}
              filter={filter}
              onFilterChange={setFilter}
              onSelect={id => { setSelectedId(id); setView('detail'); }}
              onNew={() => { setEditingInvoice(null); setFormOpen(true); }}
            />
          ) : selected ? (
            <InvoiceDetail
              invoice={selected}
              onBack={() => { setView('list'); setSelectedId(null); }}
              onEdit={() => { setEditingInvoice(selected); setFormOpen(true); }}
              onDelete={() => setDeleteTarget(selected.id)}
              onMarkPaid={() => handleMarkPaid(selected.id)}
            />
          ) : null}
        </div>
      </main>

      <InvoiceForm
        open={formOpen}
        invoice={editingInvoice}
        onClose={() => { setFormOpen(false); setEditingInvoice(null); }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {deleteTarget && (
        <DeleteModal
          invoiceId={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
