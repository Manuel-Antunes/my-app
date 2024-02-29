import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { Bucket } from "sst/node/bucket";
import FileUploadForm from "./FileUploadForm";


export default async function Upload() {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: `uploads/${crypto.randomUUID()}`,
    Bucket: Bucket.sla.bucketName,
  });
  const url = await getSignedUrl(new S3Client({}), command);

  return (
    <main>
      <FileUploadForm url={url} />
    </main>
  );
}