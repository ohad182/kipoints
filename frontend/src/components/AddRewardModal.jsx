import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getRewardIconArray, ACTION_ICONS } from '../config/icons';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './Modal.css';

function AddRewardModal({ isOpen, onClose, onSubmit, editData }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [image, setImage] = useState(ACTION_ICONS.reward);

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setCost(editData.cost?.toString() || '');
            setImage(editData.image || ACTION_ICONS.reward);
        } else {
            setName('');
            setCost('');
            setImage(ACTION_ICONS.reward);
        }
    }, [editData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && cost > 0) {
            onSubmit({ name, cost: parseInt(cost), image }, editData?.id);
            setName('');
            setCost('');
            setImage(ACTION_ICONS.reward);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editData ? t('modal.editReward') : t('modal.addReward')}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('modal.rewardName')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('modal.rewardName')}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('modal.cost')}</label>
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            placeholder="50"
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('modal.icon')}</label>
                        <div className="icon-selector">
                            {getRewardIconArray().map(iconOption => (
                                <button
                                    key={iconOption}
                                    type="button"
                                    className={`icon-option ${image === iconOption ? 'selected' : ''}`}
                                    onClick={() => setImage(iconOption)}
                                >
                                    {iconOption}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="modal-button secondary" onClick={onClose}>
                            {t('modal.cancel')}
                        </button>
                        <button type="submit" className="modal-button primary" disabled={!name.trim() || !cost}>
                            {editData ? t('modal.update') : t('modal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRewardModal;
