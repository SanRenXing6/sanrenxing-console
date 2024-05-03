import * as React from "react";
import { request } from "../util/AxiosHelper";

const ProfilePage: React.FC = () => {

    const [image, setImage] = React.useState({ preview: '', data: '' })

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
            "/profiles/image",
            formData,
            true
        ).then((response) => {
            console.log(response);
        }).catch((error) => {
            const errorMessage = error?.response?.data;
            console.log(errorMessage);
        });
    }


    return (
        <div className='App'>
            <h1>Upload image</h1>
            {image.preview && <img src={image.preview} width='100' height='100' />}
            <hr></hr>
            <form onSubmit={handleSubmit}>
                <input
                    type='file'
                    name='upload-image'
                    onChange={handleFileChange}
                >
                </input>
                <button type='submit'>Submit</button>
            </form>
        </div>

    );
}

export default ProfilePage;