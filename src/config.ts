const config = {
  apiUrl: "https://7v4pvz4tp6.execute-api.ap-southeast-1.amazonaws.com/stage/",
  Auth: {
  identityPoolId: "ap-southeast-1:586f4f4f-0cc3-4e66-9c3f-b1710b792333",
  region: "ap-southeast-1",
  userPoolId: "ap-southeast-1_5aMPcVHpm",
  userPoolWebClientId: "6hu83mm5fgr62f374110iitd4l",
  },
  Storage : {
    bucket:"mangaseed-express-api-stage-attachmentsbucket-1x0k5xei100rb",
    region: "ap-southeast-1",
    acl: "public-read",
    level: "level"
  }
}

export default config;