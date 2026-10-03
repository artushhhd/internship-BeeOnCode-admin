import createTranslationData from '@helpers/createTranslationData';
import Box from '@mui/material/Box';
import { modalStyle } from 'app/shared-components/modals/DeleteModal';
import Button from '@mui/material/Button';
import { CircularProgress, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import _ from '@lodash';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {
  addAccordionInSection,
  addTabInSection,
  editAccordionInSection,
  editTabInSection,
} from '../store/pageSectionSlice';
import { getPageSections } from '../store/pageSectionsSlice';

const TabModal = ({ selectTab, setSelectTab }) => {
  const { translationLanguages } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');

  const schema = yup.object().shape({
    name1: yup.string().trim().required('You must enter a name'),
  });

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const tab = useMemo(() => {
    return { ...selectTab };
  }, [selectTab]);

  if (selectTab) {
    translationLanguages.forEach((item) => {
      tab[`name${item.id}`] = '';
    });
    if (selectTab.id) {
      selectTab.translations.forEach((item) => {
        tab[`name${item.language_id}`] = item.title;
      });
    }
  }

  useEffect(() => {
    reset({ ...tab });
  }, [tab, reset]);

  const { isValid, dirtyFields, errors } = formState;
  const dispatch = useDispatch();

  function onSubmit(data) {
    setLoading(true);

    if (!selectTab.id) {
      data.name = createTranslationData(data, 'name');
      data.section_id = selectTab.section_id;
      dispatch(selectTab.type === 'tab' ? addTabInSection(data) : addAccordionInSection(data)).then(
        () => {
          dispatch(getPageSections(id));
          setSelectTab(false);
          setLoading(false);
        }
      );
    } else {
      data.name = createTranslationData(data, 'name');
      data.id = selectTab.id;

      dispatch(
        selectTab.type === 'tab' ? editTabInSection(data) : editAccordionInSection(data)
      ).then(() => {
        dispatch(getPageSections(id));
        setSelectTab(false);
        setLoading(false);
      });
    }
  }

  return (
    <Modal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={!!selectTab}
      onClose={() => setSelectTab(false)}
    >
      <Box className="text-center" sx={modalStyle}>
        <div className="grid mt-16">
          <InputTranslationController control={control} errors={errors} name="name" />

          <Box className="text-center">
            <div className="flex justify-evenly mt-16">
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                disabled={_.isEmpty(dirtyFields) || !isValid || loading}
                onClick={handleSubmit(onSubmit)}
              >
                <span> {loading ? <CircularProgress size={20} /> : t('SAVE')}</span>
              </Button>
            </div>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default TabModal;
