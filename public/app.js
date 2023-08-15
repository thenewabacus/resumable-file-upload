/*
       * @TODO :: lowest number is the highest priority
       * 1 crosscheck if the file received at server is OK
       * 2 test the upload with multiple users simultaneously 
       * 2 organise the code
       * 3 integrate it with watchIT
       *  DONE : fix the resume functionality: it should not create a new file when resuming
*/
let fileData = null;
let CHUNK_SIZE = 0;
let isResumed = true
let lastChunkIDUploaded = 0
let result = null
let plusOne = 0
// console.log(lastChunkIDUploaded)
const btnUpload = document.getElementById("btnUpload");
const divOutput = document.getElementById("divOutput");
const pauseBtn = document.getElementById("pause");

const f = document.getElementById("f");
pauseBtn.addEventListener("click", function () {
    // if (isResumed) {
    plusOne = 1

    // console.log(lastChunkIDUploaded, 'sdfsdfsd')

    isResumed = !isResumed
    // console.log('resumed', isResumed)
    if (isResumed) {
        pauseBtn.value = 'resumed'
        upload(result)
    } else {
        pauseBtn.value = 'paused'

    }
})

btnUpload.addEventListener("click", async () => {
    // console.log(lastChunkIDUploaded,'sdfsdfsd')
    result = await readFile(f);

    upload(result)
})
async function readFile(f) {
    if (!fileData) {
        const fileReader = new FileReader();
        const file = f.files[0];

        fileData = await new Promise((resolve, reject) => {
            fileReader.onload = (ev) => {
                const fileMetadata = {
                    Name: "_"+(Math.random() * 1000) + "_"+file.name,
                    Size: file.size,
                    Type: file.type,
                    theFile: ev.target.result
                };
                resolve({ fileData: ev.target.result, fileMetadata });
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsArrayBuffer(file);
        });
    }

    return fileData;
}
async function upload(file) {
    console.log('upload invoked')

    if (file.fileData.byteLength < 100 * 1024 * 1024) { //if file less than 100MB
        CHUNK_SIZE = 50000; // let the chunk size be 50 KB
        console.log('chunk A ', file.fileData.byteLength / 1000000)

    } else if (file.fileData.byteLength < 200 * 1024 * 1024) { //if the file is less than 200 MB
        CHUNK_SIZE = 100000; // let the chunk size be 100 KB
        console.log('chunk B ', file.fileData.byteLength / 1000000)

    } else if (file.fileData.byteLength < 500 * 1024 * 1024) { //if the file is less than 500 MB
        CHUNK_SIZE = 200000; // let the chunk size be 200 KB
        console.log('chunk C ', file.fileData.byteLength / 1000000)
    } else {
        CHUNK_SIZE = 500000; // let the chunk size be 500 KB
        console.log('chunk D ', file.fileData.byteLength / 1000000)
    }
    let chunkCount = Math.ceil(file.fileData.byteLength / CHUNK_SIZE);
    // console.log(file.fileMetadata.Name, 'chuunk count')
    for (let chunkId = lastChunkIDUploaded + plusOne; chunkId < chunkCount + 1; chunkId++) {
        if (isResumed) {
            const chunk = file.fileData.slice(chunkId * CHUNK_SIZE, (chunkId * CHUNK_SIZE) + CHUNK_SIZE);

            const response = await fetch("http://localhost/upload", {
                "method": "POST",
                "headers": {
                    "content-type": "application/octet-stream",
                    "content-length": chunk.byteLength,
                    "file-name": file.fileMetadata.Name
                },
                "body": chunk
            });

            if (response.status === 201) {
                lastChunkIDUploaded = chunkId;
                // console.log('lastuploadedchunkid', lastChunkIDUploaded);
                divOutput.textContent = `${lastChunkIDUploaded} uploaded out of ${chunkCount}`;
            } else {
                divOutput.textContent = `${chunkId} uploaded out of ${chunkCount}, couldn't upload further`;
            }
        } else {
            // console.log('paused');
            return;
        }
    }

}