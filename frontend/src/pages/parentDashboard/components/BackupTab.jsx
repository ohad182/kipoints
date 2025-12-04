import { ACTION_ICONS } from '../../../config/icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import './BackupTab.css';

function BackupTab({ onExport, onImport }) {
    const { t } = useLanguage();

    return (
        <div className="backup-section">
            <h2>{t('parent.tabs.backup')}</h2>

            <div className="backup-card">
                <h3>{ACTION_ICONS.download} {t('backup.export')}</h3>
                <p>{t('backup.exportDesc')}</p>
                <button className="backup-button primary" onClick={onExport}>
                    {t('backup.exportButton')}
                </button>
            </div>

            <div className="backup-card">
                <h3>{ACTION_ICONS.upload} {t('backup.import')}</h3>
                <p>{t('backup.importDesc')}</p>
                <p className="backup-warning">
                    {ACTION_ICONS.warning} {t('backup.importWarning')}
                </p>
                <input
                    type="file"
                    accept=".json"
                    onChange={onImport}
                    style={{ display: 'none' }}
                    id="import-file"
                />
                <label htmlFor="import-file" className="backup-button secondary">
                    {t('backup.importButton')}
                </label>
            </div>
        </div>
    );
}

export default BackupTab;
