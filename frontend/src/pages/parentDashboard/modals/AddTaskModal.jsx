import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTaskIconArray, ACTION_ICONS } from '../../../config/icons';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import './Modal.css';

function AddTaskModal({ isOpen, onClose, onSubmit, editData }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('morning');
    const [image, setImage] = useState(ACTION_ICONS.task);
    const [imagePreview, setImagePreview] = useState('');
    const [completionType, setCompletionType] = useState('once');

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setCategory(editData.category || 'morning');
            setCompletionType(editData.completion_type || 'once');
            // Support both new 'image' and old 'icon' field for backwards compatibility
            const taskImage = editData.image || editData.icon;
            // If image starts with data: or http, it's an uploaded image, otherwise it's an emoji
            if (taskImage && (taskImage.startsWith('data:') || taskImage.startsWith('http'))) {
                setImagePreview(taskImage);
                setImage('');
            } else {
                setImage(taskImage || ACTION_ICONS.task);
                setImagePreview('');
            }
        } else {
            setName('');
            setCategory('morning');
            setImage(ACTION_ICONS.task);
            setImagePreview('');
            setCompletionType('once');
        }
    }, [editData, isOpen]);

    const categoryOptions = [
        { value: 'morning', label: t('categories.morning') },// '🌅 בוקר' },
        { value: 'afternoon', label: t('categories.afternoon') },//'☀️ צהריים' },
        { value: 'evening', label: t('categories.evening') },//'🌙 ערב' },
        { value: 'other', label: t('categories.other') },//'⭐ אחרים' }
    ];

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
        if (name.trim()) {
            // Use uploaded image if available, otherwise use selected emoji
            const finalImage = imagePreview || image;
            onSubmit({ name, category, image: finalImage, completion_type: completionType }, editData?.id);
            setName('');
            setCategory('morning');
            setImage(ACTION_ICONS.task);
            setImagePreview('');
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
                            {getTaskIconArray().map((imageOption, index) => (
                                <button
                                    key={`task-image-${index}`}
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
                            id="task-image-upload"
                        />
                        <label htmlFor="task-image-upload" className="image-upload">
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

export default AddTaskModal;
