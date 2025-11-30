import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSelector.css';

function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    const languages = {
        he: {name: 'עברית', flag: 'IL' },
        en: {name: 'English', flag: 'US' },
    };

    return (
        <div className="language-selector">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-dropdown"
            >
                {Object.entries(languages).map(([code, {name, flag }]) =>(
                    <option key={code} value={code}>
                        {flag} {name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelector;