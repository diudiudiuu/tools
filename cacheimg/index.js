const axios = require("axios")
const aws = require('aws-sdk')

exports.handler = (event, context) => {

    const s3 = new aws.S3({ apiVersion: '2006-03-01' })

    let url = "https://asset.hexanft.com/assets/_thumbnail/fcf09730-8f6b-4ebb-aa45-2361244fea4e.jpg"

    let Bucket = "content"

    let Key = "bbbb.jpg"


    axios.get(url, { responseType: 'arraybuffer' }).then(response => {
        console.log(response.data)
        let stream = response.data
        let params = { Bucket, Key, Body: stream };
        s3.upload(params, (err, data) => {
            console.log(err, data);
        });
    }
    ).catch(error => {
        console.log(error)
    })
}

