import * as React from "react";
import { request } from "../util/AxiosHelper";
import { FaSearch } from "react-icons/fa";
import "../asset/overview.css"
import { useTranslation } from 'react-i18next';
import ProfileCard from "../component/ProfileCard";

const OverviewPage: React.FC = () => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = React.useState("");
    const [skillData, setSkillData] = React.useState<any[]>([]);
    const [skillResult, setSkillResult] = React.useState<any[]>([]);
    const [profileData, setProfileData] = React.useState<any[]>([]);
    const resultsRef = React.useRef<HTMLDivElement>(null);
    const [showProfiles, setShowProfiles] = React.useState(false);

    React.useEffect(() => {
        // fetch skills
        request(
            "GET",
            "/skills",
            {}
        ).then((response) => {
            const data = response?.data?.map((skill: any) => skill.name);
            setSkillData(data);
        }).catch(error => console.log(error));
    }, []);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            refetchProfiles(inputValue);
        }
    }

    const refetchProfiles = (skill: string) => {
        setShowProfiles(true);
        request(
            "GET",
            `/search/${skill}`,
            {}
        ).then((response) => {
            setProfileData(response?.data);
        }).catch(error => console.log(error));
    }

    const handleInputChange = (value: string) => {
        const result = skillData.filter((skill: any) => {
            return skill && skill.length > 0 && skill.includes(value);
        });
        setSkillResult(result);
        setInputValue(value);
    }

    const handleInputBlur = (event: any) => {
        if (!resultsRef?.current?.contains(event.relatedTarget)) {
            setSkillResult([]);
        }
    }

    return (
        <div>
            <div className={showProfiles ? "search-bar-container-with-result" : "search-bar-container"}>
                <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                        placeholder={t('messages.typeToSearch')}
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={(e) => { handleInputBlur(e) }}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                {skillResult && skillResult.length > 0 && (
                    <div className="result-list" tabIndex={-1} ref={resultsRef}>
                        {skillResult.map((result: any, id: any) => {
                            return <div key={id}
                                className="search-result"
                                onClick={() => {
                                    setInputValue(result.trim());
                                    refetchProfiles(result.trim());
                                    setSkillResult([]);
                                }}
                            >
                                {result}
                            </div>
                        })}
                    </div>
                )
                }
            </div >
            {showProfiles && <div className="profile-list-container">
                <div className="profile-list">
                    {
                        profileData.map((profile: any, id: any) => {
                            return <ProfileCard key={id} data={profile} />
                        })
                    }
                </div>
            </div>
            }
        </div>
    );
}

export default OverviewPage;