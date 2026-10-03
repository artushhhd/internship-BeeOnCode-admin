import LanguagesAppConfig from './languages/LanguagesAppConfig';
import LogoAppConfig from './logo/LogoAppConfig';
import SliderAppConfig from './slider/SliderAppConfig';
import FooterConfigs from './footer/footerConfigs';
import MenuAppConfig from './menu/MenuAppConfig';
import FAQConfig from './FAQ/FAQConfigs';
import SocialsAppConfig from './socials/SocialsAppConfig';
import AnnouncementConfig from './announcements/AnnouncementConfigs';
import StepAppConfig from './Step/StepAppConfig';
import PartnersAppConfig from './partners/PartnersAppConfig';
import FileManagerAppConfig from './fileManager/FileManagerAppConfig';
import StatisticsAppConfig from './Statistics/StepAppConfig';
import YoutubeSettingsAppConfig from './youtubeSettings/YoutubeSettingsAppConfig';
import TranslationsAppConfig from './translations/TranslationsAppConfig';
import ServicesAppConfig from './services/ServicesAppConfig';

const viewConfigs = [
  ...FAQConfig,
  ...FooterConfigs,
  LanguagesAppConfig,
  FileManagerAppConfig,
  SocialsAppConfig,
  LogoAppConfig,
  MenuAppConfig,
  SliderAppConfig,
  StepAppConfig,
  PartnersAppConfig,
  ...AnnouncementConfig,
  StatisticsAppConfig,
  YoutubeSettingsAppConfig,
  TranslationsAppConfig,
  ServicesAppConfig,
];

export default viewConfigs;
