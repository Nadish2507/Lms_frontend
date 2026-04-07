import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const leaveTypes = [
  { value: 'Casual', label: 'Casual Leave', icon: '☀️', desc: 'Personal errands & short breaks' },
  { value: 'Sick',   label: 'Sick Leave',   icon: '🤒', desc: 'Medical & health reasons' },
  { value: 'Annual', label: 'Annual Leave', icon: '✈️', desc: 'Planned vacation & travel' },
  { value: 'Unpaid', label: 'Unpaid Leave', icon: '💼', desc: 'Extended leave without pay' },
];

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'Casual', startDate: '', endDate: '', reason: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const days = form.startDate && form.endDate
    ? Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (new Date(form.endDate) < new Date(form.startDate))
      return setError('End date must be on or after start date');
    setLoading(true);
    try {
      await api.post('/leaves', form);
      setSuccess('Your leave application has been submitted!');
      setTimeout(() => navigate('/history'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const selected = leaveTypes.find(t => t.value === form.type);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition">
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-black text-white">Apply for Leave</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in the details below to submit your leave request</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl mb-6 shadow-sm">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-sm">Application Submitted!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Redirecting to your leave history...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl mb-6 shadow-sm">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Select Leave Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {leaveTypes.map(t => (
                <button key={t.value} type="button" onClick={() => setForm({ ...form, type: t.value })}
                  className={`p-4 rounded-xl border-2 text-left transition ${form.type === t.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}>
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <p className={`text-xs font-bold ${form.type === t.value ? 'text-indigo-700' : 'text-gray-700'}`}>{t.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Select Dates</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
                <input type="date" required min={form.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            {days > 0 && (
              <div className="mt-4 flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <span className="text-2xl">{selected?.icon}</span>
                <div>
                  <p className="text-sm font-bold text-indigo-700">{days} day{days > 1 ? 's' : ''} of {selected?.label}</p>
                  <p className="text-xs text-indigo-500">{new Date(form.startDate).toDateString()} → {new Date(form.endDate).toDateString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Reason for Leave</h2>
            <textarea required rows={4} placeholder="Briefly describe why you need this leave..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
              value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
            <p className="text-xs text-gray-400 mt-2">{form.reason.length}/500 characters</p>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading || !!success}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Submitting...</>
              ) : '📤 Submit Application'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')}
              className="px-6 border-2 border-gray-200 text-gray-600 py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
