import AWS from "aws-sdk";

const S3_BUCKET = "imxp-portal-uploads";
const REGION = "us-east-2";
const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});

const uploadFileToS3 = async (file: File) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: S3_BUCKET,
    Key: `uploads/${crypto.randomUUID()}-${file.name}`,
    Body: file,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

export default uploadFileToS3;
