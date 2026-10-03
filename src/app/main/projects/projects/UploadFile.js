import { Modal, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { editExcelProject, uploadExcel } from '../store/projectsSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const UploadFile = ({ open, handleClose, setOpen }) => {
  const { t } = useTranslation('navigation');
  const dispatch = useDispatch();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });
  const [excel, setExcel] = useState([]);

  const projects = useSelector((state) => state.ProjectsApp);
  useEffect(() => {
    setExcel(projects?.projects?.excel);
  }, [projects?.projects?.excel]);

  async function onDrop(e) {
    return new Promise(() => {
      const uploadedFiles = e;
      if (!uploadedFiles) {
        return;
      }

      dispatch(uploadExcel(uploadedFiles));
    });
  }

  return (
    <Box className="w-[430px] min-h-[100px]    ml-[20px]">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 1200, height: 700 }}>
          {/* <input hidden type="file" multiple {...getInputProps()} /> */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" className="bg-blue" component="label">
              {t('UPLOADEXCEL')}
              <input hidden multiple type="file" {...getInputProps()} />
            </Button>
          </Stack>
          <Box className="w-full h-[88%] mt-[10px]  ">
            <div className="w-full flex pb-[10px] ">
              <div className="w-[300px] py-[5px] text-[20px]  ">{t('Number')}</div>
              <div className="w-[200px] text-[14px]"> Database Grant Amount</div>
              <div className="w-[200px] text-[14px]">Excel Grant Amount</div>
              <div className="w-[200px] text-[14px]">Database Raised Amount</div>
              <div className="w-[200px] text-[14px]">Excel Raised Amount</div>
            </div>
            <Box className="w-full h-[90%] overflow-y-scroll overflow-x-hidden">
              {excel?.differences?.map((obj, index) => {
                return (
                  <div key={index} className="w-full flex mt-[10px]">
                    <div className="w-[20px] flex items-center"> {index + 1}</div>
                    <div className="w-[300px] py-[5px] text-bold text-[16px]  ">{obj.number}</div>
                    <div
                      className={`w-[200px] text-bold text-[16px] ${
                        +obj.database_grant_amount === +obj.excel_grant_amount
                          ? 'text-green'
                          : 'text-red'
                      }`}
                    >
                      {obj.database_grant_amount}
                    </div>
                    <div
                      className={`w-[200px] text-bold text-[16px] ${
                        +obj.database_grant_amount === +obj.excel_grant_amount
                          ? 'text-green'
                          : 'text-red'
                      }`}
                    >
                      {obj.excel_grant_amount}
                    </div>
                    <div
                      className={`w-[200px] text-bold text-[16px] ${
                        +obj.database_sponsor_amount === +obj.excel_sponsor_amount
                          ? 'text-green'
                          : 'text-red'
                      }`}
                    >
                      {obj.database_sponsor_amount}
                    </div>
                    <div
                      className={`w-[200px] text-bold text-[16px] ${
                        +obj.database_sponsor_amount === +obj.excel_sponsor_amount
                          ? 'text-green'
                          : 'text-red'
                      }`}
                    >
                      {obj.excel_sponsor_amount}
                    </div>
                  </div>
                );
              })}
              {excel?.missed?.map((obj, index) => {
                return (
                  <div key={index} className="w-full flex mt-[10px]">
                    <div className="w-[20px] text-red flex items-center"> {index + 1}</div>
                    <div className="w-[300px] py-[5px] text-bold text-[16px] text-red  ">
                      {obj.number}
                    </div>
                    <div className={`w-[200px] text-bold text-[16px] `} />
                    <div className={`w-[200px] text-bold text-[16px] text-red `}>
                      {obj.excel_grant_amount}
                    </div>
                    <div className={`w-[200px] text-bold text-[16px] `} />
                    <div className={`w-[200px] text-bold text-[16px] text-red `}>
                      {obj.excel_sponsor_amount}
                    </div>
                  </div>
                );
              })}
            </Box>
          </Box>
          <Box className="w-full flex justify-end ">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                onClick={() => {
                  dispatch(editExcelProject()).then(() => {
                    setOpen(false);
                    setExcel([]);
                  });
                }}
                variant="contained"
                className="bg-blue hover:bg-green"
                component="label"
              >
                {t('UPDATE')}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UploadFile;
