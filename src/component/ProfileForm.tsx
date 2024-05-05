import * as React from "react";
import { useLocation } from "react-router-dom";
import defaultUserIcon from "../asset/profile.png";
import "../asset/profile.css";
import { getAuthToken, request } from "../util/AxiosHelper";

const ProfileForm: React.FC = () => {

    const [image, setImage] = React.useState({ preview: '', data: '' })
    const [imageUrl, setImageUrl] = React.useState('');
    const [userId, setUserId] = React.useState('');

    const location = useLocation();

    React.useEffect(() => {
        request(
            "GET",
            `/users/email/${location.state.email}`,
            {}
        ).then(response => {
            setUserId(response?.data?.id);
        })

    }, [])

    const handleFileChange = (e: any) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const imageId = await uploadImage();
        addProfile();
    }

    const uploadImage = (): string => {
        let formData = new FormData()
        let imageId = "";
        formData.append('file', image.data)
        request(
            "POST",
            "/images",
            formData,
            {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "multipart/form-data",
                "type": "formData"
            }
        ).then((response) => {
            imageId = response?.data;
        }).catch((error) => {
            const errorMessage = error?.response?.data;
            console.error("error:", errorMessage);
        });
        return imageId;
    }

    const addProfile = () => {

    }

    const retriveImage = async (imageId: string) => {
        request(
            "GET",
            `/images/${imageId}`,
            {},
            { "Authorization": `Bearer ${getAuthToken()}` },
            'blob'
        ).then(response => {
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
        })
            .catch((error) => {
                const errorMessage = error?.response?.data;
                console.log("error:", errorMessage);
            });
    }


    return (
        <div className="mainContainer">
            <div>
                {image.preview ? (<img src={image.preview} className="userIcon" alt="custom-profile" />) :
                    (<img className="userIcon" src={defaultUserIcon} alt="default-profile"></img>)}
                <input type='file' onChange={handleFileChange} />
            </div>
            <div>
                <div className="formItem">
                    <label className="inputLabel">{`Email: ${location?.state?.email}`}</label>
                </div>
                <div className="formItem">
                    <label className="inputLabel">Description:</label>
                    <div className="inputWithButton">
                        <input
                            className="inputBox"
                        />
                    </div>
                    <label className="errorLabel"></label>
                </div>
            </div>

        </div >

    );
}

export default ProfileForm;