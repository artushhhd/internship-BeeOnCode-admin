import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { FILE_API_URL } from '@api/http';
import EmptyContent from 'app/shared-components/EmptyContent';
import { useNavigate, useParams } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import AdminsTableHead from './AdminsTableHead';
import { getAdmins, selectAdmins, selectAdminsSearchText } from '../store/adminsSlice';
import { getRoles, selectRoles } from '../store/rolesSlice';

function AdminsTable({ canManage }) {
  const dispatch = useDispatch();
  const users = useSelector(selectAdmins);
  const myRoleId = useSelector((state) => state.user.role_id);
  const roles = useSelector(selectRoles);
  const searchText = useSelector(selectAdminsSearchText);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(users);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    dispatch(getRoles())
      .then(() => dispatch(getAdmins()))
      .then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(users, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(users);
    }
  }, [users, searchText]);

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
    return <EmptyContent name="ADMINS" />;
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader aria-label="sticky table" className="min-w-xl">
        <AdminsTableHead
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
            .map((n, k, l) => {
              return (
                <TableRow
                  id="two"
                  className="h-72 cursor-pointer"
                  hover={!!canManage}
                  role="checkbox"
                  tabIndex={-1}
                  // key={n.id}
                  key={`user${n.id}`}
                  // onClick={() => handleClick(n)}
                  onDoubleClick={() =>
                    n.id !== +id && !!canManage && navigate(`/administration/admins/${n.id}/edit`)
                  }
                >
                  <TableCell
                    className="w-52 px-4 md:px-0"
                    component="th"
                    scope="row"
                    padding="none"
                  >
                    <img
                      className="w-full block rounded"
                      src={`${FILE_API_URL}/${n.avatar}`}
                      alt={n.avatar}
                    />
                  </TableCell>

                  <TableCell id="three" className="p-4 md:p-16" component="th" scope="row">
                    {n.name}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.email}
                  </TableCell>

                  <TableCell id="four" className="p-4 md:p-16 truncate" component="th" scope="row">
                    {
                      roles
                        .find((role) => role.id === n.role_id)
                        ?.translations?.find((trs) => trs.language_id === translationLanguage).name
                    }
                  </TableCell>

                  <TableCell id="five" className="p-4 md:p-16" component="th" scope="row">
                    {n.active ? (
                      <FuseSvgIcon className="text-green" size={20}>
                        heroicons-outline:check-circle
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={20}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>
                  <TableCell id="six" className="p-4 md:p-16" component="th" scope="row">
                    {canManage && (n.role_id !== 1 || myRoleId === 1) ? (
                      <ListItem
                        style={{ width: '50px' }}
                        component={NavLinkAdapter}
                        to={`/administration/admins/${n.id}/edit`}
                      >
                        <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                      </ListItem>
                    ) : null}
                  </TableCell>
                  <TableCell
                    id="seven"
                    className="p-4 md:p-16"
                    component="th"
                    scope="row"
                    // align="right"
                  >
                    <div
                      className="w-5 h-5 p-4 md:p-16"
                      style={{ marginRight: '25px', marginBottom: '33px' }}
                    >
                      {n.log?.length !== 0 && <HistoryComponent data={n} name="ADMINS" />}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

export default withRouter(AdminsTable);
