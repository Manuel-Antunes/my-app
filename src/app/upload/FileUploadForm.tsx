'use client';

export default function FileUploadForm({
  url,
}: {
  url: string;
}) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const file = (e.target as HTMLFormElement).file.files?.[0]!;

        const image = await fetch(url, {
          body: file,
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        });

        const resultUrl = image.url.split("?")[0];

        window.location.href = '/uploads/' + resultUrl.split("/").pop();
      }}
    >
      <input name="file" type="file" accept="image/png, image/jpeg" />
      <button type="submit">Upload</button>
    </form>
  )
}
