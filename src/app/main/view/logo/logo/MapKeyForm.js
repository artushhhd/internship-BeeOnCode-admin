import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { Zoom } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import 'intro.js/introjs.css';
import createTranslationData from '@helpers/createTranslationData';
import InputController from 'app/shared-components/fields/InputController';
import { getLogo, selectLogo, updateLogo } from '../store/logoSlice';

const MapKeyForm = ({ canManage, steps }) => {
  const { t } = useTranslation('navigation');
  const logo = useSelector(selectLogo);
  const dispatch = useDispatch();

  const copyLogo = useMemo(() => {
    return { ...logo };
  }, [logo]);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
  });
  const { errors } = formState;

  useEffect(() => {
    dispatch(getLogo());
  }, [dispatch]);

  console.log(logo, 'logo**');
  useEffect(() => {
    if (logo) {
      copyLogo.gmap_id = logo?.gmap_id;
      reset({ ...copyLogo });
    }
  }, [logo, reset, copyLogo]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.title = createTranslationData(data, 'title');
    dispatch(updateLogo(data)).then(() => dispatch(getLogo()));
  }

  return (
    <Paper className="w-[98%] overflow-y-auto overflow-x-hidden  flex flex-col  justify-between px-10 mx-10 my-10">
      <Box
        className="relative w-full  "
        sx={{
          backgroundColor: 'background.default',
        }}
      />

      <div className="relative flex flex-col flex-auto items-start mt-[-20px]">
        <div className="mt-[20px]" style={{ width: '95%' }} id="step4">
          <InputController
            control={control}
            errors={errors}
            name="gmap_id"
            label="Google Map Key"
            disable={!canManage}
          />
        </div>
      </div>

      <div className="flex  justify-center  w-full">
        <div className="flex mt-[50px]  justify-end my-9" style={{ width: '80%' }}>
          {canManage ? (
            <Button
              id="step5"
              variant="contained"
              color="secondary"
              onClick={handleSubmit(onSubmit)}
            >
              <Tooltip
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 300 }}
                title={t('SAVE')}
                enterDelay={500}
                leaveDelay={200}
                followCursor
              >
                <span>{t('SAVE')}</span>
              </Tooltip>
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </Paper>
  );
};

export default MapKeyForm;
