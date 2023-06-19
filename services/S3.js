const AWS = require('aws-sdk');

function uploadToS3(data,filename){
    return new Promise((resolve,reject)=>{
        const BUCKET_NAME = 'expensetrpr';
        const IAM_USER_KEY = 'AKIATROVQVGXI4SIPMER';
        const IAM_USER_SECRET = "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";

        let s3bucket = new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET
        });

        var params ={
            Bucket : BUCKET_NAME,
            Key : filename,
            Body: data,
            ACL : 'public-read'
        };
            
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log("Something went wrong",err.message);
                reject(err)
            }else{
                console.log('Success',s3response);
                resolve(s3response.Location);
            }
        })
    }
)}

module.exports = {uploadToS3};