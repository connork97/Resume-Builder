import Header from "../Sections/Header";
import Contact from "../Sections/Contact";
import WorkHistory from "../Sections/WorkHistory";
import Education from "../Sections/Education";
import Skills from "../Sections/Skills";
import Summary from "../Sections/Summary";

const SectionWrapper = ({ id, type, data }) => {
  switch (type) {
    case "header":
      return <Header id={id} data={data} />;
    case "contact":
      return <Contact id={id} data={data} />;
    case "workHistory":
      return <WorkHistory id={id} data={data} />;
    case "education":
      return <Education id={id} data={data} />;
    case "skills":
      return <Skills id={id} data={data} />;
    case "summary":
      return <Summary id={id} data={data} />;
    default:
      return <div>Unknown section type: {type}</div>;
  }
}

export default SectionWrapper;