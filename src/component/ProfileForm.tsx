import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import defaultUserIcon from "../asset/profile.png";
import "../asset/profile.css";
import { request } from "../util/AxiosHelper";
import { uploadImage } from "../util/ImageHelper";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import { Skill } from "../model/Skill";
import { insert } from "../util/ArrayHelper";

const ProfileForm: React.FC = () => {

    const [image, setImage] = React.useState({ preview: '', data: '' })
    const [userId, setUserId] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [needs, setNeeds] = React.useState('');
    const [skillName, setSkillName] = React.useState('');
    const [skillRate, setSkillRate] = React.useState(1);
    const [skills, setSkills] = React.useState<Skill[]>([{ name: '', rate: 1 }]);
    const navigate = useNavigate();

    console.log(skillName, skillRate);
    console.log(skills)

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
        const targetIdx = skills.length - 1;
        const newSkills = insert(skills, targetIdx, { name: skillName, rate: skillRate });
        setSkills(newSkills);
        setSkillName('');
        setSkillRate(1);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const imageId = await uploadImage(image);
        addProfile(imageId);
    }


    const addProfile = (imageId: string) => {
        request(
            "POST",
            "/profiles",
            {
                userId: userId,
                imageId: imageId,
                description: description,
                needs: needs,
                skills: undefined
            }
        ).then(() => {
            navigate("/overview");
        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <div className="mainContainer">
            <div>
                <div className="formItem">
                    {image.preview ? (<img src={image.preview} className="userIcon" alt="custom-profile" />) :
                        (<img className="userIcon" src={defaultUserIcon} alt="default-profile"></img>)}
                    <input type='file' onChange={handleFileChange} />
                </div>
                <div className="formItem">
                    <label className="inputLabel">{`Email: ${location?.state?.email}`}</label>
                </div>
                <div className="formItem">
                    <label className="inputLabel">Description:</label>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Self introduction"
                    />
                </div>
                <div className="formItem">
                    <label className="inputLabel">Needs:</label>
                    <textarea
                        value={needs}
                        onChange={handleNeedsChange}
                        placeholder="Describe what do you need"
                    />
                </div>
                <div className="formItem">
                    <label className="inputLabel">Skills:</label>
                    {skills?.map((item, idx) => {
                        const isLastOne = idx === skills.length - 1;
                        return (
                            <div className="skillRow" key={idx}>
                                <input
                                    value={isLastOne ? skillName : item?.name}
                                    disabled={!isLastOne}
                                    onChange={e => setSkillName(e.target.value)}
                                />
                                <NumberInput
                                    value={isLastOne ? skillRate : item?.rate}
                                    disabled={!isLastOne}
                                    min={1}
                                    max={10}
                                    onChange={(__, val) => setSkillRate(val || 1)}
                                />
                            </div>
                        )
                    })}
                    <button type="button" onClick={() => addSkills()}>
                        Add
                    </button>
                </div>
            </div>

        </div >

    );
}

export default ProfileForm;