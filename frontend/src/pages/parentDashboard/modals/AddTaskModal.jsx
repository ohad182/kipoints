import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTaskIconArray, ACTION_ICONS } from '../../../config/icons';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import './Modal.css';

function AddTaskModal({ isOpen, onClose, onSubmit, editData }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('morning');
    const [icon, setIcon] = useState(ACTION_ICONS.task);
    const [completionType, setCompletionType] = useState('once');

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setCategory(editData.category || 'morning');
            setIcon(editData.icon || ACTION_ICONS.task);
            setCompletionType(editData.completion_type || 'once');
        } else {
            setName('');
            setCategory('morning');
            setIcon(ACTION_ICONS.task);
            setCompletionType('once');
        }
    }, [editData, isOpen]);

    const categoryOptions = [
        { value: 'morning', label: t('categories.morning') },// '🌅 בוקר' },
        { value: 'afternoon', label: t('categories.afternoon') },//'☀️ צהריים' },
        { value: 'evening', label: t('categories.evening') },//'🌙 ערב' },
        { value: 'other', label: t('categories.other') },//'⭐ אחרים' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({ name, category, icon, completion_type: completionType }, editData?.id);
            setName('');
            setCategory('morning');
            setIcon(ACTION_ICONS.task);
            setCompletionType('once');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editData ? t('modal.editTask') : t('modal.addTask')}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('modal.taskName')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('modal.taskName')}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('modal.category')}</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t('modal.completionType')}</label>
                        <select value={completionType} onChange={(e) => setCompletionType(e.target.value)}>
                            <option value="once">{t('modal.completionOnce')}</option>
                            <option value="multiple">{t('modal.completionMultiple')}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t('modal.icon')}</label>
                        <div className="icon-selector">
                            {getTaskIconArray().map((iconOption, index) => (
                                <button
                                    key={`task-icon-${index}`}
                                    type="button"
                                    className={`icon-option ${icon === iconOption ? 'selected' : ''}`}
                                    onClick={() => setIcon(iconOption)}
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
                        <button type="submit" className="modal-button primary" disabled={!name.trim()}>
                            {editData ? t('modal.update') : t('modal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
