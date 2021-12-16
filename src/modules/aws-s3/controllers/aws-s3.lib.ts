const aws = require('aws-sdk');
const config = require('../../../config/config');
const crypto = require('crypto');

export class AwsS3 {
    private defaultBucket: string;

    constructor(defaultBucket?: string) {
        this.defaultBucket = defaultBucket ? defaultBucket : config.aws.mainSiteBucket;
    }

    
    getCanonicalizedAmzHeaders (headers) {

        var canonicalizedHeaders = [];
        var as3Header = /x-amz-/i;

        for (var header in headers) {
            // pull out amazon headers
            if (as3Header.test(header)) {
                var value = headers[header];
                if (value instanceof Array) {
                    value = value.join(',');
                }
                canonicalizedHeaders.push(header.toString().toLowerCase() + ':' + value);
            }
        }
        var res = canonicalizedHeaders.sort().join('\n')

        //end in new line if any
        if (res) {
            res += '\n';
        }

        return res;
    };

    getSignedString (stringToSign: string): string {
        var hmac = crypto.createHmac('sha1', aws.config.credentials.secretAccessKey);
        hmac.update(stringToSign);
        return hmac.digest('base64');
    };

    // returns the authorization header
    getAuthorization (digest) : string {
        return 'AWS ' + aws.config.credentials.accessKeyId + ":" + digest;
    };

    // gets the string to sign based of the headers
    getStringToSign (headers, verb, canonicalizedAmzHeaders, canonicalizedResource) {
        //create the string to sign using the syntax described in comments above

        //make sure we have a date... otherwize create one.
        var date = headers.Date || new Date().toUTCString();

        //leave off the date in the string to sign if we have the amx date
        var regex = /x-amz-date/;
        if (regex.test(canonicalizedAmzHeaders)) {
            date = '';
        }

        //make sure we have a content type
        var contentType = headers['Content-Type'] || '';

        //try with an md5
        var md5 = headers['Content-MD5'] || '';

        //create the string to sign
        let stringToSign =
            verb + "\n" +
            md5 + "\n" + 				// (optional)
            contentType + "\n" +    	// (optional)
            date + "\n" +				// only include if no x-amz-date
            canonicalizedAmzHeaders +	// can be blank
            canonicalizedResource;

        return stringToSign;

    };

    addAuthorizationHeader(headers, method, fileName, bucketName?) {
        let actualBucketName = bucketName ? bucketName : this.defaultBucket;
        let resource = '/' + actualBucketName + '/' + fileName;

        //amazon canonicalized headres (described in comments below)
        var canonicalizedAmzHeaders = this.getCanonicalizedAmzHeaders(headers);

        // get the string to sign (see comments on the method)
        var stringToSign = this.getStringToSign(headers, method, canonicalizedAmzHeaders, resource);

        //sign the headers
        var signitureOfHeaders = this.getSignedString(stringToSign);

        // set the amazon authorization header
        headers.Authorization = this.getAuthorization(signitureOfHeaders);
    };
}