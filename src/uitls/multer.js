import multer from "multer";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  file: ["application/pdf", "application/msword"],
};

export function fileUpload(validationFileUploaded = []) {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (validationFileUploaded.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("In-valid format"), false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}
