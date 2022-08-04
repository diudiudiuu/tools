'use strict'

const aws = require('aws-sdk')
const s3 = new aws.S3({ apiVersion: '2006-03-01' })
const node_zip = require('node-zip')
const mime = require('mime-types')

const lookup_mime = (name) => {
    console.log(name)
    const mimetype = mime.lookup(name) || 'application/octet-stream'
    console.log(mimetype)
    return mimetype
}

exports.handler = (event, context) => {
    const bucket = event.Records[0].s3.bucket.name
    const key = event.Records[0].s3.object.key

    Promise.resolve()
        .then(() => {
            return new Promise((resolve, reject) => {
                s3.getObject({
                    Bucket: bucket,
                    Key: key
                }, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            })
        })
        .then((data) => {
            const dir = key.replace(/\.zip/, '/')
            console.log("delete dir ===========", dir)
            return new Promise(async (resolve, reject) => {
                const getAndDelete = (ct = null) => {
                    s3.listObjectsV2({
                        Bucket: bucket,
                        MaxKeys: 1000,
                        ContinuationToken: ct,
                        Prefix: dir
                    })
                        .promise()
                        .then(async (data1) => {
                            console.log('data1', data1.Contents.length)
                            if (data1.Contents.length) {
                                // params for delete operation
                                let params = {
                                    Bucket: bucket,
                                    Delete: { Objects: [] },
                                }
                                // add keys to Delete Object
                                data1.Contents.forEach((content) => {
                                    params.Delete.Objects.push({ Key: content.Key })
                                })
                                console.log("delete files list =======", params)
                                // delete all keys
                                await s3.deleteObjects(params).promise()
                                // check if ct is present
                                if (data1.NextContinuationToken) {
                                    await getAndDelete(data1.NextContinuationToken)
                                } else {
                                    resolve(data)
                                }
                            } else {
                                resolve(data)
                            }

                        })
                        .catch((err1) => reject(err1))
                        
                }
                // init call
                await getAndDelete()
            })
        })
        .then((data) => {

            const zip = new node_zip(data.Body, { base64: false, checkCRC32: true })
            const dir = key.replace(/\.zip/, '/')

            console.log("create dir ===========", dir)
            return Promise.all(Object.keys(zip.files).map((i) => {
                return new Promise((resolve, reject) => {
                    const f = zip.files[i]
                    s3.putObject({
                        Bucket: bucket,
                        Key: dir + f.name,
                        Body: Buffer.from(f.asBinary(), 'binary'),
                        ContentType: lookup_mime(f.name),
                    }, (err2) => {
                        if (err2) {
                            reject(err2)
                        } else {
                            resolve()
                        }
                    })
                })
            }))
        })
        .then(() => {
            context.succeed()
        })
        .catch((err3) => {
            context.fail(err3)
        })
}
