import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Modal.css';

function AddChildModal({ isOpen, onClose, onSubmit, editData }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setImage(editData.image || '');
            setImagePreview(editData.image || '');
        } else {
            setName('');
            setImage('');
            setImagePreview('');
        }
    }, [editData, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({ name, image }, editData?.id);
            setName('');
            setImage('');
            setImagePreview('');
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
                        <label>{t('modal.chidName')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('modal.chidName')}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('modal.selectImage')}</label>
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
                                <span className="icon">📷</span>
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