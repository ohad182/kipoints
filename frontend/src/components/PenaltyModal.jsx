import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './Modal.css';

function PenaltyModal({ isOpen, onClose, onSubmit, children }) {
  const { t } = useLanguage();
  const [selectedChild, setSelectedChild] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');

  useEscapeKey(isOpen, onClose);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedChild && reason.trim() && amount > 0) {
      onSubmit({
        child_id: parseInt(selectedChild),
        action_type: 'penalty',
        amount: -parseInt(amount),
        description: reason
      });
      setSelectedChild('');
      setReason('');
      setAmount('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚠️ {t('modal.addPenalty')}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('modal.selectChild')}</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              required
            >
              <option value="">-- {t('modal.selectChild')} --</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} ({t('child.points')}: {child.balance})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('modal.amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('modal.amount')}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('modal.reason')}</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('modal.reason')}
              rows="3"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button secondary" onClick={onClose} >
              {t('modal.cancel')}
            </button>
            <button type="submit" className="modal-button primary" disabled={!selectedChild || reason.trim()} style={{ backgroundColor: '#f44336' }}>
              {t('modal.addPenalty')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PenaltyModal;
