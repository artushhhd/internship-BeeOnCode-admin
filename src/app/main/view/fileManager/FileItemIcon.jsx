import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import Box from '@mui/system/Box';
import { amber, blue, green, grey, orange, purple, red } from '@mui/material/colors';

function FileItemIcon({ extension }) {
  const TypeBadge = styled(Box)(({ theme, ...props }) => ({
    backgroundColor: {
      [props.color]: grey[600], // any key
      WEBP: red[600],
      MP4: red[600],
      PDF: green[600],
      TXT: orange[600],
      XLS: amber[600],
      DOC: blue[600],
      ZIP: purple[600],
    }[props.color],
  }));

  if (extension === 'folder') {
    return (
      <FuseSvgIcon className="" size={56} color="disabled">
        heroicons-outline:folder
      </FuseSvgIcon>
    );
  }

  const myType = (extension || 'file').toUpperCase();

  return (
    <div className="relative">
      <FuseSvgIcon className="" size={56} color="disabled">
        heroicons-outline:document
      </FuseSvgIcon>
      <TypeBadge
        color={myType}
        className="absolute left-0 bottom-0 px-6 rounded text-12 font-semibold leading-20 text-white"
      >
        {myType}
      </TypeBadge>
    </div>
  );
}

export default FileItemIcon;
