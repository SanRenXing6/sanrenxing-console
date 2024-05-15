import * as React from "react";
import { request } from "../util/AxiosHelper";
import { FaSearch } from "react-icons/fa";
import "../asset/overview.css"
import { useTranslation } from 'react-i18next';

const OverviewPage: React.FC = () => {
    const { t } = useTranslation();
    const [input, setInput] = React.useState("");
    const [result, setResult] = React.useState<any[]>([]);
    const [data, setData] = React.useState<any[]>([]);
    const resultsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        request(
            "GET",
            "/skills",
            {}
        ).then((response) => {
            const data = response?.data?.map((skill: any) => skill.name);
            setData(data);
        })
    }, []);

    const handleChange = (value: string) => {
        const result = data.filter((skill: any) => {
            return skill && skill.length > 0 && skill.includes(value);
        });
        setResult(result);
        setInput(value);
    }

    const handleBlur = (event: any) => {
        if (!resultsRef?.current?.contains(event.relatedTarget)) {
            setResult([]);
        }
    }

    return (
        <div className="search-bar-container">
            <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                    placeholder={t('typeToSearch')}
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={(e) => { handleBlur(e) }}
                />
            </div>
            {result && result.length > 0 && (
                <div className="result-list" tabIndex={-1} ref={resultsRef}>
                    {result.map((result: any, id: any) => {
                        return <div key={id}
                            className="search-result"
                            onClick={() => {
                                setInput(result.trim());
                                setResult([]);
                            }}
                        >
                            {result}
                        </div>
                    })}
                </div>
            )
            }
        </div >
    );
}

export default OverviewPage;