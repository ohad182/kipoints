import { ACTION_ICONS } from '../../../config/icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import './HistoryTab.css';

function HistoryTab({ allTransactions, onDeleteTransaction }) {
    const { t } = useLanguage();

    return (
        <div className="history-section">
            <h2>{t('parent.tabs.history')}</h2>
            {allTransactions.length === 0 ? (
                <p className="empty-message">{t('parent.emptyHistory')}</p>
            ) : (
                <div className="history-list">
                    {allTransactions.filter(t => t.is_reviewed).map(transaction => (
                        <div key={transaction.id} className="history-item">
                            <div className="transaction-info">
                                <div className="transaction-child">{transaction.child_name}</div>
                                <div className="transaction-desc">{transaction.description}</div>
                                <div className="transaction-date">
                                    {new Date(transaction.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                            <div 
                                className="transaction-amount" 
                                style={{ color: transaction.amount > 0 ? '#4caf50' : '#f44336' }}
                            >
                                {transaction.amount > 0 ? '+' : ''}{transaction.amount} {t('parent.points')}
                            </div>
                            <button
                                className="item-action-btn delete"
                                onClick={() => onDeleteTransaction(transaction.id)}
                                title={t('parent.deleteTransaction')}
                            >
                                {ACTION_ICONS.delete}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HistoryTab;