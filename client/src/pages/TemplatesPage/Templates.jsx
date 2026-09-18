import styles from "./Templates.module.css";
import { useState, useEffect } from "react";
import ResumePreviewCard from "@/features/ResumePreview/ResumePreviewCard";
import { getResumesBySearchFromApi } from "@/services/resumeServices";
import { MdArrowDropDown } from "react-icons/md";
export default function Templates() {
  // ! Convert to URL Params/Routing
  // ! Look into storage of resume templates to prevent unnecessary additional requests

  const templatesPerPage = 12;
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [offset, setOffset] = useState(0);
  const [resumeTemplates, setResumeTemplates] = useState([]);
  const [sortBy, setSortBy] = useState("copyCount");
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resumeTypes, setResumeTypes] = useState(["officialTemplate"]);
  const [resumeTypesOpen, setResumeTypesOpen] = useState(false);

  const resumeTypeCheckboxOptions = [
    { value: "officialTemplate", label: "Official Templates" },
    { value: "personal", label: "My Resumes" },
  ];

  const toggleResumeType = (value) => {
    setResumeTypes((currentResumeTypes) =>
      currentResumeTypes.includes(value)
        ? currentResumeTypes.filter((type) => type !== value)
        : [...currentResumeTypes, value],
    );
  };

  const fetchTemplates = async () => {
    const templateData = await getResumesBySearchFromApi(
      searchQuery,
      sortBy,
      templatesPerPage,
      offset,
      resumeTypes,
    );
    setResumeTemplates(templateData.results ?? []);
    setTotalTemplates(templateData.totalCount ?? 0);
  };
  useEffect(() => {
    fetchTemplates();
  }, [offset, sortBy]);

  const sortLabel =
    sortBy === "copyCount"
      ? "Most Copied"
      : sortBy === "recent"
        ? "Most Recent"
        : "Sort by...";

  return (
    <div className={styles.templatesPageContainer}>
      <div className={styles.templatesPageContentWrapper}>
        <h1 className={styles.templatesPageTitle}>Resume Browsing Page</h1>

        <div className={styles.resumeSearchWrapper}>
          <form
            id="resumeSearchForm"
            className={styles.resumeSearchForm}
            onSubmit={(e) => {
              e.preventDefault();
              setOffset(0);
              fetchTemplates();
            }}
          >
            <input
              className={styles.resumeSearchInput}
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className={styles.searchControlsWrapper}>
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={styles.dropdownToggle}
                onClick={() => setSortOpen(!sortOpen)}
                aria-expanded={sortOpen}
              >
                <span className={styles.dropdownToggleLabel}>{sortLabel}</span>
                <MdArrowDropDown />
              </button>
              {sortOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    type="button"
                    className={styles.dropdownOption}
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
                    className={styles.dropdownOption}
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

            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={styles.dropdownToggle}
                onClick={() => setResumeTypesOpen(!resumeTypesOpen)}
                aria-expanded={resumeTypesOpen}
              >
                <span className={styles.dropdownToggleLabel}>Resume Types</span>
                <MdArrowDropDown />
              </button>
              {resumeTypesOpen && (
                <div className={styles.dropdownMenu}>
                  {resumeTypeCheckboxOptions.map(({ value, label }) => (
                    <label key={value} className={styles.resumeTypeCheckboxOption}>
                      <input
                        type="checkbox"
                        checked={resumeTypes.includes(value)}
                        onChange={() => toggleResumeType(value)}
                      />
                      {label}
                    </label>
                  ))}
                  <button
                    type="button"
                    className={styles.applyButton}
                    onClick={() => {
                      setOffset(0);
                      fetchTemplates();
                      setResumeTypesOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              form="resumeSearchForm"
              className={styles.searchButton}
            >
              Search
            </button>
          </div>
        </div>

        <div className={styles.templatePreviewsGridWrapper}>
          {resumeTemplates.map((template) => (
            <ResumePreviewCard
              key={template.id}
              styling={{
                width: "100%",
              }}
              resumeId={template.id}
            />
          ))}
        </div>
        {resumeTemplates.length === 0 && <p>No templates available.</p>}
        {resumeTemplates.length > 0 && (
          <div className={styles.navigateTemplatePageInfoWrapper}>
            <p className={styles.navigateTemplatePageText}>
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
