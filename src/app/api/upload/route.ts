import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const S3_BUCKET = "imxp-portal-uploads";
const REGION = "us-east-2";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File must be less than 5MB" }, { status: 400 });
    }

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      console.error("Missing AWS credentials in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region: REGION,
    });

    const fileName = file instanceof File ? file.name : "upload";
    const buffer = Buffer.from(await file.arrayBuffer());

    const params = {
      Bucket: S3_BUCKET,
      Key: `uploads/${crypto.randomUUID()}-${fileName}`,
      Body: buffer,
      ACL: "public-read",
      ContentType: file.type,
    };

    const data = await s3.upload(params).promise();
    return NextResponse.json({ url: data.Location });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
