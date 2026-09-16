import { getUserResumesFromApi } from "@/services/userServices";
import { getResumeFromApi, getOfficialResumeTemplatesFromApi } from "@/services/resumeServices";
import ResumePreviewCard from "./ResumePreviewCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ResumePaper from "@/features/ResumeEditor/ResumePaper/ResumePaper";

export default function ResumePreviews({ previewTemplateCount = 4 }) {
  const [previewResumes, setPreviewResumes] = useState([]);

//   const user = useSelector((state) => state.user);

//   const getResumes = async (userId) => {
//     const userData = await getUserResumesFromApi(userId);
//     setPreviewResumes(userData.resumes.splice(0, 4));
//   };

//   useEffect(() => {
//     if (!user.id) {
//       return;
//     }
//     getResumes(user.id);
//   }, [user]);

   useEffect(() => {
     getOfficialResumeTemplatesFromApi(previewTemplateCount).then((templates) => {
       setPreviewResumes(templates);
     });
   }, [previewTemplateCount]);

  return (
    <div>
      <h1>Resume Previews</h1>
      <div className="flexRow">
        {previewResumes.map((resume) => (
          <ResumePreviewCard resumeId={resume.id} key={resume.id} />
        ))}
      </div>
    </div>
  );
}
