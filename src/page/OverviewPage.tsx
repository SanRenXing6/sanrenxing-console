import * as React from "react";
import { request } from "../util/AxiosHelper";
import { FaSearch } from "react-icons/fa";
import "../asset/overview.css"
import { useTranslation } from 'react-i18next';
import ProfileCard from "../component/ProfileCard";
import { getCallWebSocket, getTextWebSocket, configAsReceiver, getPeerConnection } from "../util/WebSocketHelper";
import { refreshToken } from "../util/AuthHelper";
import TextModal from "../component/TextModal";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import { dealWithResponseError } from "../util/ErrorHelper";
import CallModal from "../component/CallModal";
import { useChat } from "../context/ChatContext";

const OverviewPage: React.FC = () => {

    const { t } = useTranslation();
    const [inputValue, setInputValue] = React.useState("");
    const [skillData, setSkillData] = React.useState<any[]>([]);
    const [skillResult, setSkillResult] = React.useState<any[]>([]);
    const [profileData, setProfileData] = React.useState<any[]>([]);

    const resultsRef = React.useRef<HTMLDivElement>(null);
    const [showProfiles, setShowProfiles] = React.useState(false);
    const userId = localStorage.getItem('userId') || '';

    const textWebSocket: WebSocket = getTextWebSocket(userId);
    const callWebSocket: WebSocket = getCallWebSocket(userId);
    const peerConnection: RTCPeerConnection = getPeerConnection();

    const navigate = useNavigate();
    const { isTextModalOpen, isCallModalOpen, closeTextModal, closeCallModal, openCallModal } = useModal();
    const { updateToUserId, updateToUserName, updateToUserImageId } = useChat();

    React.useEffect(() => {
        if (!userId || userId?.length === 0) {
            navigate("/login")
        }
        // fetch skills
        request(
            "GET",
            "/skills",
            {}
        ).then((response) => {
            const data = response?.data?.map((skill: any) => skill.name);
            setSkillData(data);
        }).catch(
            error => {
                dealWithResponseError(error);
            }
        );

        const setUpWebSocket = async () => {
            configAsReceiver(callWebSocket, peerConnection, isCallModalOpen,
                openCallModal, updateToUserId, updateToUserName, updateToUserImageId);
        }
        setUpWebSocket();

    }, [refreshToken]);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            refetchProfiles(inputValue);
        }
    }

    const refetchProfiles = (text: string) => {
        setShowProfiles(true);
        request(
            "GET",
            `/search/${text}`,
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
                        profileData.map((profile: any) => {
                            if (profile?.userId !== userId) {
                                return <ProfileCard key={profile.id} data={profile} />
                            }
                        })
                    }
                </div>
            </div>
            }
            {
                isTextModalOpen &&
                <TextModal
                    onClose={closeTextModal}
                    webSocket={textWebSocket}
                />
            }
            {
                isCallModalOpen &&
                <CallModal
                    onClose={closeCallModal}
                    websocket={callWebSocket}
                    connection={peerConnection}
                />
            }
        </div>
    );
}

export default OverviewPage;
