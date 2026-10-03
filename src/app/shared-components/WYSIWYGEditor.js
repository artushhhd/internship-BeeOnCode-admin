import { forwardRef, useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import { FILE_API_URL } from '@api/http';
import { useParams } from 'react-router-dom';

const toolbar = {
  options: [
    'inline',
    'remove',
    'colorPicker',
    'blockType',
    'fontSize',
    'fontFamily',
    'list',
    'textAlign',
    'link',
    'embedded',
    'emoji',
    'image',
    'history',
  ],
  inline: {
    // inDropdown: false,
    // className: undefined,
    // component: undefined,
    // dropdownClassName: undefined,
    // options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
    // bold: { icon: bold, className: undefined },
    // italic: { icon: italic, className: undefined },
    // underline: { icon: underline, className: undefined },
    // strikethrough: { icon: strikethrough, className: undefined },
    // monospace: { icon: monospace, className: undefined },
    // superscript: { icon: superscript, className: undefined },
    // subscript: { icon: subscript, className: undefined },
  },
  blockType: {
    // inDropdown: true,
    // options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
    // className: undefined,
    // component: undefined,
    // dropdownClassName: undefined,
  },
  fontSize: {
    // icon: fontSize,
    options: [8, 9, 10, 11, 12, 13, 14, 16, 18, 24, 30, 36, 48, 54, 60, 72, 96],
    // className: undefined,
    // component: undefined,
    // dropdownClassName: undefined,
  },
  fontFamily: {
    // options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    // className: undefined,
    // component: undefined,
    // dropdownClassName: undefined,
  },
  list: {
    // inDropdown: false,
    // className: undefined,
    // component: undefined,
    // dropdownClassName: undefined,
    // options: ['unordered', 'ordered', 'indent', 'outdent'],
    // unordered: { icon: unordered, className: undefined },
    // ordered: { icon: ordered, className: undefined },
    // indent: { icon: indent, className: undefined },
    // outdent: { icon: outdent, className: undefined },
  },
  textAlign: {
    // inDropdown: false,
    // className: undefined,
    // component: undefined,
    // dropdownClassName: undefined,
    options: ['left', 'center', 'right', 'justify'],
    // left: { icon: left, className: undefined },
    // center: { icon: center, className: undefined },
    // right: { icon: right, className: undefined },
    // justify: { icon: justify, className: undefined },
  },
  colorPicker: {
    // icon: "/assets/images/textEditor/colorPicker.png",
    className: 'editorToolBarIcon',
    // component: undefined,
    // popupClassName: undefined,
    colors: [
      'rgb(97,189,109)',
      'rgb(26,188,156)',
      'rgb(84,172,210)',
      'rgb(44,130,201)',
      'rgb(147,101,184)',
      'rgb(71,85,119)',
      'rgb(204,204,204)',
      'rgb(65,168,95)',
      'rgb(0,168,133)',
      'rgb(61,142,185)',
      'rgb(41,105,176)',
      'rgb(85,57,130)',
      'rgb(40,50,78)',
      'rgb(0,0,0)',
      'rgb(247,218,100)',
      'rgb(251,160,38)',
      'rgb(235,107,86)',
      'rgb(226,80,65)',
      'rgb(163,143,132)',
      'rgb(239,239,239)',
      'rgb(255,255,255)',
      'rgb(250,197,28)',
      'rgb(243,121,52)',
      'rgb(209,72,65)',
      'rgb(184,49,47)',
      'rgb(124,112,107)',
      'rgb(209,213,216)',
    ],
  },
  link: {
    // inDropdown: false,
    // className: undefined,
    // component: undefined,
    // popupClassName: undefined,
    // dropdownClassName: undefined,
    // showOpenOptionOnHover: true,
    // defaultTargetOption: '_self',
    options: ['link', 'unlink'],
    // link: { icon: link, className: undefined },
    // unlink: { icon: unlink, className: undefined },
    // linkCallback: undefined
  },
  emoji: {
    // icon: emoji,
    // className: undefined,
    // component: undefined,
    // popupClassName: undefined,
    emojis: [
      '📱',
      '☎️',
      '📞',
      '📠',
      '📧',
      '📎',
      '💬',
      '📝',
      '👈',
      '👉',
      '👆',
      '👇',
      '🌍',
      '🗺',
      '⏰',
      '📣',
      '🔔',
      '🖊',
      '📅',
      '✅',
      '❎',
      '❤️',
      '❌',
      '❓',
      '™️',
      '®️',
      '©️',
      '֏',
      '➖',
      '➕',
      '✖️',
      '➗',
      '🔎',
      '📍',
      '←',
      '↑',
      '→',
      '↓',
      '•',
      '🧍‍♂️',
      '🧍‍♀️',
    ],
  },
  // embedded: {
  // icon: embedded,
  // className: undefined,
  // component: undefined,
  // popupClassName: undefined,
  // embedCallback: undefined,
  // defaultSize: {
  //     height: 'auto',
  //     width: 'auto',
  // },
  // },
  image: {
    // icon: image,
    // className: undefined,
    // component: undefined,
    // popupClassName: undefined,
    // urlEnabled: true,
    // uploadEnabled: true,
    // alignmentEnabled: true,
    // uploadCallback: undefined,
    // previewImage: false,
    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
    // alt: { present: false, mandatory: false },
    // defaultSize: {
    //     height: 'auto',
    //     width: 'auto',
    // },
  },
  remove: {
    // icon: '/assets/images/textEditor/reset.png',
    className: 'editorToolBarIcon',
    // component: undefined
  },
  history: {
    // inDropdown: false,
    // className: undefined,
    // component: undefined,
    // dropdownClassName: undefined,
    options: ['undo', 'redo'],
    // undo: { icon: undo, className: undefined },
    // redo: { icon: redo, className: undefined },
  },
};

const Root = styled('div')({
  '& .rdw-dropdown-selectedtext': {
    color: 'inherit',
  },
  '& .rdw-editor-toolbar': {
    borderWidth: '0 0 1px 0!important',
    margin: '0!important',
  },
  '& .public-DraftEditor-content': {
    padding: '8px 12px',
    height: '300px!important',
  },
});

const getInitialState = (defaultValue) => {
  if (defaultValue) {
    const blocksFromHtml = htmlToDraft(defaultValue);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    return EditorState.createWithContent(contentState);
  }
  return EditorState.createEmpty();
};

const WYSIWYGEditor = forwardRef(
  ({ value, setEditorData, className, onChange, content = 'CONTENT' }, ref) => {
    const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
    const [editorState, setEditorState] = useState(null);
    const [defaultState, setDefaultState] = useState(EditorState.createEmpty());

    const routeParams = useParams();

    const onEditorDefaultStateChange = useCallback(
      (__editorState) => {
        setDefaultState(__editorState);

        return onChange(draftToHtml(convertToRaw(__editorState.getCurrentContent())));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange]
    );

    useEffect(() => {
      if ((routeParams.id === 'new' || routeParams.questionId === 'new') && !value) {
        setEditorState(EditorState.createEmpty());
      }
    }, [routeParams.id, routeParams.questionId, value]);

    useEffect(() => {
      if (value) {
        if (!editorState) {
          const initialState = getInitialState(value);
          onEditorDefaultStateChange(initialState);
          setEditorData((prevState) => ({
            ...prevState,
            [translationLanguageInModal]: {
              htmlValue: value,
              editorState: value,
            },
          }));
        }
      }
    }, [onEditorDefaultStateChange, setEditorData, translationLanguageInModal, value, editorState]);

    const { t } = useTranslation('navigation');

    function onEditorStateChange(_editorState) {
      const data = convertToRaw(_editorState.getCurrentContent());

      setEditorData((prevState) => {
        return {
          ...prevState,
          [translationLanguageInModal]: {
            htmlValue: draftToHtml(data),
            editorState: data,
          },
        };
      });
      setEditorState(_editorState);
      return onChange(draftToHtml(convertToRaw(_editorState.getCurrentContent())));
    }

    return (
      <>
        <fieldset
          className="border-1 p-8 rounded-md my-3 w-full"
          style={{ border: '1px solid black' }}
        >
          <legend
            className="mx-7 mx-2 text-current text-sm flex  items-center"
            style={{ color: 'rgb(101,99,99)' }}
          >
            <div className="flex  items-center ">
              <span style={{ margin: '5px' }}>{t(content)}</span>

              {translationLanguages.map((l) => {
                return (
                  translationLanguageInModal === l.id && (
                    <InputAdornment position="end" key={l.id}>
                      <img
                        src={`${FILE_API_URL}/${l.flag}`}
                        alt={l.slug}
                        className="w-[20px] h-[15px] max-w-2xl shadow-5"
                      />
                    </InputAdornment>
                  )
                );
              })}
            </div>
          </legend>
          <Root className={clsx('rounded-4 border-1 overflow-hidden w-full ', className)} ref={ref}>
            <Editor
              toolbar={toolbar}
              editorState={editorState || defaultState}
              onEditorStateChange={onEditorStateChange}
            />
          </Root>
        </fieldset>
      </>
    );
  }
);

export default WYSIWYGEditor;
