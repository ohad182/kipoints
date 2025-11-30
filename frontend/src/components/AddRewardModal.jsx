import { useState, useEffect } from 'react';
import './Modal.css';

function AddRewardModal({ isOpen, onClose, onSubmit, editData }) {
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [image, setImage] = useState('🎁');

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setCost(editData.cost?.toString() || '');
            setImage(editData.image || '🎁');
        } else {
            setName('');
            setCost('');
            setImage('🎁');
        }
    }, [editData, isOpen]);

    const iconsOptions = ['🎁', '🍕', '🍦', '🍪', '🎮', '🎬', '📚', '🏆', '🎫', '🎨', '🎵', '⚽', '🎪', '🌟', '💎', '🎯'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && cost > 0) {
            onSubmit({ name, cost: parseInt(cost), image }, editData?.id);
            setName('');
            setCost('');
            setImage('🎁');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editData ? 'ערוך פרס' : 'הוסף פרס חדש'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>שם הפרס</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="הזן את שם הפרס"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>עלות בנקודות</label>
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            placeholder="הזן את עלות הפרס בנקודות"
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>בחר סמל/אמוג'י</label>
                        <div className="icon-selector">
                            {iconsOptions.map(iconOption => (
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
                            ביטול
                        </button>
                        <button type="submit" className="modal-button primary">
                            {editData ? 'עדכן פרס' : 'הוסף פרס'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRewardModal;
