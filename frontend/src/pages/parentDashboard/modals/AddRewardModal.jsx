import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getRewardIconArray, ACTION_ICONS } from '../../../config/icons';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import './Modal.css';

function AddRewardModal({ isOpen, onClose, onSubmit, editData }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [image, setImage] = useState(ACTION_ICONS.reward);
    const [imagePreview, setImagePreview] = useState('');

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setCost(editData.cost?.toString() || '');
            // Support both new 'image' field and old 'icon' field for backwards compatibility
            const rewardImage = editData.image || editData.icon;
            // If image starts with data: or http, it's an uploaded image, otherwise it's an emoji
            if (rewardImage && (rewardImage.startsWith('data:') || rewardImage.startsWith('http'))) {
                setImagePreview(rewardImage);
                setImage('');
            } else {
                setImage(rewardImage || ACTION_ICONS.reward);
                setImagePreview('');
            }
        } else {
            setName('');
            setCost('');
            setImage(ACTION_ICONS.reward);
            setImagePreview('');
        }
    }, [editData, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImage(''); // Clear image selection when file is uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIconSelect = (imageOption) => {
        setImage(imageOption);
        setImagePreview(''); // Clear image preview when emoji is selected
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && cost > 0) {
            // Use uploaded image if available, otherwise use selected emoji
            const finalImage = imagePreview || image;
            onSubmit({ name, cost: parseInt(cost), image: finalImage }, editData?.id);
            setName('');
            setCost('');
            setImage(ACTION_ICONS.reward);
            setImagePreview('');
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
                        <label>{t('modal.image')}</label>
                        <div className="icon-selector">
                            {getRewardIconArray().map((imageOption, index) => (
                                <button
                                    key={`reward-image-${index}`}
                                    type="button"
                                    className={`icon-option ${image === imageOption ? 'selected' : ''}`}
                                    onClick={() => handleIconSelect(imageOption)}
                                >
                                    {imageOption}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('modal.orUploadImage')}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="reward-image-upload"
                        />
                        <label htmlFor="reward-image-upload" className="image-upload">
                            {imagePreview ? (
                                <img src={imagePreview} alt="preview" className="image-preview" />
                            ) : (
                                <div className="upload-placeholder">
                                    <span className="icon">{ACTION_ICONS.camera}</span>
                                    <p>{t('modal.uploadImage')}</p>
                                </div>
                            )}
                        </label>
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
