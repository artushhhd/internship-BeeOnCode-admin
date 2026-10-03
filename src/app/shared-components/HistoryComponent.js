import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import RestoreIcon from '@mui/icons-material/Restore';
import { ListItem, Zoom, Card } from '@mui/material';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FILE_API_URL } from '@api/http';
import clsx from 'clsx';
import Modal from '@mui/material/Modal';
import VisibilityIcon from '@mui/icons-material/Visibility';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HistoryComponent({ data, name }) {
  const { t } = useTranslation('navigation');
  const { translationLanguageInModal } = useSelector((state) => state.i18n);
  const [state, setState] = React.useState({
    right: false,
  });

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line consistent-return
  function imageValidation(images) {
    const imgRegex = new RegExp('[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|webp|)$');
    const imgVal = imgRegex.test(images);
    return imgVal;
  }

  const [open1, setOpen] = React.useState(false);
  const [chooseIndex, setChooseIndex] = React.useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let stringArray = [];
  const allStringArray = [];
  let keys;
  let values;
  let valuesOld;

  // eslint-disable-next-line array-callback-return,consistent-return
  data.log?.map((val, index) => {
    if (val.description !== 'created') {
      keys = Object.keys(val.properties?.attributes || {});
      values = Object.values(val.properties?.attributes || {});
      valuesOld = Object.values(val.properties?.old || {});
      keys?.map((key, keyIndex) => {
        if (valuesOld[keyIndex] !== values[keyIndex]) {
          stringArray.push({
            valueNew: values[keyIndex],
            type: t(key.toUpperCase()),
            oldValue: valuesOld[keyIndex],
            elementId: index,
            description: val?.description,
            languageId: val?.language_id || translationLanguageInModal,
            name: val.causer?.name,
            avatar: val.causer?.avatar,
            createdAt: val.created_at,
          });
        }
        return stringArray;
      });
    } else if (!data.translations) {
      stringArray.push({
        name: val.causer.name,
        avatar: val.causer.avatar,
        createdAt: val.created_at,
        languageId: val.language_id || translationLanguageInModal,
        description: val.description,
        elementId: index,
      });

      return stringArray;
    }
  });

  // // eslint-disable-next-line array-callback-return
  if (data.translations) {
    data.translations?.map((value) => {
      // eslint-disable-next-line array-callback-return,consistent-return
      return value.log?.map((valueLog, index) => {
        if (valueLog.description !== 'created') {
          keys = Object.keys(valueLog.properties.attributes || {});
          values = Object.values(valueLog.properties.attributes || {});
          valuesOld = Object.values(valueLog.properties.old || {});
          keys?.map((key, keysIndex) => {
            if (valuesOld[keysIndex] !== values[keysIndex]) {
              stringArray.push({
                valueNew: values[keysIndex],
                type: t(key.toUpperCase()),
                oldValue: valuesOld[keysIndex],
                description: valueLog.description,
                elementId: index,
                languageId: value.language_id,
                name: valueLog.causer.name,
                avatar: valueLog.causer.avatar,
                createdAt: valueLog.created_at,
              });
            }
            return stringArray;
          });
        } else {
          stringArray.push({
            name: valueLog.causer?.name,
            avatar: valueLog.causer?.avatar,
            createdAt: valueLog.created_at,
            languageId: value.language_id,
            description: valueLog.description,
            elementId: index,
          });
          return stringArray;
        }
      });
    });
  }

  const filterArray = [...stringArray];

  // filterArray.filter((value, )=>{
  //
  // })

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        backgroundColor: 'background.default',
      }}
      onKeyDown={toggleDrawer(anchor, false)}
      onClose={() => {}}
    >
      <div>
        <div style={{ width: '150px' }} className="mx-14  my-14">
          {data.translations && <LanguageSwitcher inModal />}
        </div>
        <IconButton
          className="m-4 absolute top-0 right-0 z-999"
          onClick={toggleDrawer(anchor, false)}
          size="large"
        >
          <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
        </IconButton>
        <ListItem
          sx={{ backgroundColor: 'background.default' }}
          className="flex flex-col "
          component="div"
        >
          <div className="flex flex-col justify-center items-center my-5">
            <div className="flex justify-center items-center flex-col	mt-36">
              <ListItem
                className="text-20 font-semibold leading-none text-center flex justify-center items-center"
                component="li"
              >
                {t(name)}
              </ListItem>
              <ListItem className="text-20 font-semibold leading-none" component="li">
                {t('CHANGES')} {t('HISTORY')}
              </ListItem>
            </div>
          </div>

          {/* eslint-disable-next-line camelcase */}
          {filterArray.map((value, index) => {
            return (
              translationLanguageInModal === value.languageId &&
              (value.valueNew || value.description === 'created') && (
                <Card
                  key={Math.random()}
                  className={clsx(
                    'flex items-center relative w-full rounded-16 p-20 min-h-64 shadow space-x-8 my-6'
                  )}
                  onClick={(ev) => ev.stopPropagation()}
                  style={{ width: '100%' }}
                >
                  {value.description === 'created' && (
                    <Box
                      key={Math.random()}
                      sx={{ backgroundColor: 'background.default' }}
                      className="flex shrink-0 items-center justify-center w-32 h-32 mr-12 rounded-full"
                    >
                      <FuseSvgIcon className="opacity-75" color="inherit">
                        heroicons-outline:plus-sm
                      </FuseSvgIcon>
                    </Box>
                  )}

                  {value.description === 'updated' && (
                    <Box
                      sx={{ backgroundColor: 'background.default' }}
                      className="flex shrink-0 items-center justify-center w-32 h-32 mr-12 rounded-full"
                      key={Math.random()}
                    >
                      <FuseSvgIcon className="opacity-75" color="inherit">
                        heroicons-outline:pencil-alt
                      </FuseSvgIcon>
                    </Box>
                  )}
                  <div className="flex flex-col flex-auto">
                    <div className="flex ">
                      <img
                        style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                        key={Math.random()}
                        src={`${FILE_API_URL}/${value.avatar}`}
                        alt={t('PHOTO_ALT')}
                      />
                      <Typography className="font-semibold line-clamp-1 mx-6 my-6" component="li">
                        {value.description !== 'updated'
                          ? `${t('CREATED')} ${value.name} ${value.createdAt}`
                          : `${t('CHANGED')} ${value.name} ${value.createdAt}`}
                      </Typography>
                    </div>

                    {filterArray.map((val, ind, arr) => {
                      // eslint-disable-next-line no-return-assign
                      return (
                        value.description === 'updated' &&
                        val.createdAt === value.createdAt &&
                        val.name === value.name &&
                        val !== '' && (
                          <div key={Math.random()} className="w-full flex justify-between">
                            <Button
                              component="button"
                              onClick={() => {
                                setChooseIndex(ind);
                                handleOpen();
                              }}
                              className="mx-28 "
                            >
                              <Tooltip
                                TransitionComponent={Zoom}
                                TransitionProps={{ timeout: 300 }}
                                title={t('SEETHECHANGE')}
                                enterDelay={700}
                                leaveDelay={200}
                                followCursor
                              >
                                <Typography className="font-semibold line-clamp-1 mx-6">
                                  {`${t('CHANGED')} ${val.type} `}
                                  {(filterArray[ind] = '')}
                                </Typography>
                              </Tooltip>
                              {/* <Typography */}
                              {/*  className="font-semibold line-clamp-1 w-full" */}
                              {/*  component="button" */}
                              {/* > */}
                              {/*  {t('SEETHECHANGE')} */}
                              {/* </Typography> */}
                            </Button>
                            <Tooltip
                              TransitionComponent={Zoom}
                              TransitionProps={{ timeout: 300 }}
                              title={t('SEETHECHANGE')}
                              enterDelay={700}
                              leaveDelay={200}
                              followCursor
                            >
                              <Typography className="font-semibold line-clamp-1 mx-36 my-6">
                                <Button
                                  component="button"
                                  onClick={() => {
                                    setChooseIndex(ind);
                                    handleOpen();
                                  }}
                                >
                                  <VisibilityIcon />
                                </Button>
                              </Typography>
                            </Tooltip>
                          </div>
                        )
                      );
                    })}

                    <div>
                      {stringArray.map((row, index1) => {
                        if (index1 === stringArray.length - 1) {
                          allStringArray.push([...stringArray]);

                          stringArray = [];
                        }

                        return (
                          <div key={index1}>
                            <Modal
                              open={open1}
                              onClose={() => {
                                handleClose();
                              }}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={style}>
                                {allStringArray.map((array) => {
                                  const newVal = array[chooseIndex].valueNew;
                                  const oldVal = array[chooseIndex].oldValue;

                                  return (
                                    <div
                                      key={Math.random()}
                                      style={{
                                        width: '70vw',
                                        minHeight: '50vh',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '70vw',
                                          height: '10vh',
                                          display: 'flex',
                                          justifyContent: 'space-around',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <span style={{ fontSize: '25px' }}>
                                          {newVal && `${t('OLD')} ${t(array[chooseIndex].type)}`}
                                        </span>

                                        <span style={{ fontSize: '25px' }}>
                                          {newVal && `${t('NEW')} ${t(array[chooseIndex].type)}`}
                                        </span>
                                      </div>
                                      <div
                                        className="w-full "
                                        style={{
                                          width: '62vw',
                                          heigth: '90%',
                                          display: 'flex',
                                          justifyContent: 'space-around',
                                        }}
                                      >
                                        <div key={Math.random()} className="flex w-full h-full">
                                          <div style={{ color: 'green' }}>
                                            <div
                                              style={{
                                                border: '1px solid green',
                                                width: '31vw',
                                                minHeight: '500px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: `${oldVal}`,
                                              }}
                                            >
                                              {/* eslint-disable-next-line no-nested-ternary */}
                                              {!Number.isInteger(+oldVal) ? (
                                                // eslint-disable-next-line no-nested-ternary
                                                imageValidation(oldVal) ? (
                                                  <img
                                                    style={{
                                                      width: '35%',
                                                    }}
                                                    src={`${FILE_API_URL}/${oldVal}`}
                                                    alt={t('ThereWasNoPreviousPicture')}
                                                  />
                                                ) : isJsonString(oldVal) ? (
                                                  JSON.parse(oldVal) && (
                                                    <div
                                                      dangerouslySetInnerHTML={{
                                                        __html: JSON.parse(oldVal)?.htmlValue,
                                                      }}
                                                    />
                                                  )
                                                ) : (
                                                  array[chooseIndex].type !== t('COLOR') && (
                                                    <span
                                                      style={
                                                        oldVal?.length < 12
                                                          ? { fontSize: '25px' }
                                                          : { fontSize: '16px' }
                                                      }
                                                    >
                                                      {oldVal}
                                                    </span>
                                                  )
                                                )
                                              ) : (
                                                <span style={{ fontSize: '35px' }}>
                                                  {/* eslint-disable-next-line */}
                                                  {oldVal == 0 ? (
                                                    <FuseSvgIcon>feather:eye-off</FuseSvgIcon>
                                                  ) : (
                                                    oldVal
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div
                                            style={{ color: 'red' }}
                                            className="flex w-full h-full"
                                          >
                                            <div
                                              style={{
                                                border: '1px solid red',
                                                width: '31vw',
                                                minHeight: '500px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: `${newVal}`,
                                              }}
                                            >
                                              {/* eslint-disable-next-line no-nested-ternary */}
                                              {!Number.isInteger(+newVal) ? (
                                                // eslint-disable-next-line no-nested-ternary
                                                imageValidation(newVal) ? (
                                                  <img
                                                    style={{
                                                      width: '35%',
                                                    }}
                                                    src={`${FILE_API_URL}/${newVal}`}
                                                    alt={t('ImageHasBeenRemoved')}
                                                  />
                                                ) : isJsonString(newVal) ? (
                                                  JSON.parse(newVal) && (
                                                    <div
                                                      dangerouslySetInnerHTML={{
                                                        __html: JSON.parse(newVal)?.htmlValue,
                                                      }}
                                                    />
                                                  )
                                                ) : (
                                                  array[chooseIndex].type !== t('COLOR') && (
                                                    <span
                                                      style={
                                                        newVal?.length < 12
                                                          ? { fontSize: '25px' }
                                                          : { fontSize: '16px' }
                                                      }
                                                    >
                                                      {newVal}
                                                    </span>
                                                  )
                                                )
                                              ) : (
                                                <span style={{ fontSize: '35px' }}>
                                                  {newVal === (1 || '1') ? (
                                                    <FuseSvgIcon>feather:eye</FuseSvgIcon>
                                                  ) : (
                                                    newVal
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </Box>
                            </Modal>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              )
            );
          })}
        </ListItem>
      </div>
    </Box>
  );

  return (
    <Box>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <RestoreIcon color="secondary" />
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </Box>
  );
}
