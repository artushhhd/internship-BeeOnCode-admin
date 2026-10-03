import { useSelector } from 'react-redux';
import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';

function MenuHeader({ setCollapseAll, collapseAll, search, setSearch, canManage }) {
  const { menu } = useSelector((state) => state.menuApp.menuReducer);
  const { t } = useTranslation('navigation');

  const MenuSteps = [
    {
      element: '#addMenu',
      // add menu
      intro: t('ADDSTEP', { name: t('MENU') }),
    },
    {
      element: '#step2',
      // view menu
      intro: t('VIEWSTEP', { name: t('MENU') }),
    },
    {
      element: '#step2',
      // drag menu
      intro: t('DRAG_STEP', { name: t('MENU') }),
    },
    {
      element: '#step4',
      // add subMenu
      intro: t('ADDSTEP', { name: `${t('NEW')} ${t('MENU')} ` }),
    },
    {
      element: '#step5',
      // edit menu
      intro: t('QUESTIONSTEP5', { name: t('MENU') }),
    },
    {
      element: '#step6',
      // see all menus
      intro: t('SEEMORE', { name: t('MENU') }),
    },
  ];

  return (
    <HeaderContent
      id="addMenu"
      steps={MenuSteps}
      name="MENU"
      instruction={t('INSTRUCTION', { name: t('MENU') })}
      data={menu}
      addButtonTo="new/edit"
      searchText={search}
      eyeOpen
      setCollapseAll={setCollapseAll}
      collapseAll={collapseAll}
      onSearch={(e) => setSearch(e.target.value)}
      disableAddButton={!canManage}
    />
  );
}

export default MenuHeader;
