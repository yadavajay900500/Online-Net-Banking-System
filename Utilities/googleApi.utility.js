const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = '948757131173-r1njcsrh3hgahdfmeqqli0h5tuu1ns9t.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

// const REFRESH_TOKEN = '1//04OfBSJsGrP2FCgYIARAAGAQSNwF-L9Irve5G19O_uh5mFuF9ITCv-ynaPjlxug5Vvko3NsnEpCLBG230K0IvmMz6g_6BwLHJRSo';
const REFRESH_TOKEN = "1//04BSdvUcokVRgCgYIARAAGAQSNwF-L9IrAZ05PNg6WgVuseXXcSWtWToImeWTEorFaEt4RvdSp_loEIGFGoNHnXS_AndD43EiXHE";

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

exports.googleDrive = async (x) => {
    try {
        const studentImage = x.path
        //console.log("jhvsg >>>>>", studentImage)
        const filePath = await path.join(__dirname, `../${studentImage}`);
        //console.log("AAAA", x)
        const response = await drive.files.create({
            requestBody: {
                name: `${x.filename}`, //This can be name of your choice
                mimeType: 'image/jpg',
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath),
            },
        });

        //console.log(response.data);
    } catch (error) {
       // console.log(error.message);
    }
}

exports.deleteFile=async()=> {
    try {
      const response = await drive.files.delete({
        fileId: 'YOUR FILE ID',
      });
      console.log(response.data, response.status);
    } catch (error) {
      console.log("error in googleApi.utility.js File",error.message);
    }
  }
  
  // deleteFile();
exports.generatePublicUrl=async()=> {
    try {
      const fileId = '12vBMduX73Ihwomf6R9yqESRHi7078pKH';
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      ///console.log("eeeeeee",result)
      const {data}=result
     // console.log("gooogle Api",data);
      return await data;
    } catch (error) {
      console.log("error in googleApi.utility.js File",error.message);
    }
   // return await data;
  }
  
  // generatePublicUrl();