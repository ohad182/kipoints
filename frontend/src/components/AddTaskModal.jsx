import { useState, useEffect } from 'react';
import './Modal.css';

function AddTaskModal({ isOpen, onClose, onSubmit, editData }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('morning');
    const [icon, setIcon] = useState('✓');

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setCategory(editData.category || 'morning');
            setIcon(editData.icon || '✓');
        } else {
            setName('');
            setCategory('morning');
            setIcon('✓');
        }
    }, [editData, isOpen]);

    const categoryOptions = [
        { value: 'morning', label: '🌅 בוקר' },
        { value: 'afternoon', label: '☀️ צהריים' },
        { value: 'evening', label: '🌙 ערב' },
        { value: 'other', label: '⭐ אחרים' }
    ];

    const iconOptions = [
        '✓', '⭐', '🌟', '✨', '🎉', '🧹', '🍽️', '📚', '🛏️', '🧸', '🚿', 
        '🎮', '🍎', '✏️', '🏃', '⚽', '🎨', '🐶', '🦁', '🎪', '🎭', '🎵', '🏆', '🎯'];


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({ name, category, icon }, editData?.id);
            setName('');
            setCategory('morning');
            setIcon('✓');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editData ? 'ערוך משימה' : 'הוסף משימה חדשה'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>שם המשימה</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="הזן את שם המשימה"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>קטגוריה</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>בחר אייקון</label>
                        <div className="icon-selector">
                            {iconOptions.map(iconOption => (
                                <button
                                    key={iconOption}
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
                            ביטול
                        </button>
                        <button type="submit" className="modal-button primary" disabled={!name.trim()}>
                            {editData ? 'עדכן משימה' : 'הוסף משימה'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
