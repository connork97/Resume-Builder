import {
   FaLinkedin,
   FaGithub,
   FaGlobe,
   FaEnvelope,
   FaPhone,
   FaCommentDots,
   FaCommentAlt,
   FaMapMarkerAlt,
   FaDiscord,
   FaEtsy,
   FaFacebook,
   FaFacebookF,
   FaFacebookSquare,
   FaComment,
   FaGit,
   FaGithubSquare,
   FaGitAlt,
   FaGithubAlt,
   FaGitSquare,
   FaGoogle,
   FaGoogleDrive,
   FaGooglePlus,
   FaGooglePlusSquare,
   FaGooglePlusG,
   FaGraduationCap,
   FaHashtag,
   FaImdb,
   FaInbox,
   FaInstagram,
   FaInstagramSquare,
   FaLaptop,
   FaLaptopCode,
   FaLinkedinIn,
   FaMap,
   FaMapMarked,
   FaMapMarkedAlt,
   FaMapMarker,
   FaMapPin,
   FaMedium,
   FaMediumM,
   FaPaperPlane,
   FaPhoneAlt,
   FaPhoneSquare,
   FaPhoneSquareAlt,
   FaPhoneVolume,
   FaPinterest,
   FaPinterestP,
   FaPinterestSquare,
   FaRedditAlien,
   FaReddit,
   FaRedditSquare,
   FaSpotify,
   FaTwitter,
   FaTwitterSquare,
   FaTumblr,
   FaTumblrSquare,
   FaYoutube,
   FaYoutubeSquare,
   FaCalendar,
   FaCalendarAlt,
   FaBriefcase,
   FaSuitcase,
   FaBuilding,
   FaRegBuilding,
   FaBook,
   FaBookOpen,
   FaBookReader,
} from 'react-icons/fa';

export const ICON_GROUPS = [
   {
      label: 'Location',
      icons: {
         location: FaMapMarkerAlt,
         location2: FaMapMarker,
         location3: FaMapPin,
         location4: FaMap,
         location5: FaMapMarked,
         location6: FaMapMarkedAlt,
      },
   },
   {
      label: 'Contact',
      icons: {
         email: FaEnvelope,
         email2: FaInbox,
         email3: FaPaperPlane,

         phone: FaPhone,
         phone2: FaPhoneAlt,
         phone3: FaPhoneSquare,
         phone4: FaPhoneSquareAlt,
         phone5: FaPhoneVolume,

         text: FaComment,
         text2: FaCommentDots,
         text3: FaCommentAlt,
      },
   },
   {
      label: 'Social Media',
      icons: {
         globe: FaGlobe,
         socialMedia: FaHashtag,

         github: FaGithub,
         github2: FaGithubSquare,
         github3: FaGitAlt,
         github4: FaGithubAlt,
         github5: FaGit,
         github6: FaGitSquare,

         linkedin: FaLinkedin,
         linkedIn2: FaLinkedinIn,

         facebook: FaFacebookF,
         facebook2: FaFacebook,
         facebook3: FaFacebookSquare,

         instagram: FaInstagram,
         instagram2: FaInstagramSquare,

         discord: FaDiscord,
         etsy: FaEtsy,
         medium: FaMedium,
         medium2: FaMediumM,
         pinterest: FaPinterest,
         pinterest2: FaPinterestP,
         pinterest3: FaPinterestSquare,
         reddit: FaRedditAlien,
         reddit2: FaReddit,
         reddit3: FaRedditSquare,
         twitter: FaTwitter,
         twitter2: FaTwitterSquare,
         tumblr: FaTumblr,
         tumblr2: FaTumblrSquare,

         google: FaGoogle,
         googleDrive: FaGoogleDrive,
         googlePlus: FaGooglePlus,
         googlePlus2: FaGooglePlusSquare,
         googlePlus3: FaGooglePlusG,

         youtube: FaYoutube,
         youtube2: FaYoutubeSquare,
         imdb: FaImdb,
         spotify: FaSpotify,
      },
   },
   {
      label: 'Education/Work/Dates',
      icons: {
         education: FaGraduationCap,
         education2: FaBook,
         education3: FaBookOpen,
         education4: FaBookReader,

         company: FaBriefcase,
         company2: FaSuitcase,
         company3: FaBuilding,
         company4: FaRegBuilding,

         calendar: FaCalendar,
         calendar2: FaCalendarAlt,
      },
   },
   {
      label: 'Other',
      icons: {
         other: FaLaptop,
         other2: FaLaptopCode,
      },
   },
];

export const ICONS_MAP = ICON_GROUPS.reduce((iconsMap, group) => {
   return {
      ...iconsMap,
      ...group.icons,
   };
}, {});

export const iconsArr = ICON_GROUPS.flatMap((group) => {
   return Object.entries(group.icons).map(([id, Icon]) => ({
      id,
      Icon,
      group: group.label,
   }));
});

export const getFaIcon = (iconId) => ICONS_MAP[iconId] ?? null;
