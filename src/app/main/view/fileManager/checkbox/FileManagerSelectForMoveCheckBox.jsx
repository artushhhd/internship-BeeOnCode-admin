import Checkbox from '@mui/material/Checkbox';

function FileManagerSelectForMoveCheckBox({ checkedMove }) {
  return (
    <Checkbox
      type="checkbox"
      className={`absolute top-0 right-0 rounded-none rounded-bl-lg p-4 ${
        checkedMove ? 'block' : 'hidden group-hover:block'
      }`}
      sx={{ '&, &:hover': { backgroundColor: 'background.paper' } }}
      checked={checkedMove}
      readOnly
    />
  );
}

export default FileManagerSelectForMoveCheckBox;
