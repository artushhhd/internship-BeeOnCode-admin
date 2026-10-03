import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import { useParams } from 'react-router-dom';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import InputController from 'app/shared-components/fields/InputController';
import CoverImageController from 'app/shared-components/fields/CoverImageController';
import { getPageSections } from '../../store/pageSectionsSlice';

const FileForm = ({
  section,
  reset,
  errors,
  control,
  edit,
  watch,
  setValue,
  getValue,
  trigger,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPageSections(id));
  }, [dispatch, id]);

  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const [selected, setSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState([]);

  const copySection = useMemo(() => {
    return { ...section };
  }, [section]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(
    () => {
      if (section?.type === 'file') {
        if (edit) {
          section.translations.forEach((item, i) => {
            copySection[`title${item.language_id}`] = item.title;
          });
          copySection.file.forEach((f) => {
            copySection[`file_${f.file_id}_name_${f.language_id}`] = f.name;
            copySection[`cover_${f.file_id}_id_${f.language_id}`] = f?.cover_media && {
              ...f.cover_media,
              src: f.cover_media.name,
            };
          });
          setSelected(
            copySection.file.map((f) => {
              return {
                id: f.file_id,
                name: f?.name,
                src: f.media?.thumbnail_url,
                language_id: f?.language_id,
                created_at: f?.media?.created_at,
                type: f?.media?.type,
                youtube_id: f?.media?.youtube_id,
                youtube_link: f?.media?.youtube_link,
              };
            })
          );
          setDefaultSelected(
            copySection.file.map((f) => {
              return {
                id: f.file_id,
                name: f?.name,
                src: f.media?.thumbnail_url,
                language_id: f?.language_id,
                created_at: f?.media?.created_at,
                type: f?.media?.type,
                youtube_id: f?.media?.youtube_id,
                youtube_link: f?.media?.youtube_link,
              };
            })
          );
        } else {
          translationLanguages.forEach((language) => {
            copySection[`title${language.id}`] = '';
          });
        }
        reset({ ...copySection });
      }
    },
    // eslint-disable-next-line
      [section, edit, reset, copySection]);

  useEffect(() => {
    setValue('selected', selected);
    trigger('selected');
    // eslint-disable-next-line
  },[selected])

  return translationLanguages.map((l) => {
    return (
      l.id === translationLanguageInModal && (
        <div className={edit ? 'p-24 ' : ''} key={`file${l.id}`}>
          <div className="flex flex-auto items-end">
            <LanguageSwitcher inModal />
          </div>
          <InputTranslationController control={control} errors={errors} name="title" />
          <div className="grid">
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="productImageUpload flex items-center justify-center relative w-full h-32 rounded-16 mr-12 mt-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
              onClick={handleOpen}
            >
              <FuseSvgIcon className="" size={32}>
                heroicons-outline:upload
              </FuseSvgIcon>
            </Box>
          </div>
          {selected.map((f) => {
            return (
              f.language_id === translationLanguageInModal && (
                <Box key={f.id} className="flex flex-row items-end content-between">
                  <CoverImageController
                    trigger={trigger}
                    getValues={watch}
                    values={copySection}
                    text="cover"
                    edit={edit}
                    setValue={setValue}
                    control={control}
                    parentId={`${f.id}_${f.language_id}`}
                    name={`cover_${f.id}_id_${f.language_id}`}
                  />
                  <InputController
                    control={control}
                    errors={errors}
                    name={`file_${f.id}_name_${f.language_id}`}
                    type="text"
                    label={f.name}
                  />
                  <Box>
                    <FuseSvgIcon
                      onClick={() => {
                        setSelected(
                          selected.filter(
                            (el) => `${el.id}_${el.language_id}` !== `${f.id}_${f.language_id}`
                          )
                        );
                      }}
                      className="cursor-pointer"
                    >
                      heroicons-outline:x
                    </FuseSvgIcon>
                  </Box>
                </Box>
              )
            );
          })}
          <FileManagerModal
            type="file"
            handleClose={handleClose}
            open={open}
            selected={selected}
            defaultSelected={defaultSelected}
            setSelected={setSelected}
            multiple
            setDefaultSelected={setDefaultSelected}
            languageDifferent
          />
        </div>
      )
    );
  });
};

export default FileForm;
