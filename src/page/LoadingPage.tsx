import React from 'react';
import '../asset/loading.css';

const LoadingPage = () => {
    return (
        <div className="loading-page">
            <div className="spinner"></div>
            <p className='loading-text'>Loading...</p>
        </div>
    );
}

export default LoadingPage;
