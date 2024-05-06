import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import defaultUserIcon from "../asset/profile.png";
import "../asset/profile.css";
import { request } from "../util/AxiosHelper";
import { uploadImage } from "../util/ImageHelper";
import { Skill } from "../model/Skill";
import { insert, remove } from "../util/ArrayHelper";
import { IoAddCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const ProfileForm: React.FC = () => {

    const [image, setImage] = React.useState({ preview: '', data: '' })
    const [userId, setUserId] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [needs, setNeeds] = React.useState('');
    const [skillName, setSkillName] = React.useState('');
    const [skillRate, setSkillRate] = React.useState(1);
    const [skills, setSkills] = React.useState<Skill[]>([{ name: '', rate: 1 }]);
    const [skillError, setSkillError] = React.useState('');
    const navigate = useNavigate();

    const location = useLocation();

    React.useEffect(() => {
        request(
            "GET",
            `/users/email/${location.state.email}`,
            {}
        ).then(response => {
            setUserId(response?.data?.id);
        }).catch(error => {
            console.error(error);
        });
        // initilize skills set
        setSkills([{ name: '', rate: 1 }]);
    }, [])

    const handleFileChange = (e: any) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }

    const handleDescriptionChange = (event: any) => {
        setDescription(event?.target?.value);
    }

    const handleNeedsChange = (event: any) => {
        setNeeds(event?.target?.value)
    }

    const addSkills = () => {
        if (!skillName || skillName?.length == 0) {
            setSkillError("Required!");
            return;
        } else {
            setSkillError("");
        }
        const targetIdx = skills.length - 1;
        const newSkills = insert(skills, targetIdx, { name: skillName, rate: skillRate });
        setSkills(newSkills);
        setSkillName('');
        setSkillRate(1);
    }

    const removeSkill = (id: number) => {
        const newSkills = remove(skills, id);
        setSkills(newSkills);
    }

    const handleSubmit = async () => {
        const imageId = await uploadImage(image);
        if (imageId && imageId.length > 0) {
            let savedSkills = skills;
            if (skillName && skillName.length > 0) {
                savedSkills = insert(savedSkills, savedSkills.length - 1, { name: skillName, rate: skillRate });
            }
            await addProfile(imageId, savedSkills);
        }
        navigateToOverview();
    }


    const addProfile = async (imageId: string, skills: Skill[]) => {
        await request(
            "POST",
            "/profiles",
            {
                userId: userId,
                imageId: imageId,
                description: description,
                needs: needs,
                skills: skills.slice(0, -1)
            }
        ).then(() => {
        }).catch(error => {
            console.error(error);
        })
    }

    const navigateToOverview = () => {
        navigate("/overview");
    }

    return (
        <div className="formPage">
            <div className="formContainer">
                <div className="formField">
                    {image.preview ? (<img src={image.preview} className="userIcon" alt="custom-profile" />) :
                        (<img className="userIcon" src={defaultUserIcon} alt="default-profile"></img>)}
                    <input className="uploadFile" type='file' onChange={handleFileChange} />
                </div>
                <div className="formField">
                    <label className="fieldLabel">{`Email: ${location?.state?.email}`}</label>
                </div>
                <div className="formField">
                    <label className="fieldLabel">Description:</label>
                    <textarea
                        value={description}
                        className="fieldInputMultiLine"
                        onChange={handleDescriptionChange}
                        placeholder="Self introduction"
                    />
                </div>
                <div className="formField">
                    <label className="fieldLabel">Needs:</label>
                    <textarea
                        value={needs}
                        className="fieldInputMultiLine"
                        onChange={handleNeedsChange}
                        placeholder="Describe what do you need"
                    />
                </div>
                <div className="formField">
                    <label className="fieldLabel">Skills:</label>
                    {skills?.map((item, idx) => {
                        const isLastOne = idx === skills.length - 1;
                        return (
                            <div className="skillRow" key={idx}>
                                <label className="subFieldLabel">Name:</label>
                                <input
                                    className="skillNameInput"
                                    value={isLastOne ? skillName : item?.name}
                                    disabled={!isLastOne}
                                    onChange={e => setSkillName(e.target.value)}
                                />
                                <label className="subFieldLabel">Rate(1-10):</label>
                                <input
                                    className="skillRateInput"
                                    type="number"
                                    min={1}
                                    max={10}
                                    disabled={!isLastOne}
                                    onChange={e => setSkillRate(+e.target.value)}
                                    value={isLastOne ? skillRate : item?.rate}
                                />
                                {isLastOne ?
                                    <button type="button" className="iconButton" onClick={() => addSkills()}>
                                        <IoAddCircleOutline className="addSkillIcon" />
                                    </button>
                                    :
                                    <button type="button" className="iconButton" onClick={() => removeSkill(idx)}>
                                        <IoCloseCircleOutline className="removeSkillIcon" />
                                    </button>
                                }
                            </div>
                        )
                    })}
                    <label className="skillError">{skillError}</label>
                </div>
            </div>
            <div className="profileButtons">
                <button className="save" onClick={() => handleSubmit()}>Save</button>
                <button className="skip" onClick={() => navigateToOverview()}>Skip</button>
            </div>
        </div>
    );
}

export default ProfileForm;