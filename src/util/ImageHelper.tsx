import { getAuthToken, request } from "./AxiosHelper";

export const uploadImage = async (image: any): Promise<string> => {
    let formData = new FormData()
    let imageId = "";
    formData.append('file', image.data)
    await request(
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

export const retriveImage = async (imageId: string): Promise<string> => {
    let imageUrl = "";
    console.log(imageId);
    await request(
        "GET",
        `/images/${imageId}`,
        {},
        { "Authorization": `Bearer ${getAuthToken()}` },
        'blob'
    ).then(response => {
        const blob = response.data;
        imageUrl = URL.createObjectURL(blob);
    })
        .catch((error) => {
            const errorMessage = error?.response?.data;
            console.log("error:", errorMessage);
        });
    console.log(imageUrl);
    return imageUrl;
}