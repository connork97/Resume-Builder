import { fetchApi } from "@/lib/fetch";
import normalizeResumeFromApi from "@/utils/normalizeResumeFromApi";
import { resume } from "react-dom/server";

export const addFieldToApi = async (subsectionId) => {
   try {
      const data = await fetchApi(
         {
            endpoint: `/fields/${subsectionId}`,
            options: { method: 'POST' }
         }
      )

      const normalizedResume = normalizeResumeFromApi(data);
      return normalizedResume;

   } catch (error) {
      console.error(`Error adding field to subsection of ID ${subsectionId}: `, error);
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error adding subsection to subsection of ID ${subsectionId}.`
      )
      return null;
   }
}

export const deleteFieldFromApi = async (fieldId) => {
   try {
      await fetchApi(
         {
            endpoint: `/fields/${fieldId}`,
            options: { method: 'DELETE' }
         }
      )

      return true;

   } catch (error) {
      console.error(`Error deleting field of ID ${fieldId}: `, error);
      alert(
         error?.code && error?.message
            ? `${error.code}\n${error.message}`
            : `Error deleting field of ID ${fieldId}.`
      );

      return false;
   }
}

export const addSubsectionToApi = async (sectionId) => {
   try {
      const data = await fetchApi(
         {
            endpoint: `/subsections/${sectionId}`,
            options: { method: 'POST' }
         }
      )

      const normalizedResume = normalizeResumeFromApi(data);
      return normalizedResume;

   } catch (error) {
      console.error(`Error adding subsection to section of ID ${sectionId}: `, error);
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error adding subsection to section of ID ${sectionId}.`
      )
      return null;
   }
}

export const deleteSubsectionFromApi = async (subsectionId) => {
   try {
      await fetchApi(
         {
            endpoint: `/subsections/${subsectionId}`,
            options: { method: 'DELETE' }
         }
      )

      return true;

   } catch (error) {
      console.error(`Error deleting subsection of ID ${subsectionId}: `, error);
      alert(
         error?.code && error?.message
            ? `${error.code}\n${error.message}`
            : `Error deleting subsection of ID ${subsectionId}.`
      );
      return false;
   }
}

export const addSectionToApi = async (resumeId, sectionType) => {
   try {
      const data = await fetchApi({
         endpoint: `/sections/${resumeId}`,
         options: { method: 'POST', body: JSON.stringify({ type: sectionType }) }
      })

      const normalizedResume = normalizeResumeFromApi(data);
      return normalizedResume;

   } catch (error) {
      console.error(`Error adding ${sectionType} section to resume of ID ${resumeId}: `, error)
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error adding ${sectionType} section to resume of ID ${resumeId}.`
      )

      return null;
   }
}

export const deleteSectionFromApi = async (sectionId) => {
   try {
      await fetchApi(
         {
            endpoint: `/sections/${sectionId}`,
            options: { method: 'DELETE' }
         }
      )

      return true;

   } catch (error) {
      console.error(`Error deleting section of ID ${sectionId}: `, error);
      alert(
         error?.code && error?.message
            ? `${error.code}\n${error.message}`
            : `Error deleting section of ID ${sectionId}.`
      );
      return false;
   }
}

export const addColumnToApi = async (resumeId) => {
   try {
      const data = await fetchApi({
         endpoint: `/columns/${resumeId}`,
         options: { method: 'POST' }
      })
      const normalizedResume = normalizeResumeFromApi(data);
      return normalizedResume;

   } catch (error) {
      console.error(`Error adding column to resume of ID ${resumeId}: `, error)
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error adding column to resume of ID ${resumeId}.`
      )

      return null;
   }
}

export const deleteLastColumnFromApi = async (resumeId) => {
   try {
      const data = await fetchApi({
         endpoint: `/columns/${resumeId}`,
         options: { method: 'DELETE' }
      })

      const normalizedResume = normalizeResumeFromApi(data);
      return normalizedResume;

   } catch (error) {
      console.error(`Error deleting column of ID ${columnId}: `, error)
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error deleting column of ID ${columnId}.`
      )

      return false;
   }
}

export const getResumeFromApi = async (resumeId) => {
   try {
      const data = await fetchApi({
         endpoint: `/resumes/${resumeId}`
      })

      const normalizedResume = normalizeResumeFromApi(data);
      return normalizedResume;

   } catch (error) {
      console.error(`Error fetching resume of ID ${resumeId}: `, error);
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error fetching resume of ID ${resumeId}.`
      )

      return null;
   }
}

export const addResumeToApi = async (resumeData) => {
   try {
      const data = await fetchApi({
         endpoint: '/resumes',
         options: {
            method: 'POST',
            body: JSON.stringify(resumeData)
         }
      })

      const normalizedResume = normalizeResumeFromApi(data);
      return normalizedResume;

   } catch (error) {
      console.error('Error creating resume: ', error);
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : 'Error creating new resume.'
      )

      return null;
   }
}

export const saveResumeToApi = async (resume) => {
   try {
      await fetchApi({
         endpoint: `/resumes/${resume.id}`,
         options: {
            method: 'PUT',
            body: JSON.stringify(resume)
         }
      })

      return true;

   } catch (error) {
      console.error(`Error saving resume of ID ${resume.id}: `, error);
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error saving resume of ID ${resume.id}.`
      )

      return false;
   }
}

export const deleteResumeFromApi = async (resumeId) => {
   try {
      await fetchApi({
         endpoint: `/resumes/${resumeId}`,
         options: { method: 'DELETE' }
      })
      return true;
   } catch (error) {
      console.error(`Error deleting resume of ID ${resumeId}: `, error);
      alert(
         error?.code && error?.message
            ? error.code + '\n' + error.message
            : `Error deleting resume of ID ${resumeId}.`
      )
      return false;
   }
}