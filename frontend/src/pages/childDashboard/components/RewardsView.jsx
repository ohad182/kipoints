import { useLanguage } from '../../../contexts/LanguageContext';
import { ACTION_ICONS } from '../../../config/icons';
import './RewardsView.css';

function RewardsView({ rewards, childBalance, onBuyReward }) {
    const { t } = useLanguage();

    return (
        <div className="rewards-view">
            <div className="rewards-container">
                {rewards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">{ACTION_ICONS.reward}</div>
                        <div className="empty-text">{t('child.noRewards')}</div>
                    </div>
                ) : (
                    <div className="rewards-grid">
                        {rewards.map(reward => {
                            const canAfford = childBalance >= reward.cost;
                            return (
                                <button
                                    key={reward.id}
                                    className={`reward-card ${!canAfford ? 'disabled' : ''}`}
                                    onClick={() => onBuyReward(reward)}
                                    disabled={!canAfford}
                                >
                                    <div className="reward-card-content">
                                        <div className="reward-image-large">{reward.image || ACTION_ICONS.reward}</div>
                                        <div className="reward-name">{reward.name}</div>
                                        <div className={`reward-cost ${!canAfford ? 'too-expensive' : ''}`}>
                                            {reward.cost} {ACTION_ICONS.bonus}
                                        </div>
                                        {!canAfford && (
                                            <div className="need-more">
                                                {t('child.need')} {reward.cost - childBalance} {t('child.more')}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RewardsView;