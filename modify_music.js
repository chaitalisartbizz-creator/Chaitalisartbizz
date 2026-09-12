const fs = require('fs');
const file = 'src/pages/admin/AdminMusic.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import handleImageUpload if not present
if (!content.includes('handleImageUpload')) {
  content = content.replace(
    "import ScrollReveal from '../../components/ScrollReveal';",
    "import ScrollReveal from '../../components/ScrollReveal';\nimport { handleImageUpload } from '../../utils/imageUpload';"
  );
}

// 2. Add uploading state
content = content.replace(
  "const [fileName, setFileName] = useState('');",
  "const [fileName, setFileName] = useState('');\n  const [isUploading, setIsUploading] = useState(false);\n  const [uploadProgress, setUploadProgress] = useState(0);"
);

// 3. Replace handleFileChange
const oldHandleFileChange = `  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // Convert to base64 for preview & saving (small files)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result; // data:audio/...;base64,...
      setPreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };`;

const newHandleFileChange = `  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await handleImageUpload(file, setUploadProgress);
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
      window.dispatchEvent(
        new CustomEvent('toast', { detail: { message: 'Failed to upload audio file.' } })
      );
    } finally {
      setIsUploading(false);
    }
  };`;

content = content.replace(oldHandleFileChange, newHandleFileChange);

// 4. Update the "Select Audio File" button to show progress
const oldUploadBtn = `<button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A84C] hover:bg-[#A8873A] text-white font-semibold rounded-xl transition-all shadow-md shadow-[#C9A84C]/20"
                  >
                    <Upload size={18} /> Select Audio File
                  </button>`;

const newUploadBtn = `<button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A84C] hover:bg-[#A8873A] disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-[#C9A84C]/20"
                  >
                    {isUploading ? (
                      <><Loader2 className="animate-spin" size={18} /> Uploading {uploadProgress}%</>
                    ) : (
                      <><Upload size={18} /> Select Audio File</>
                    )}
                  </button>`;

content = content.replace(oldUploadBtn, newUploadBtn);

fs.writeFileSync(file, content);
console.log('Done modifying AdminMusic.jsx');
