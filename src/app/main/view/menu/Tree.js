import { useState, useEffect } from 'react';
import SortableTree, {
  addNodeUnderParent,
  changeNodeAtPath,
  removeNodeAtPath,
  toggleExpandedForAll,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import DevMode from 'app/shared-components/DevMode';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { changeMenuOrder, changeMenuPlace, getMenu } from './store/menuSlice';

function Tree({ data, close, search, canManage }) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { model, menu } = useSelector((state) => state.menuApp.menuReducer);

  const [searchParams] = useSearchParams();
  const routeParams = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const idQuery = +searchParams.get('id') || +routeParams.id;
  const actionQuery = searchParams.get('action');
  const [treeData, setTreeData] = useState([]);
  const [nodeInfo, setNodeInfo] = useState({});
  const [cv, setCv] = useState([]);
  const [copiedPath, setCopiedPath] = useState([]);

  const getNodeKey = ({ treeIndex }) => treeIndex;

  useEffect(() => {
    if (data.length) {
      setTreeData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data.length && actionQuery === 'copied') {
      setTreeData(
        toggleExpandedForAll({
          treeData: data,
          expanded: true,
        })
      );
    }
  }, [data, actionQuery]);

  function updateTreeData(newTreeData) {
    setTreeData(newTreeData);
  }

  function expand(expanded) {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded,
      })
    );
  }

  useEffect(() => {
    if (treeData.length && !close) {
      expand(true);
    }

    if (treeData.length && close) {
      expand(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close]);

  useEffect(() => {
    if (cv.length === 2) {
      dispatch(changeMenuPlace(cv)).then(() => {
        setCv([]);
        dispatch(getMenu());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cv]);

  useEffect(() => {
    if (model && actionQuery === 'added') {
      const { path } = nodeInfo;
      const newTree = addNodeUnderParent({
        treeData,
        parentKey: path ? path[path.length - 1] : null,
        expandParent: true,
        getNodeKey,
        newNode: {
          id: model.id,
          title: model.translations.find((trs) => trs.language_id === translationLanguage).name,
        },
      });
      setTreeData(newTree.treeData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, actionQuery]);

  useEffect(() => {
    if (!idQuery) {
      setNodeInfo({});
    }
  }, [idQuery]);

  useEffect(() => {
    if (model && actionQuery === 'edited' && nodeInfo) {
      const { node, path } = nodeInfo;

      const newTree = changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          title: model.translations.find((trs) => trs.language_id === translationLanguage).name,
        },
      });

      setTreeData(newTree);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, actionQuery]);
  const x = [];

  useEffect(() => {
    if (actionQuery === 'deleted' && nodeInfo) {
      const { path } = nodeInfo;
      setTreeData(
        removeNodeAtPath({
          treeData,
          path,
          getNodeKey,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionQuery]);

  const colors = ['lightblue', '#ffcb6b', 'lightpink', 'coral', 'khaki'];

  return (
    <div>
      <div /* style={{ height: '130vh' }} */>
        <SortableTree
          id="step3"
          style={{ background: 'background.default' }}
          treeData={treeData}
          onChange={(updateNewTreeData) => {
            updateTreeData(updateNewTreeData);
          }}
          searchQuery={search}
          onDragStateChanged={({ isDragging }) => {
            if (!isDragging) {
              dispatch(changeMenuOrder(treeData));
            }
          }}
          isVirtualized={false}
          canDrag={({ node }) => !node.dragDisabled && !!canManage}
          generateNodeProps={(rowInfo) => {
            const {
              node: { id, depth, title },
              path,
            } = rowInfo;
            let str = '';

            if (search) {
              search = search.replace(/[ ]+/g, ' ');
              if (title.toLowerCase().includes(search.toLowerCase())) {
                str = title.replace(new RegExp(search, 'gi'), (match) => `<mark>${match}</mark>`);
              }
            }

            return {
              title: (
                <div
                  id="step2"
                  style={{
                    background:
                      (cv.length && cv[0] === id) || idQuery === id
                        ? `repeating-linear-gradient(45deg,#fff,#fff 10px,${
                            colors[path.length - 1]
                          } 10px, ${colors[path.length - 1]} 20px)`
                        : colors[path.length - 1],
                    padding: '12px',
                    display: 'flex',
                  }}
                >
                  <DevMode>
                    <div className="mr-8">{`ID: ${id}`}</div>
                  </DevMode>
                  {str ? <div dangerouslySetInnerHTML={{ __html: str }} /> : title}
                </div>
              ),
              buttons: [
                canManage ? (
                  <div className="flex items-center">
                    {idQuery !== id && (
                      <Link
                        id="step4"
                        style={{ background: 'green', color: 'white' }}
                        className="rounded-full w-20 h-20 text-16 cursor-pointer mr-5 p-3 text-center flex items-center justify-center"
                        title="Add child"
                        to={`new/edit?id=${id}`}
                        onClick={() => {
                          setNodeInfo(rowInfo);
                        }}
                      >
                        <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                      </Link>
                    )}

                    {idQuery !== id && (
                      <Box
                        id="step5"
                        className="mr-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          navigate(`/view/menu/${id}/edit`);
                          setNodeInfo(rowInfo);
                          setCv([]);
                        }}
                      >
                        <FuseSvgIcon>heroicons-outline:pencil-alt</FuseSvgIcon>
                      </Box>
                    )}
                    {cv[0] !== id ? (
                      <Box
                        className="mr-10 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (cv.length) {
                            setCv((state) => [...state, id]);
                          } else {
                            navigate(`/view/menu?action=copied`);
                            setCv([id]);
                            setCopiedPath(path);
                          }
                        }}
                      >
                        {cv.length ? (
                          <Box>
                            {path[0] !== copiedPath[0] || path.length <= copiedPath.length ? (
                              <ContentPasteGoIcon />
                            ) : null}
                          </Box>
                        ) : (
                          <Box id="step6">
                            <ContentCutIcon />
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box
                        id="step6"
                        className="mr-10 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCv([]);
                        }}
                      >
                        <CancelPresentationIcon />
                      </Box>
                    )}
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div className="w-5 h-5 " style={{ marginBottom: '33px' }}>
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {rowInfo.node.log && rowInfo.node.log?.length !== 0 ? (
                        <HistoryComponent data={rowInfo.node} name="MENU" />
                      ) : rowInfo.log && rowInfo.log?.length !== 0 ? (
                        <HistoryComponent data={rowInfo} name="MENU" />
                      ) : null}
                    </div>
                  </div>
                ) : (
                  ''
                ),
              ],
              style: { height: '50px' },
            };
          }}
        />
      </div>
    </div>
  );
}

export default Tree;
