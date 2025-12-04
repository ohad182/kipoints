import { useLanguage } from '../../../contexts/LanguageContext';
import './ReviewTab.css';

function ReviewTab({ pendingTransactions, onReviewTransaction, onReviewAll }) {
    const { t } = useLanguage();

    return (
        <div className="review-section">
            <div className="review-header">
                <h2>{t('parent.tabs.review')}</h2>
                {pendingTransactions.length > 0 && (
                    <div className="review-bulk-actions">
                        <button
                            className="approve-all-button"
                            onClick={() => onReviewAll(true)}
                        >
                            {t('parent.approveAll')}
                        </button>
                        <button
                            className="reject-all-button"
                            onClick={() => onReviewAll(false)}
                        >
                            {t('parent.rejectAll')}
                        </button>
                    </div>
                )}
            </div>
            {pendingTransactions.length === 0 ? (
                <p className="empty-message">{t('parent.emptyPending')}</p>
            ) : (
                <div className="pending-list">
                    {pendingTransactions.map(transaction => (
                        <div key={transaction.id} className="pending-item">
                            <div className="pending-info">
                                <strong>{transaction.child_name}</strong>
                                <span>{transaction.description}</span>
                                <span className={transaction.amount > 0 ? 'positive' : 'negative'}>
                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} {t('parent.points')}
                                </span>
                                <span className="timestamp">
                                    {new Date(transaction.timestamp).toLocaleString('he-IL')}
                                </span>
                            </div>
                            <div className="pending-actions">
                                <button
                                    className="approve-button"
                                    onClick={() => onReviewTransaction(transaction.id, true)}
                                >
                                    {t('parent.approve')}
                                </button>
                                <button
                                    className="reject-button"
                                    onClick={() => onReviewTransaction(transaction.id, false)}
                                >
                                    {t('parent.reject')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewTab;