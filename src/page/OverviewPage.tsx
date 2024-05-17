import * as React from "react";
import { request } from "../util/AxiosHelper";
import { FaSearch } from "react-icons/fa";
import "../asset/overview.css"
import { useTranslation } from 'react-i18next';
import ProfileCard from "../component/ProfileCard";

const OverviewPage: React.FC = () => {
    const { t } = useTranslation();
    const [input, setInput] = React.useState("");
    const [result, setResult] = React.useState<any[]>([]);
    const [skillData, setSkillData] = React.useState<any[]>([]);
    const [profileData, setProfilesData] = React.useState<any[]>([]);
    const resultsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // fetch skills
        request(
            "GET",
            "/skills",
            {}
        ).then((response) => {
            const data = response?.data?.map((skill: any) => skill.name);
            setSkillData(data);
        });
        // fetch profiles
        request(
            "GET",
            "/profiles",
            {}
        ).then((response) => {
            setProfilesData(response?.data);
        })
    }, []);

    const handleChange = (value: string) => {
        const result = skillData.filter((skill: any) => {
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
        <div>
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
            <div className="profile-list-container">
                <div className="profile-list">
                    {
                        profileData.map((profile: any, id: any) => {
                            return <>
                                <ProfileCard data={profile} />
                            </>
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default OverviewPage;