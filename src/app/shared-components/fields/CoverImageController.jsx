import { Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import Box from '@mui/system/Box';
import { FILE_API_URL } from '@api/http';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DevMode from 'app/shared-components/DevMode';
import Avatar from '@mui/material/Avatar';

const CoverImageController = ({
  values,
  setValue,
  name,
  text,
  edit,
  control,
  languageDifferent = false,
  disableEdit = false,
  parentId,
  trigger,
  getValues,
}) => {
  const { translationLanguageInModal } = useSelector((state) => state.i18n);
  const [open, setOpen] = useState(false);
  const vals = getValues();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});

  useEffect(() => {
    if (selected?.id) {
      const obj = {
        id: selected.id,
        src: selected.src,
        parentId,
        language_id: translationLanguageInModal,
      };
      setValue(name, obj);
      trigger(name);
    }
    trigger(name);
    // eslint-disable-next-line
  }, [selected]);
  useEffect(() => {
    if (edit && values?.file?.length > 0) {
      const filterValue = values?.file
        ?.map((f) => {
          return {
            id: f.cover_id,
            src: f?.cover_media?.thumbnail_url,
            parentId: `${f?.file_id}_${f.language_id}`,
            language_id: f?.language_id,
          };
        })
        ?.find((val) => val.parentId === parentId);
      if (filterValue?.id) {
        setSelected(filterValue);
        setDefaultSelected(filterValue);
        setValue(name, {
          id: filterValue.id,
          src: filterValue.src,
          parentId: filterValue.parentId,
          language_id: filterValue?.language_id,
        });
      }
      if (selected?.id) {
        setValue(name, {
          id: selected.id,
          src: selected.src,
          parentId,
          language_id: translationLanguageInModal,
        });
        const newVal2 = {
          id: selected.id,
          src: selected.src,
          parentId,
          language_id: translationLanguageInModal,
        };
        setSelected(newVal2);
      }
    } else if (edit && values?.link?.length > 0) {
      const newVal = values?.link?.map((f) => {
        return {
          id: f?.cover_id,
          src: f?.cover_media?.thumbnail_url,
          parentId: f?.id,
          language_id: f.language_id,
        };
      });
      const filterValue = newVal.find((val) => val.parentId === parentId);
      if (filterValue?.id) {
        setSelected(filterValue);
        setDefaultSelected(filterValue);
        setValue(name, {
          id: filterValue.id,
          src: filterValue.src,
          parentId: filterValue.parentId,
          language_id: filterValue.language_id,
        });
      }
      if (selected?.id) {
        setValue(name, {
          id: selected.id,
          src: selected.src,
          parentId,
          language_id: translationLanguageInModal,
        });
        const newVal2 = {
          id: selected.id,
          src: selected.src,
          parentId,
          language_id: translationLanguageInModal,
        };
        setSelected(newVal2);
      }
    }
    // eslint-disable-next-line
  }, [open,translationLanguageInModal]);


  useEffect(() => {
    if (vals[name]) {
      setSelected(vals[name]);
    }
    // eslint-disable-next-line
  }, [translationLanguageInModal]);

  return (
    <Box className="relative">
      {selected?.src && (
        // eslint-disable-next-line react/button-has-type
        <button className="relative">
          <FuseSvgIcon
            color="red"
            className="absolute z-30  left-[40px]"
            onClick={(e) => {
              e.preventDefault();
              setSelected({});
              setDefaultSelected({});
              setValue(name, null);
              trigger(name);
            }}
          >
            heroicons-outline:x
          </FuseSvgIcon>
        </button>
      )}
      <Controller
        control={control}
        name={languageDifferent ? `${name}${translationLanguageInModal}` : name}
        render={({ field: { onChange, value } }) => (
          <Box
            sx={{
              borderWidth: 4,
              borderStyle: 'solid',
              borderColor: 'background.paper',
            }}
            className="relative flex items-center justify-center w-[60px] h-[60px]  overflow-hidden"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
            {!disableEdit && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div>
                  {edit && selected?.src && (
                    <>
                      <img
                        className="absolute top-0 left-0 z-[-100] flex items-center justify-center w-[60px] h-[60px]  overflow-hidden"
                        src={`${FILE_API_URL}/${selected?.src}`}
                        alt=""
                      />
                    </>
                  )}
                  <Box
                    onClick={handleOpen}
                    component="span"
                    htmlFor="button-avatar"
                    className="flex p-8 cursor-pointer"
                  >
                    <FuseSvgIcon className="text-white">heroicons-outline:camera</FuseSvgIcon>
                  </Box>
                </div>
                <div className="absolute top-24 text-center">
                  <DevMode>file_id: {selected?.id}</DevMode>
                </div>
              </div>
            )}
            <Avatar
              sx={{
                backgroundColor: 'background.default',
                borderRadius: 0,
                color: 'text.secondary',
              }}
              className="object-cover w-full h-full text-20 font-bold"
              src={`${FILE_API_URL}/${selected?.src}`}
              alt=""
            >
              {text}
            </Avatar>
            <FileManagerModal
              type="image"
              handleClose={handleClose}
              open={open}
              selected={selected}
              setSelected={setSelected}
              defaultSelected={defaultSelected}
              languageDifferent={languageDifferent}
              setDefaultSelected={setDefaultSelected}
            />
          </Box>
        )}
      />
    </Box>
  );
};

export default CoverImageController;
