const mainUrl = "https://my-json-server.typicode.com/open-veezoo/editor"
function getFiletree() {
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/filetree")
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(e => reject(e));
    });
}
function getFileContents(id) {
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/files/" + id)
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(e => reject(e));
    });
}
function saveFile(id, content) {
    if (typeof content == "object") {
        content = JSON.stringify(content);
    }
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/files/" + id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
            },
            body: content
        })
        .then(response => resolve(response))
        .catch(e => reject(e));
    });
}
function deleteFile(id) {
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/files/" + id, {
            method: 'DELETE'
        })
        .then(response => resolve(response))
        .catch(e => reject(e));
    });
}

export {getFiletree, getFileContents, saveFile, deleteFile};