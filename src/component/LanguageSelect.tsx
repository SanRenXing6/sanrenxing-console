import React, { useState } from 'react';
import Select from 'react-select';
import i18n from '../asset/i18n';
import '../asset/header.css';

const options = [
    { value: 'zh-CN', label: '中文' },
    { value: 'en', label: 'English' },
];

const LanguageSelect: React.FC = () => {

    const defaultLanguage = options.find((op) => op.value === navigator.language);
    const [selectedOption, setSelectedOption] = useState(defaultLanguage);

    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption);
        console.log(selectedOption.value);
        i18n.changeLanguage(selectedOption.value);
    };

    return (
        <Select
            defaultValue={options[0]}
            value={selectedOption}
            onChange={handleChange}
            options={options}
            className="select-language"
        />
    );
}

export default LanguageSelect;
