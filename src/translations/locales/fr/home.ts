import genres from './commons/genres';
import topNav from './commons/topNav';
import common from './commons/common';
import authModal from './commons/authModal';
import landingPage from './commons/landingPage';

const home = {
  ...genres,
  ...topNav,
  ...common,
  ...authModal,
  ...landingPage,
  LATEST: 'Latest',
  HOME_BANNER_HEADER: 'Publish your comics in different languages!',
  HOME_BANNER_CONTENT: `Couldn't find your language? Send us a message!`,
  HOME_BANNER_HEADER_DISCORD: 'Join our community',
  HOME_BANNER_CONTENT_DISCORD:
    'Pour commentaires, questions et suggestions. Rejoignez notre serveur discord',
  LABEL_GET_STARTED: 'Commencer',
  LABEL_VISIT: 'Visite',
  COLLAB_WEBKOM_1: 'Maison des Philippines',
  COLLAB_WEBKOM_2: 'WebKomiks',
  COLLAB_EPICO_1: 'CrowdSource Comic',
  COLLAB_EPICO_2: 'Translation Platform',
  COLLAB_CONTENT: 'COLLABORATING IN BRINGING PHILPPINE KOMIKS TO THE WORLD',
};

export default home;
