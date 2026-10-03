import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { changeTranslation } from './store/TranslationsSlice';

function TranslationsTextField({ translationString }) {
  const dispatch = useDispatch();

  const [edited, setEdited] = useState(false);
  const [text, setText] = useState(translationString?.value || '');

  useEffect(() => {
    setEdited(false);
  }, [translationString]);

  return (
    <Box className="relative">
      <TextField
        sx={{
          '& textarea': {
            paddingRight: '30px',
          },
        }}
        multiline
        fullWidth
        maxRows={4}
        className={`${edited ? 'bg-red-100' : ''}`}
        defaultValue={text}
        onChange={(e) => {
          setEdited(translationString.value !== e.target.value);
          setText(e.target.value);
        }}
      />

      {edited && (
        <Button
          variant="outlined"
          className="min-w-0 min-h-0 w-[40px] h-[40px] absolute top-4 right-4"
          onClick={() => {
            dispatch(
              changeTranslation({
                id: translationString.id,
                value: text,
                stringId: translationString.string_id,
              })
            );
            setEdited(false);
          }}
        >
          <SaveIcon />
        </Button>
      )}
    </Box>
  );
}

export default TranslationsTextField;
