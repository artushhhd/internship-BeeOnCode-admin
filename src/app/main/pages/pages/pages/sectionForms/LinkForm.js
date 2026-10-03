import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import Divider from '@mui/material/Divider';
import CoverImageController from 'app/shared-components/fields/CoverImageController';
import PageCheckboxController from 'app/shared-components/fields/PageCheckboxController';
import { selectPages } from '../../store/pagesSlice';

const LinkForm = ({
  section,
  reset,
  errors,
  control,
  edit,
  watch,
  getValue,
  setValue,
  trigger,
}) => {
  const [linksData, setLinksData] = useState([]);
  const [uniqId, setUniqId] = useState(1);
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const [deletedMedia, setDeletedMedia] = useState([]);
  const pages = useSelector(selectPages);

  const copySection = useMemo(() => {
    return { ...section };
  }, [section]);

  useEffect(() => {
    if (section?.type === 'link') {
      if (edit) {
        section.translations?.forEach((item, i) => {
          copySection[`title${item.language_id}`] = item.title;
        });
        copySection.link = section.link;
        copySection.link?.forEach((l, i) => {
          copySection[`linkUrl${l.id}`] = l.link;
          copySection[`page_id${l.id}`] = l?.page;
          copySection[`linkTitle${l.id}_${l.language_id}`] = l.name;
        });
      } else {
        translationLanguages.forEach((language) => {
          copySection[`title${language.id}`] = '';
        });
      }

      setLinksData(copySection.link);
      reset({ ...copySection });
    }
    // eslint-disable-next-line
  }, [section, edit, reset, copySection]);

  useEffect(() => {
    reset({ ...copySection });
  }, [copySection, section, reset]);

  useEffect(() => {
    setUniqId(Math.floor(Math.random() * 99999999999999 + 1));
  }, [linksData]);

  return translationLanguages.map((l) => {
    return (
      l.id === translationLanguageInModal && (
        <div className={edit ? 'p-24' : undefined} key={`link${l.id}`}>
          <div className="flex flex-auto items-end">
            <LanguageSwitcher inModal />
          </div>

          <InputTranslationController control={control} name="title" errors={errors} />

          <div className="grid">
            <Controller
              name="links"
              control={control}
              render={({ field: { onChange, value } }) => {
                if (!value) {
                  onChange(linksData);
                }
                return (
                  <Box
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                          ? lighten(theme.palette.background.default, 0.4)
                          : lighten(theme.palette.background.default, 0.02),
                    }}
                    component="button"
                    className="productImageUpload flex items-center justify-center relative w-full h-32 rounded-16 mr-12 mt-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                    onClick={() => {
                      const data = [
                        ...linksData,
                        { id: uniqId, deleted: false, language_id: translationLanguageInModal },
                      ];
                      onChange(data);
                      setLinksData(data);
                      reset({ ...copySection, ...watch() });
                    }}
                  >
                    <FuseSvgIcon size={32} color="action">
                      heroicons-outline:plus
                    </FuseSvgIcon>
                  </Box>
                );
              }}
            />
          </div>
          {linksData?.map((link, i) => {
            return (
              link.language_id === translationLanguageInModal &&
              !link.deleted && (
                <Box key={`linkTitle${link.id}`}>
                  <Box className="flex justify-between items-end gap-[15px] relative">
                    <div className="w-[10%] ">
                      <CoverImageController
                        trigger={trigger}
                        getValues={getValue}
                        values={copySection}
                        text="cover"
                        edit={edit}
                        setValue={setValue}
                        control={control}
                        parentId={link.id}
                        name={`cover${link.id}`}
                      />
                    </div>

                    <div className="w-full">
                      <InputTranslationController
                        name={`linkTitle${link.id}_`}
                        control={control}
                        errors={errors}
                      />
                    </div>

                    <FuseSvgIcon
                      onClick={() => {
                        linksData.find((value) => value.id === link.id).deleted = true;
                        setLinksData([...linksData]);
                        if (watch().links.find((value) => value.id === link.id)) {
                          watch().links.find((value) => value.id === link.id).deleted = true;
                        }

                        // reset({ ...copySection, links: linksData });

                        if (link.created_at) {
                          setDeletedMedia([...deletedMedia, link.id]);
                          reset({ ...watch(), deletedMedia: [...deletedMedia, link.id] });
                        }
                      }}
                      className="absolute right-0 top-[7px] cursor-pointer"
                    >
                      heroicons-outline:x
                    </FuseSvgIcon>
                  </Box>
                  <div className="w-full">
                    <PageCheckboxController
                      watch={watch}
                      control={control}
                      name={`page_id${link.id}`}
                      reset={reset}
                      data={pages}
                      link={`linkUrl${link.id}`}
                      edit={edit}
                    />
                  </div>
                  <Divider className="mt-16" />
                </Box>
              )
            );
          })}
        </div>
      )
    );
  });
};

export default LinkForm;
