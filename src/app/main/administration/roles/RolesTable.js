import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate, useParams } from 'react-router-dom';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItem from '@mui/material/ListItem';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { amber } from '@mui/material/colors';
import { getRoles, selectRoles, selectRolesSearchText } from '../store/rolesSlice';
import RolesTableHead from './RolesTableHead';

function RolesTable({ canManage }) {
  const dispatch = useDispatch();
  const roles = useSelector(selectRoles);

  const searchText = useSelector(selectRolesSearchText);
  const myRoleId = useSelector((state) => state.user.role_id);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(roles);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { id } = useParams();
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    dispatch(getRoles()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(roles, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(roles);
    }
  }, [roles, searchText]);

  function handleRequestSort(event, property) {
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id: property,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no roles!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
        <RolesTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
          onMenuItemClick={handleDeselect}
        />

        <TableBody>
          {_.orderBy(
            data,
            [
              (o) => {
                switch (order.id) {
                  case 'categories': {
                    return o.categories[0];
                  }
                  default: {
                    return o[order.id];
                  }
                }
              },
            ],
            [order.direction]
          )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((n) => {
              const isSelected = selected.indexOf(n.id) !== -1;
              return (
                <TableRow
                  id="two"
                  className="h-72 cursor-pointer"
                  hover={!!canManage}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={`role${n.id}`}
                  selected={isSelected}
                  onDoubleClick={() =>
                    n.id !== +id && !!canManage && navigate(`/administration/roles/${n.id}/edit`)
                  }
                >
                  <TableCell id="three" className="p-4 md:p-16" component="th" scope="row">
                    {n.translations?.find((trs) => trs.language_id === translationLanguage).name}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                    {n.is_vendor ? (
                      <FuseSvgIcon sx={{ color: amber[600] }}>heroicons-solid:star</FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={20}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>
                  <TableCell id="four" className="p-4 md:p-16" component="th" scope="row">
                    {canManage && (n.role_id !== 1 || myRoleId === 1) ? (
                      <ListItem
                        style={{ width: '50px' }}
                        component={NavLinkAdapter}
                        to={`/administration/roles/${n.id}/edit`}
                      >
                        <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                      </ListItem>
                    ) : null}
                  </TableCell>
                  <TableCell id="five" className="p-4 md:p-16" component="th" scope="row">
                    {n.log?.length !== 0 && <HistoryComponent data={n} name="ROLE" />}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

export default withRouter(RolesTable);
