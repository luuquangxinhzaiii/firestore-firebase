export async function uploadPhoto(params) {
    const formData = new FormData();
    formData.append('file', params);
    formData.append('UPLOADCARE_PUB_KEY', 'd7b98aacdbe2ce4e331f');
    formData.append('filename', params.name)

    const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'multipath/form-data'
        }
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to upload photo');
    }
}