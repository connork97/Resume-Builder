import styles from "./Templates.module.css";
import { useState, useEffect } from "react";
import ResumePreviewCard from "@/features/ResumePreview/ResumePreviewCard";
import {
  getOfficialResumeTemplatesFromApi,
  getResumesBySearchFromApi,
} from "@/services/resumeServices";
import { MdArrowDropDown } from "react-icons/md";
export default function Templates() {
  // ! Convert to URL Params/Routing
  // ! Look into storage of resume templates to prevent unnecessary additional requests

  const templatesPerPage = 8;
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [offset, setOffset] = useState(0);
  const [resumeTemplates, setResumeTemplates] = useState([]);
  const [sortBy, setSortBy] = useState("copyCount");
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTemplates = async () => {
    const templateData = await getResumesBySearchFromApi(
      searchQuery,
      sortBy,
      templatesPerPage,
      offset,
      ["officialTemplate"],
    );
    console.log("template data", templateData);
    setResumeTemplates(templateData.results ?? []);
    setTotalTemplates(templateData.totalCount ?? 0);
  };
  useEffect(() => {
    fetchTemplates();
  }, [offset, sortBy]);

  return (
    <div className={styles.templatesPageContainer}>
      <div className={styles.templatesPageContentWrapper}>
        <h1 className={styles.templatesPageTitle}>Resume Browsing Page</h1>
        <div className={styles.resumeSearchWrapper}>
          <form className={styles.resumeSearchForm} onSubmit={(e) => { e.preventDefault(); setOffset(0); fetchTemplates(); }}>
            <input
              className={styles.resumeSearchInput}
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></input>
          </form>
          <div className={styles.templatePreviewSortingWrapper}>
            <button
              type="button"
              className={styles.templatePreviewSortingSelect}
              onClick={() => setSortOpen(!sortOpen)}
              aria-expanded={sortOpen}
            >
              {sortBy === "copyCount"
                ? "Most Copied"
                : sortBy === "recent"
                  ? "Most Recent"
                  : "Sort by..."}
              <MdArrowDropDown />
            </button>
            {sortOpen && (
              <div className={styles.sortMenu}>
                <button
                  type="button"
                  className={styles.sortOption}
                  onClick={() => {
                    setSortBy("copyCount");
                    setOffset(0);
                    setSortOpen(false);
                  }}
                >
                  Most Copied
                </button>
                <button
                  type="button"
                  className={styles.sortOption}
                  onClick={() => {
                    setSortBy("recent");
                    setOffset(0);
                    setSortOpen(false);
                  }}
                >
                  Most Recent
                </button>
              </div>
            )}
          </div>
            <button className={`${styles.submitResumeSearchButton}`} type="submit" onClick={() => { setOffset(0); fetchTemplates(); }}>Search</button>

        </div>
        <div
          className={styles.templatePreviewsGridWrapper}
          style={{
            gridTemplateColumns: `repeat(${templatesPerPage / 2}, minmax(200px, 1fr))`,
          }}
        >
          {resumeTemplates.map((template) => (
            <ResumePreviewCard
              key={template.id}
              styling={{ height: "20rem" }}
              resumeId={template.id}
            />
          ))}
        </div>
        {resumeTemplates.length === 0 && <p>No templates available.</p>}
        {resumeTemplates.length > 0 && (
          <div className={styles.navigateTemplatePageInfoWrapper}>
            <p
              className={styles.navigateTemplatePageButton}
              style={{ textDecoration: "none" }}
            >
              Showing {offset + 1} - {offset + resumeTemplates.length} of{" "}
              {totalTemplates} templates.
            </p>
            <div className={styles.navigateTemplatePageButtonWrapper}>
              {offset > 0 && (
                <button
                  type="button"
                  className={styles.navigateTemplatePageButton}
                  onClick={() =>
                    setOffset(Math.max(offset - templatesPerPage, 0))
                  }
                  style={{ marginRight: "1rem" }}
                >
                  Previous
                </button>
              )}
              {offset + resumeTemplates.length < totalTemplates && (
                <button
                  type="button"
                  className={styles.navigateTemplatePageButton}
                  onClick={() => setOffset(offset + templatesPerPage)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
