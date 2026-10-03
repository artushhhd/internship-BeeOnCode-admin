import { Controller } from 'react-hook-form';
import Box from '@mui/system/Box';
import { FILE_API_URL } from '@api/http';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';

const ImageTranslationController = ({ control, name, edit, image, element, setImage }) => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  return (
    <>
      {translationLanguages.map((l) => {
        return (
          translationLanguageInModal === l.id && (
            <Controller
              key={l.id}
              control={control}
              name={`${name}${l.id}`}
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 4,
                    borderStyle: 'solid',
                    borderColor: 'background.paper',
                  }}
                  className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      {edit &&
                        ((typeof image[l.id] !== 'undefined' && !image[l.id]) ||
                          typeof image[l.id] === 'string') &&
                        element && (
                          <img
                            className="absolute top-0 left-0 z-[-1] flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                            src={element ? `${FILE_API_URL}/${element}` : ''}
                            alt="flag"
                          />
                        )}
                      <label htmlFor="button-avatar" className="flex p-8 cursor-pointer">
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-avatar"
                          type="file"
                          onChange={async (e) => {
                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
                                const file = e.target.files[0];
                                if (!file) {
                                  return;
                                }
                                const reader = new FileReader();

                                reader.onload = () => {
                                  resolve(`data:${file.type};base64,${btoa(reader.result)}`);
                                };

                                reader.onerror = reject;
                                setImage((prevState) => ({
                                  ...prevState,
                                  [translationLanguageInModal]: file,
                                }));
                                reader.readAsBinaryString(file);
                              });
                            }

                            const newImage = await readFileAsync();

                            onChange(newImage);
                          }}
                        />
                        <FuseSvgIcon className="text-white">heroicons-outline:camera</FuseSvgIcon>
                      </label>
                    </div>
                    {image[l.id] && (
                      <div>
                        <IconButton
                          onClick={() => {
                            onChange('');
                            setImage((prevState) => ({
                              ...prevState,
                              [translationLanguageInModal]: undefined,
                            }));
                          }}
                        >
                          <FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
                        </IconButton>
                      </div>
                    )}
                  </div>
                  <Avatar
                    sx={{
                      backgroundColor: 'background.default',
                      color: 'text.secondary',
                    }}
                    className="object-cover w-full h-full text-64 font-bold"
                    src={value || (element && image[l.id] ? `${FILE_API_URL}/${element}` : '')}
                    alt={name}
                  >
                    {edit && name.charAt(0)}
                  </Avatar>
                </Box>
              )}
            />
          )
        );
      })}
    </>
  );
};

export default ImageTranslationController;
