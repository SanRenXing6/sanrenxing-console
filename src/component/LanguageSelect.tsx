import React, { useState } from 'react';
import Select from 'react-select';
import i18n from '../asset/i18n';
import '../asset/header.css';

const options = [
    { value: 'en', label: 'English' },
    { value: 'zh-CN', label: '中文' },
];

const LanguageSelect: React.FC = () => {

    const defaultLanguage = options.find((op) => op.value === navigator.language);
    const [selectedOption, setSelectedOption] = useState(defaultLanguage);

    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption);
        i18n.changeLanguage(selectedOption.value)
        console.log(i18n);
    };

    return (
        <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
            className="select-language"
        />
    );
}

export default LanguageSelect;
