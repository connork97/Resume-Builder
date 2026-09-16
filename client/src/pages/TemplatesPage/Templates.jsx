import styles from "./Templates.module.css";
import { useState, useEffect } from "react";
import ResumePreviewCard from "@/features/ResumePreview/ResumePreviewCard";
import { getOfficialResumeTemplatesFromApi } from "@/services/resumeServices";
export default function Templates() {
  const [resumeTemplates, setResumeTemplates] = useState([]);

  useEffect(() => {
    // Fetch resume templates from API or other source
    const fetchTemplates = async () => {
      const templateData = await getOfficialResumeTemplatesFromApi(
        12,
        "copyCount",
      );
      console.log("template data", templateData);
      setResumeTemplates(templateData);
    };

    fetchTemplates();
  }, []);

  return (
    <div className={styles.templatesPageContainer}>
      <div className={styles.templatesPageContentWrapper}>
        <h1 className={styles.templatesPageTitle}>Templates Page</h1>
        <div className={styles.templatePreviewsGridWrapper}>
          {resumeTemplates.map((template) => (
            <ResumePreviewCard
              key={template.id}
              styling={{ height: "20rem" }}
              resumeId={template.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
