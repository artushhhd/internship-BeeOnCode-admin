import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';

function FileManagerSelectLinkCheckBox({
  multiple,
  languageDifferent,
  isChecked,
  selected,
  setSelected,
  item,
}) {
  const { translationLanguageInModal } = useSelector((state) => state.i18n);

  return (
    <Checkbox
      type={multiple ? 'checkbox' : 'radio'}
      className={`absolute top-0 right-0 rounded-none rounded-bl-lg p-4 ${
        isChecked ? 'block' : 'hidden group-hover:block'
      }`}
      sx={{ '&, &:hover': { backgroundColor: 'background.paper' } }}
      checked={isChecked}
      id={`file_${item.id}`}
      onChange={() => {
        if (multiple) {
          setSelected(
            selected.some((value) => value.id === item.id)
              ? selected.filter((el) => el.id !== item.id)
              : [
                  ...selected,
                  {
                    id: item.id,
                    name: item.file_name,
                    language_id: translationLanguageInModal,
                    src: item.name,
                    youtube_id: item.youtube_id,
                    youtube_link: item.youtube_link,
                    type: item.type,
                    created_at: item.created_at,
                  },
                ]
          );
        } else if (languageDifferent) {
          setSelected({
            ...selected,
            [translationLanguageInModal]: {
              id: item.id,
              name: item.file_name,
              language_id: translationLanguageInModal,
              src: item.name,
              youtube_id: item.youtube_id,
              youtube_link: item.youtube_link,
              type: item.type,
              created_at: item.created_at,
            },
          });
        } else {
          setSelected({
            id: item.id,
            name: item.file_name,
            language_id: translationLanguageInModal,
            src: item.name,
            youtube_id: item.youtube_id,
            youtube_link: item.youtube_link,
            type: item.type,
            created_at: item.created_at,
          });
        }
      }}
    />
  );
}

export default FileManagerSelectLinkCheckBox;
