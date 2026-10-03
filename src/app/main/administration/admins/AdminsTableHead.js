import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TableHead from '@mui/material/TableHead';
import { lighten } from '@mui/material/styles';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

const rows = [
  {
    id: 'image',
    align: 'left',
    disablePadding: true,
    label: '',
    sort: false,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Role',
    sort: true,
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

function AdminsTableHead(props) {
  const { t } = useTranslation('navigation');
  const { selectedProductIds } = props;
  const numSelected = selectedProductIds.length;

  const [selectedRolesMenu, setSelectedRolesMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedRolesMenu(event) {
    setSelectedRolesMenu(event.currentTarget);
  }

  function closeSelectedRolesMenu() {
    setSelectedRolesMenu(null);
  }

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          return (
            <TableCell
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
        <TableCell
          className="p-4 md:p-16"
          component="th"
          scope="row"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? lighten(theme.palette.background.default, 0.4)
                : lighten(theme.palette.background.default, 0.02),
          }}
        >
          <Tooltip
            title="Sort"
            // placement="right"
            enterDelay={300}
          >
            <TableSortLabel className="font-semibold">{t('EDIT')}</TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? lighten(theme.palette.background.default, 0.4)
                : lighten(theme.palette.background.default, 0.02),
          }}
          className="p-4 md:p-16"
        >
          <Tooltip title="Sort" placement="right" enterDelay={300}>
            <TableSortLabel className="font-semibold">{t('HISTORY')}</TableSortLabel>
          </Tooltip>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default AdminsTableHead;
