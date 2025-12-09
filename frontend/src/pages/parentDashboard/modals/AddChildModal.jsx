import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getChildIconArray, ACTION_ICONS, CHILD_ICONS } from '../../../config/icons';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import './Modal.css';

function AddChildModal({ isOpen, onClose, onSubmit, editData }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(CHILD_ICONS.boy);
    const [gender, setGender] = useState('not-set');

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setGender(editData.gender || 'not-set');
            // If image starts with data: or http, it's an uploaded image, otherwise it's an icon
            if (editData.image && (editData.image.startsWith('data:') || editData.image.startsWith('http'))) {
                setImagePreview(editData.image);
                setSelectedIcon('');
                setImage(editData.image);
            } else {
                setSelectedIcon(editData.image || CHILD_ICONS.boy);
                setImage(editData.image || CHILD_ICONS.boy);
                setImagePreview('');
            }
        } else {
            setName('');
            setImage('');
            setImagePreview('');
            setSelectedIcon(CHILD_ICONS.boy);
            setGender('not-set');
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
            onSubmit({ name, image: finalImage, gender }, editData?.id);
            setName('');
            setImage('');
            setImagePreview('');
            setSelectedIcon(CHILD_ICONS.boy);
            setGender('not-set');
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
                        <label>{t('child.gender')}</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="not-set">{t('child.notSet')}</option>
                            <option value="boy">{t('child.boy')}</option>
                            <option value="girl">{t('child.girl')}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t('modal.image')}</label>
                        <div className="icon-selector">
                            {getChildIconArray().map((iconOption, index) => (
                                <button
                                    key={`child-icon-${index}`}
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