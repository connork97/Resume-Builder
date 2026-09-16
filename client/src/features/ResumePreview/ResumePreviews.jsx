import { getUserResumesFromApi } from "@/services/userServices";
import { getResumeFromApi, getOfficialResumeTemplatesFromApi } from "@/services/resumeServices";
import ResumePreviewCard from "./ResumePreviewCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ResumePaper from "@/features/ResumeEditor/ResumePaper/ResumePaper";

export default function ResumePreviews({ previewTemplateCount = 9 }) {
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
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginTop: '10rem', marginBottom: '5rem' }}>Official Resume Templates</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridRowGap: '5rem' }}>
        {previewResumes.map((resume) => (
          <ResumePreviewCard resumeId={resume.id} styling={{ width: '75%', margin: 'auto' }} key={resume.id} />
        ))}
      </div>
    </div>
  );
}
