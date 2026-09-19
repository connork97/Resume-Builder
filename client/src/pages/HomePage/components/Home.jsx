import React from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Link } from "react-router-dom";
import {
  getOfficialResumeTemplatesFromApi,
  getResumeFromApi,
} from "@/services/resumeServices";

import ResumePreviewCard from "@/features/ResumePreview/ResumePreviewCard";
import { useEffect, useState } from "react";

import styles from "./Home.module.css";

const Home = () => {
  const user = useSelector((state) => state.user);
  const [previewResumes, setPreviewResumes] = useState([]);

  const screenSize = useMediaQuery();
  const isMobile = screenSize === "mobile";

  useEffect(() => {
    const fetchTemplates = async () => {
      const templateData =
        (await getOfficialResumeTemplatesFromApi(3, "copyCount")) ?? [];
      const templates = templateData.templates ?? [];

      if (!templates.length) {
        setPreviewResumes([]);
        return;
      }

      const connorResumeIndex = templates.findIndex(
        (resume) => resume.id === 0,
      );

      if (connorResumeIndex === 0) {
        setPreviewResumes(templates);
        return;
      }

      if (connorResumeIndex > 0) {
        setPreviewResumes([
          templates[connorResumeIndex],
          ...templates.filter((_, i) => i !== connorResumeIndex),
        ]);
        return;
      }

      const connorResume = await getResumeFromApi(0);

      setPreviewResumes(
        connorResume ? [connorResume, ...templates.slice(0, -1)] : templates,
      );
    };

    fetchTemplates();
  }, []);

  return (
    <div className={styles.homePageContainer}>
      <div className={styles.homePageContent}>
        <h2 className={styles.homeH2}>
          Hi {user.firstName || "there"}. Welcome{user.id && " back"}
          {screenSize !== "desktop" ? "!" : " to ActuallyFreeResume.com."}
        </h2>
        {/* <p className={styles.homeP}> */}
        {/* Welcome {user.id && " back"} to ActuallyFreeResume.com */}
        {/* </p> */}
        {!user.id && (
          <>
            <p className={styles.newHereP}>
              <span>New here?&nbsp; </span>
              {isMobile && (
                <>
                  {/* <br /> */}
                  {/* <br /> */}
                </>
              )}{" "}
              <span>
                Try out our&nbsp;
                <Link className={styles.homeLink} to="/demo">
                  demo
                </Link>
                &nbsp;or&nbsp;
                <Link className={styles.homeLink} to="/signup">
                  create an account
                </Link>
                .
              </span>
            </p>
          </>
        )}
        <div>
          <h2 className={styles.templatesH2}>Official Resume Templates</h2>
          <Link to="/browse" className={styles.templatesPageLink}>
            Browse All Resume Templates
          </Link>
          <div className={styles.templatesWrapper}>
            {previewResumes.map((resume) => (
              <ResumePreviewCard
                resumeId={resume.id}
                //  styling={{ width: "75%", margin: "auto" }}
                width="15rem"
                styling={{ marginBottom: isMobile && "1rem"}}
                //  styling={{ width: "15rem"
                // , margin: '1rem 1rem 5rem 1rem'
                //  }}
                key={resume.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
