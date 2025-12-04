import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ACTION_ICONS } from '../../../config/icons';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import './Modal.css';

function AdjustPointsModal({ children, onClose, onSave }) {
    const { t } = useLanguage();
    const [selectedChild, setSelectedChild] = useState('');
    const [points, setPoints] = useState('');
    const [description, setDescription] = useState('');

    useEscapeKey(onClose);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedChild || !points || points === '0') {
            return;
        }
        onSave({
            childId: selectedChild,
            amount: parseInt(points),
            description: description || t('parent.pointsAdjustment.defaultDescription')
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('parent.pointsAdjustment.title')}</h2>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="child">{t('modal.selectChild')}</label>
                        <select
                            id="child"
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            required
                        >
                            <option value="">{t('modal.selectChildPlaceholder')}</option>
                            {children.map((child) => (
                                <option key={child.id} value={child.id}>
                                    {child.image ? `${child.image} ` : ''}{child.name} (Current: {child.balance} {ACTION_ICONS.bonus})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="points">{t('parent.pointsAdjustment.points')}</label>
                        <input
                            type="number"
                            id="points"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            placeholder={t('parent.pointsAdjustment.pointsPlaceholder')}
                            required
                        />
                        <small>{t('parent.pointsAdjustment.pointsHint')}</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">{t('parent.pointsAdjustment.description')}</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('parent.pointsAdjustment.descriptionPlaceholder')}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="modal-button" onClick={onClose}>
                            {t('modal.cancel')}
                        </button>
                        <button type="submit" className="modal-button primary">
                            {t('modal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdjustPointsModal;