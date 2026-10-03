import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function FileManagerBreadcrumbs({ folder }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation('navigation');

  return (
    <>
      {folder.parent ? (
        <FileManagerBreadcrumbs folder={folder.parent} />
      ) : (
        <Button
          onClick={() => {
            const newSearchParams = new URLSearchParams(searchParams);

            newSearchParams.set('file_manager_page', `1`);
            newSearchParams.delete('file_manager_folder_id');

            setSearchParams(newSearchParams);
          }}
        >
          {t('ALL')}
        </Button>
      )}

      <FuseSvgIcon className="inline-flex" size={24} color="action">
        material-outline:arrow_forward_ios
      </FuseSvgIcon>

      <Button
        onClick={() => {
          const newSearchParams = new URLSearchParams(searchParams);

          newSearchParams.set('file_manager_page', `1`);
          newSearchParams.set('file_manager_folder_id', folder.id);

          setSearchParams(newSearchParams);
        }}
      >
        {folder.file_name}
      </Button>
    </>
  );
}

export default FileManagerBreadcrumbs;
