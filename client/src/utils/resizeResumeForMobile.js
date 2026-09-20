const resizeResumeForMobile = (resume) => {
   console.log('RESIZING FOR MOBILE, WINDOW WIDTH:', window.innerWidth);

   const layoutToRestyle = ['gap.field', 'gap.subsection', 'gap.horizontal', 'gap.vertical'];
   console.log(resume)
   if (resume?.styling?.fontSize) {
     resume.styling.fontSize = parseFloat(resume.styling.fontSize) * 0.9;
   }
   // if (resume?.layout) {
   //   for (const key of layoutToRestyle) {
   //     if (resume?.layout?.[key] && parseFloat(resume.layout[key]) != 0) {
   //       resume.layout[key] = parseFloat(resume.layout[key]) * 0.7 + 'rem';
   //     }
   //   }
   // }
   resume.styling.fontSize *= 0.7;
   return resume;
};

export default resizeResumeForMobile;