import {useState} from 'react';
import {Storage_Feature_Guide} from '@/const/config.const.ts';
import {t} from '@/utils/i18n.ts';
import './FeatureGuide.css';

function FeatureGuide() {
    const [visible, setVisible] = useState(() => !localStorage.getItem(Storage_Feature_Guide));

    if (!visible) return null;

    const dismiss = () => {
        localStorage.setItem(Storage_Feature_Guide, 'true');
        setVisible(false);
    };

    return (
        <div className="feature-guide">
            <h4 className="feature-guide-title">{t('featureGuideTitle')}</h4>
            <p className="feature-guide-desc">{t('featureGuideDesc')}</p>
            <button className="feature-guide-confirm" onClick={dismiss}>
                {t('featureGuideConfirm')}
            </button>
        </div>
    );
}

export default FeatureGuide;