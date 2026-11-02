import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import { base44 } from "@/api/base44Client";

export default function Wysiwyg({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.multiple = true;
          input.onchange = async () => {
            const files = Array.from(input.files || []);
            const quill = quillRef.current?.getEditor();
            if (!quill) return;
            for (const file of files) {
              const res = await base44.integrations.Core.UploadFile({ file });
              await base44.entities.MediaImage.create({
                url: res.file_url, filename: file.name, size: file.size,
                contentType: file.type, uploadedAt: new Date().toISOString(),
              });
              const range = quill.getSelection(true) || { index: quill.getLength() };
              quill.insertEmbed(range.index, "image", res.file_url, "user");
              quill.setSelection(range.index + 1);
            }
          };
          input.click();
        },
      },
    },
  }), []);

  return (
    <div className="admin-quill">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Write your content here..."}
      />
    </div>
  );
}