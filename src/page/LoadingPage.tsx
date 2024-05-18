import { useTranslation } from 'react-i18next';
import '../asset/loading.css';


const LoadingPage = () => {
    const { t } = useTranslation();
    return (
        <div className="loading-page">
            <div className="spinner"></div>
            <p className='loading-text'>{t('messages.loading')}</p>
        </div>
    );
}

export default LoadingPage;
