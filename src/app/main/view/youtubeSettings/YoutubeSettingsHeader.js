import HeaderContent from 'app/shared-components/HeaderContent';
import { useSelector } from 'react-redux';
import { selectYoutubeSettings } from './store/youtubeSettingsSlice';

function YoutubeSettingsHeader() {
  const youtubeSettings = useSelector(selectYoutubeSettings);
  // const StepSteps = [
  //   {
  //     element: '#introOne',
  //     intro: t('ADDSTEP', { name: t('STEP') }),
  //   },
  //   {
  //     element: '#introTwo',
  //     // view
  //     intro: t('VIEWSTEP', { name: t('STEP') }),
  //   },
  //   {
  //     element: '#three',
  //     intro: t('QUESTIONSTEP5', { name: t('STEP') }),
  //   },
  // ];
  return (
    <HeaderContent
      data={youtubeSettings}
      id="introOne"
      // steps={StepSteps}
      // instruction={t('INSTRUCTION', { name: t('YOUTUBESETTINGS').toLowerCase() })}
      name="YOUTUBESETTINGS"
      addButtonTo="new/edit"
      disableAddButton
      disableSearch
      disableNote //
      disableLanguageSwitcher
    />
  );
}

export default YoutubeSettingsHeader;
