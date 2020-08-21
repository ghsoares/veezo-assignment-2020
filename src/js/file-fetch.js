// Simple REST Api to communicate with the mock server

// The main mock server URL, all the commands after derives from this URL
const mainUrl = "https://my-json-server.typicode.com/open-veezoo/editor";
// Returns the filetree as nested objects (async)
function getFiletree() {
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/filetree")        // Request
        .then(response => response.json())  // Convert to JSON
        .then(result => resolve(result))    // Resolve the promise with the filetree
        .catch(e => reject(e));             // In case of anu error, reject the promise with the error status
    });
}
// Returns a file content by it fileId (async)
function getFileContents(id) {
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/files/" + id)     // Request
        .then(response => response.json())  // Convert to JSON
        .then(result => resolve(result))    // Resolve the promise with the contents of the file
        .catch(e => reject(e));             // In case of anu error, reject the promise with the error status
    });
}
// Save the file content by it fileId (async), this doesn't truely save the file, but
// the server returns OK code. 
function saveFile(id, content) {
    // In case the content is an object, convert to string
    if (typeof content == "object") {
        content = JSON.stringify(content);
    }
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/files/" + id, {       // Request using PUT method using its content as body
            method: 'PUT',
            body: content
        })
        .then(response => resolve(response))    // Resolve the promise with the status code
        .catch(e => reject(e));                 // In case of anu error, reject the promise with the error status
    });
}
// Delete the file by it fileId (async), this doesn't truely delete the file, but
// the server returns OK code. 
function deleteFile(id) {
    return new Promise((resolve, reject) => {
        fetch(mainUrl + "/files/" + id, {       // Request using DELETE method
            method: 'DELETE'
        })
        .then(response => resolve(response))    // Resolve the promise with the status code
        .catch(e => reject(e));                 // In case of anu error, reject the promise with the error status
    });
}

// Exports all the REST functions from this module
export {getFiletree, getFileContents, saveFile, deleteFile};