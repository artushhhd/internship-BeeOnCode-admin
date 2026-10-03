import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import navigationConfig from 'app/configs/navigationConfig';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import { Switch } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import DevMode from 'app/shared-components/DevMode';
import TableCell from '@mui/material/TableCell';
import { Box } from '@mui/system';
import { getRoles, selectRoles } from '../store/rolesSlice';
import {
  changePermission,
  selectPermissions,
  getAllPermissions,
  synchronization,
} from '../store/permissionsSlice';

function PermissionsTable({ canManage }) {
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&': {
      backgroundColor: theme.palette.background.default,
    },
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },

    '&:nth-of-type(n+1) td:nth-of-type(1)': {
      backgroundColor: theme.palette.background.default,
      zIndex: 99,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // hide last border+
    '&:nth-of-type(n+1) th:nth-of-type(1)': {
      zIndex: 9999,
    },

    '&: nth-of-type(1)': {
      position: 'sticky',
      left: 0,
    },
  }));

  const dispatch = useDispatch();
  const roles = useSelector(selectRoles);
  const { t } = useTranslation('navigation');

  const minWidth = 200;

  const [loading, setLoading] = useState(true);
  const permissions = useSelector(selectPermissions);
  const { translationLanguage } = useSelector((state) => state.i18n);

  const [permSwitches, setPermSwitches] = useState({});

  const [sync, setSync] = useState(false);

  useEffect(() => {
    dispatch(getAllPermissions()).then(() => dispatch(getRoles()).then(() => setLoading(false)));
  }, [dispatch]);

  const defRolSwitches = useMemo(() => {
    roles.reduce((aggr, role) => {
      aggr[`can_view_all${role.id}`] = 0;
      aggr[`can_manage_all${role.id}`] = 0;
      return aggr;
    }, {});
  }, [roles]);

  useEffect(() => {
    setPermSwitches({
      ...permissions.reduce(
        (aggr, per) => {
          aggr[`can_view${per.id}`] = per.can_view;
          aggr[`can_manage${per.id}`] = per.can_manage;
          return aggr;
        },
        { defRolSwitches }
      ),
    });
  }, [permissions, defRolSwitches]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <FuseLoading />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <StyledTableRow className="h-72 cursor-pointer" role="checkbox" tabIndex={-1}>
            <StyledTableCell
              className="w-40 md:w-64 text-center font-semibold z-9999"
              padding="none"
              style={{ minWidth }}
            >
              <DevMode>
                <IconButton
                  className={`w-40 h-40 ${sync ? 'animate-spin' : ''}`}
                  onClick={() => {
                    setSync(true);
                    dispatch(synchronization(navigationConfig))
                      .then(() => dispatch(getAllPermissions()))
                      .then(() => dispatch(getRoles()))
                      .then(() => setSync(false));
                  }}
                >
                  <FuseSvgIcon className="text-48" size={24} color="action">
                    feather:refresh-cw
                  </FuseSvgIcon>
                </IconButton>
              </DevMode>
            </StyledTableCell>
            {roles.map((role) =>
              !role.is_vendor ? (
                <StyledTableCell
                  key={Math.random()}
                  className="w-40 md:w-64 text-center font-semibold"
                  padding="none"
                >
                  <Box id="one">
                    {role.translations.find((trs) => trs.language_id === translationLanguage).name}
                  </Box>
                  <br />
                  {t('VIEW')} | {t('MANAGE')}
                </StyledTableCell>
              ) : null
            )}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {/* <TableRow>
            <TableCell className="font-semibold underline">{t('ALL')}</TableCell>
            {roles.map((role) => (
              <TableCell
                key={Math.random()}
                className="w-40 md:w-64 text-center font-semibold"
                padding="none"
              >
                <Switch
                  disabled={!!permSwitches[`can_manage_all${role.id}`]}
                  checked={!!permSwitches[`can_view_all${role.id}`]}
                  onChange={(e) => {
                    setPermSwitches({
                      ...permSwitches,
                      [`can_view_all${role.id}`]: e.target.checked,
                    });
                    dispatch(
                      changePermission([
                        0,
                        e.target.checked,
                        permSwitches[`can_manage_all${role.id}`],
                        role.id,
                      ])
                    ).then(() => dispatch(getAllPermissions()));
                  }}
                />
                <Switch
                  checked={!!permSwitches[`can_manage_all${role.id}`]}
                  onChange={(e) => {
                    setPermSwitches({
                      ...permSwitches,
                      [`can_manage_all${role.id}`]: e.target.checked,
                    });
                    dispatch(
                      changePermission([
                        0,
                        permSwitches[`can_view_all${role.id}`],
                        e.target.value,
                        role.id,
                      ])
                    ).then(() => dispatch(getAllPermissions()));
                  }}
                />
              </TableCell>
            ))}
          </TableRow> */}
          {navigationConfig.map((n) => {
            return (
              <Fragment key={Math.random()}>
                <StyledTableRow>
                  <StyledTableCell className="italic" style={{ minWidth }}>
                    {t(n.translate)}
                  </StyledTableCell>
                </StyledTableRow>
                {n.children.map((item) => (
                  <Fragment key={Math.random()}>
                    <StyledTableRow>
                      <StyledTableCell id="two" className="font-semibold">
                        {t(item.translate)}
                      </StyledTableCell>
                      {item.type === 'item' &&
                        roles.map((role) => {
                          const perm = role.permissions.find((r) => r.section.name === item.name);
                          return perm && !role.is_vendor ? (
                            <StyledTableCell
                              key={`role${role.id}`}
                              className="text-center"
                              style={{ minWidth }}
                            >
                              <span id="three">
                                <Switch
                                  disabled={!!permSwitches[`can_manage${perm.id}`] || !canManage}
                                  checked={!!permSwitches[`can_view${perm.id}`]}
                                  onChange={(e) => {
                                    setPermSwitches({
                                      ...permSwitches,
                                      [`can_view${perm.id}`]: e.target.checked,
                                    });
                                    dispatch(
                                      changePermission([
                                        perm.id,
                                        e.target.checked,
                                        !!permSwitches[`can_manage${perm.id}`],
                                        role.id,
                                      ])
                                    );
                                  }}
                                />
                              </span>
                              <DevMode>id: {perm.id}</DevMode>
                              <span id="four">
                                <Switch
                                  disabled={!canManage}
                                  checked={!!permSwitches[`can_manage${perm.id}`]}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setPermSwitches({
                                        ...permSwitches,
                                        [`can_manage${perm.id}`]: e.target.checked,
                                        [`can_view${perm.id}`]: e.target.checked,
                                      });
                                      dispatch(changePermission([perm.id, 1, 1, role.id]));
                                    } else {
                                      setPermSwitches({
                                        ...permSwitches,
                                        [`can_manage${perm.id}`]: e.target.checked,
                                      });
                                      dispatch(
                                        changePermission([
                                          perm.id,
                                          !!permSwitches[`can_view${perm.id}`],
                                          e.target.checked,
                                          role.id,
                                        ])
                                      );
                                    }
                                  }}
                                />
                              </span>
                            </StyledTableCell>
                          ) : null;
                        })}
                    </StyledTableRow>

                    {item.type === 'collapse' &&
                      item.children.map((subItem) => (
                        <StyledTableRow key={Math.random()}>
                          <StyledTableCell className="pl-32" style={{ minWidth }}>
                            {t(subItem.translate)}
                          </StyledTableCell>
                          {subItem.type === 'item' &&
                            roles.map((role) => {
                              const perm = role.permissions.find(
                                (r) => r.section.name === subItem.name
                              );

                              return perm && !role.is_vendor ? (
                                <StyledTableCell
                                  key={Math.random()}
                                  className="w-40 md:w-64 text-center font-semibold"
                                  padding="none"
                                  style={{ minWidth }}
                                >
                                  <Switch
                                    disabled={!!permSwitches[`can_manage${perm.id}`] || !canManage}
                                    checked={!!permSwitches[`can_view${perm.id}`]}
                                    onChange={(e) => {
                                      setPermSwitches({
                                        ...permSwitches,
                                        [`can_view${perm.id}`]: e.target.checked,
                                      });
                                      dispatch(
                                        changePermission([
                                          perm.id,
                                          e.target.checked,
                                          permSwitches[`can_manage${perm.id}`],
                                          role.id,
                                        ])
                                      );
                                    }}
                                  />
                                  <DevMode>id: {perm.id}</DevMode>
                                  <Switch
                                    disabled={!canManage}
                                    checked={!!permSwitches[`can_manage${perm.id}`]}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setPermSwitches({
                                          ...permSwitches,
                                          [`can_manage${perm.id}`]: e.target.checked,
                                          [`can_view${perm.id}`]: e.target.checked,
                                        });
                                        dispatch(changePermission([perm.id, 1, 1, role.id]));
                                      } else {
                                        setPermSwitches({
                                          ...permSwitches,
                                          [`can_manage${perm.id}`]: e.target.checked,
                                        });
                                        dispatch(
                                          changePermission([
                                            perm.id,
                                            !!permSwitches[`can_view${perm.id}`],
                                            e.target.checked,
                                            role.id,
                                          ])
                                        );
                                      }
                                    }}
                                  />
                                </StyledTableCell>
                              ) : null;
                            })}
                        </StyledTableRow>
                      ))}
                  </Fragment>
                ))}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default withRouter(PermissionsTable);
