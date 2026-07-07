import {
   FaLinkedin,
   FaGithub,
   FaGlobe,
   FaEnvelope,
   FaPhone,
   FaMapMarkerAlt,
} from 'react-icons/fa';

export const iconsMap = {
   linkedin: FaLinkedin,
   github: FaGithub,
   globe: FaGlobe,
   envelope: FaEnvelope,
   phone: FaPhone,
   location: FaMapMarkerAlt,
};

export const iconsArr = Object.entries(iconsMap).map(([id, Icon]) => ({
   id,
   Icon,
}));

export const getFaIcon = (iconId) => iconsMap[iconId] ?? null;
