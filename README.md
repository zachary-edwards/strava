# Goals of this project 

1. Write access_token to a file and read from it - so I can restart the app if necessary
1. Maybe store the timestamp the token expires at?
1. Assume that if the request fails from the access_token in the file or no file exists request a new token
2. Store the athelete data in an S3 bucket or something similar
3. As this is a personal project and I don't plan on making this request public I plan on running the code periodically to update said S3 bucket
3. Maybe deploy this behind some security so I can run this on a cron, or maybe deploy on a raspberry pi that will peridocially (once a week) update the S3 bucket

## NOTES
* Access tokens are valid for 6 hours.