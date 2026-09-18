import React from "react";
import { useSelector } from "react-redux";
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

  useEffect(() => {
    const fetchTemplates = async () => {
      const templateData = (await getOfficialResumeTemplatesFromApi(3, "copyCount")) ?? [];
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
          Hi {user.firstName || "there"}. Welcome {user.id && " back"} to
          ActuallyFreeResume.com.
        </h2>
        {/* <p className={styles.homeP}> */}
        {/* Welcome {user.id && " back"} to ActuallyFreeResume.com */}
        {/* </p> */}
        {!user.id && (
          <>
            <p className={styles.homeP}>
              New here?&nbsp; Try out our&nbsp;
              <Link className={styles.homeLink} to="/demo">
                demo
              </Link>
              &nbsp;or&nbsp;
              <Link className={styles.homeLink} to="/signup">
                create an account
              </Link>
              .
            </p>
          </>
        )}

        {/* <p className={styles.homeP}>New here?</p> */}
        {/* <Link className={styles.tryDemoButton} to='/demo'>
               New here?&nbsp;
               Try out our demo!
            </Link>
            <p className={styles.homeP} style={{margin: '1rem auto'}}>Or</p>
            <Link className={styles.tryDemoButton}>Create an Account</Link> */}
        {/* <ResumePreviews /> */}
        <div>
          <h2
            className={styles.homeH2}
            style={{
              //   fontSize: "2rem",
              //   textAlign: "center",
              marginTop: "10rem",
              //   marginBottom: "5rem",
            }}
          >
            Official Resume Templates
          </h2>
          <Link to="/browse" className={styles.templatesPageLink}>
            Browse All Resume Templates
          </Link>
          <div
            style={{
               width: '100%',
               display: "flex",
               flexWrap: "wrap",
               justifyContent: "space-evenly",
            //   display: "grid",
            //   gridTemplateColumns: "repeat(3, 1fr)",
            //   gridRowGap: "5rem",
            }}
          >
            {previewResumes.map((resume) => (
              <ResumePreviewCard
                resumeId={resume.id}
               //  styling={{ width: "75%", margin: "auto" }}
                styling={{ width: "15rem", margin: '1rem 1rem 5rem 1rem' }}
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
