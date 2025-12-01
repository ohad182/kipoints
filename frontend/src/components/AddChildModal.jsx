import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getChildIconArray, ACTION_ICONS, CHILD_ICONS } from '../config/icons';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './Modal.css';

function AddChildModal({ isOpen, onClose, onSubmit, editData }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(CHILD_ICONS.boy);

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setImage(editData.image || '');
            setImagePreview(editData.image || '');
            // If image starts with data: or http, it's an uploaded image, otherwise it's an icon
            if (editData.image && !editData.image.startsWith('data:') && !editData.image.startsWith('http')) {
                setSelectedIcon(editData.image);
            }
        } else {
            setName('');
            setImage('');
            setImagePreview('');
            setSelectedIcon(CHILD_ICONS.boy);
        }
    }, [editData, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setImagePreview(reader.result);
                setSelectedIcon(''); // Clear icon selection when image is uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIconSelect = (icon) => {
        setSelectedIcon(icon);
        setImage(icon); // Set image to the emoji
        setImagePreview(''); // Clear image preview
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            // Use uploaded image if available, otherwise use selected icon
            const finalImage = imagePreview || selectedIcon;
            onSubmit({ name, image: finalImage }, editData?.id);
            setName('');
            setImage('');
            setImagePreview('');
            setSelectedIcon(CHILD_ICONS.boy);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editData ? t('modal.editChild') : t('modal.addChild')}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('modal.childName')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('modal.childName')}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('modal.icon')}</label>    
                        <div className="icon-selector">
                            {getChildIconArray().map(iconOption => (
                                <button
                                  key={iconOption}
                                  type="button"
                                  className={`icon-option ${selectedIcon === iconOption ? 'selected' : ''}`}
                                  onClick={() => handleIconSelect(iconOption)}
                                >
                                    {iconOption}
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
                            id="child-image-upload"
                        />
                        <label htmlFor="child-image-upload" className="image-upload">
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
                        <button type="submit" className="modal-button primary" disabled={!name.trim()}>
                            {editData ? t('modal.update') : t('modal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AddChildModal;