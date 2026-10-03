import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';

function FileFolderManagerBreadcrumbs({ folder, setFolderId }) {
  const { t } = useTranslation('navigation');

  return (
    <>
      {folder.parent ? (
        <FileFolderManagerBreadcrumbs folder={folder.parent} setFolderId={setFolderId} />
      ) : (
        <Button
          onClick={() => {
            setFolderId(null);
          }}
        >
          {t('ALL')}
        </Button>
      )}

      <FuseSvgIcon className="inline-flex" size={24} color="action">
        material-outline:arrow_forward_ios
      </FuseSvgIcon>

      <Button onClick={() => setFolderId(folder.id)}>{folder.file_name}</Button>
    </>
  );
}

export default FileFolderManagerBreadcrumbs;
