import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Company logo upload configuration
  companyLogo: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Authenticate the user before allowing upload
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      
      // Pass the userId as metadata for the onUploadComplete handler
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This runs on the server after the upload succeeds
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      // Return metadata that will be sent back to the client-side
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
