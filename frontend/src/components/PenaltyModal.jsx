import { useState, useEffect } from 'react';
import './Modal.css';

function PenaltyModal({ isOpen, onClose, onSubmit, children }) {
  const [selectedChild, setSelectedChild] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedChild && amount && reason.trim()) {
      onSubmit({
        child_id: parseInt(selectedChild),
        action_type: 'penalty',
        amount: -Math.abs(parseInt(amount)),
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
          <h2>⚠️ הוסף קנס</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>בחר ילד</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              required
            >
              <option value="">-- בחר ילד --</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} (נקודות: {child.balance})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>מספר נקודות להורדה</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="הזן את מספר הנקודות"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>סיבת הקנס</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="הזן את סיבת הקנס"
              rows="3"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button secondary" onClick={onClose} >
              ביטול
            </button>
            <button type="submit" className="modal-button primary" style={{ backgroundColor: '#e74c3c' }}>
              הוסף קנס
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PenaltyModal;
