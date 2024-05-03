import * as React from "react";
import { getAuthToken, request } from "../util/AxiosHelper";

const ProfilePage: React.FC = () => {

    const [image, setImage] = React.useState({ preview: '', data: '' })
    const [imageId, setImageId] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');

    const handleFileChange = (e: any) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        let formData = new FormData()
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
            console.log("response:", response);
            setImageId(response?.data)
        }).catch((error) => {
            const errorMessage = error?.response?.data;
            console.log("error:", errorMessage);
        });
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
        <div className='App'>
            <h1>Upload image</h1>
            {image.preview && <img src={image.preview} width='100' height='100' />}
            <hr></hr>
            <form method="post" action="/upload" encType="multipart/form-data" onSubmit={handleSubmit}>
                <input
                    id="file"
                    type='file'
                    name='upload-image'
                    onChange={handleFileChange}
                >
                </input>
                <button type='submit'>Submit</button>
                <button type='button' onClick={() => retriveImage(imageId)}>Retrive</button>
            </form>
            {imageUrl ? <img src={imageUrl} alt="Loaded from server" /> : <p>Loading...</p>}
        </div>

    );
}

export default ProfilePage;