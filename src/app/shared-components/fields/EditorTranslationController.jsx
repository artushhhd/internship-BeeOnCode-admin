// eslint-disable-next-line import/no-extraneous-dependencies
import CKEditor from 'ckeditor4-react';
// import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import { FILE_API_URL } from '@api/http';
import { useTranslation } from 'react-i18next';

export default function EditorTranslationController({
  control,
  name,
  setEditorData,
  content = 'CONTENT',
  langNO = false,
}) {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');

  return (
    <div className="mt-[30px]">
      {translationLanguages.map((l) => {
        return (
          translationLanguageInModal === l.id && (
            <Controller
              key={`${name}${l.id}`}
              name={`${name}${l.id}`}
              control={control}
              render={({ field }) => {
                return (
                  <fieldset
                    className="border-1 p-8 rounded-md my-3 w-full"
                    style={{ border: '1px solid black' }}
                  >
                    <legend
                      className="mx-7 mx-2 text-current text-sm flex  items-center"
                      style={{ color: 'rgb(101,99,99)' }}
                    >
                      <div className="flex  items-center">
                        <span style={{ margin: '5px' }}>{t(content)}</span>

                        {!langNO ? (
                          <InputAdornment position="end" key={l.id}>
                            <img
                              src={`${FILE_API_URL}/${l.flag}`}
                              alt={l.slug}
                              className="w-[20px] h-[15px] ml-2 mr-2 max-w-2xl shadow-5"
                            />
                          </InputAdornment>
                        ) : (
                          ''
                        )}
                      </div>
                    </legend>
                    <CKEditor
                      data={field.value}
                      config={{
                        toolbar: [
                          { name: 'document', items: ['Source'] },
                          {
                            name: 'clipboard',
                            items: [
                              '-',
                              'Bold',
                              'Italic',
                              'Underline',
                              'Strike',
                              'Subscript',
                              'Superscript',
                              '-',
                              'RemoveFormat',
                            ],
                          },
                          {
                            name: 'paragraph',
                            items: [
                              'JustifyLeft',
                              'JustifyCenter',
                              'JustifyRight',
                              'JustifyBlock',
                              'NumberedList',
                              'BulletedList',
                              'Outdent',
                              'Indent',
                              '-',
                              'Link',
                              'Unlink',
                              'Image',
                              'Table',
                              'TableToolbar',
                              'TableProperties',
                              'TableCellProperties',
                            ],
                          },
                          { name: 'styles', items: ['Format', 'Styles', 'Font', 'FontSize'] },
                          { name: 'colors', items: ['TextColor', 'BGColor'] },
                          {
                            name: 'links',
                            items: ['Subscript', 'Superscript', 'HorizontalRule', 'SpecialChar'],
                          },
                          {
                            name: 'editing',
                            items: [
                              'Undo',
                              'Redo',
                              'SpellChecker',
                              'ShowBlocks',
                              'Find',
                              'Replace',
                            ],
                          },
                          {
                            name: 'document',
                            items: [
                              'NewPage',
                              'Print',
                              'Templates',
                              'a11ychecker',
                              'Language',
                              'EnhancedImage',
                            ],
                          },
                          // Additional toolbar groups and items you may add
                        ],
                        extraPlugins: [
                          'colorbutton',
                          'emoji',
                          'font',
                          'justify',
                          'autogrow',
                          'clipboard',
                          'pagebreak',
                          'dialog',
                          'link',
                          'image',
                          'table',
                          'widget',
                          'copyformatting',
                          'print',
                          'templates',
                        ], // Enable colorbutton plugin
                      }}
                      onChange={(event) => {
                        const data = event.editor.getData();
                        field.onChange(data);
                        setEditorData?.((prevState) => ({
                          ...prevState,
                          [translationLanguageInModal]: {
                            htmlValue: data,
                            // editorState: event.editor,
                          },
                        }));
                      }}
                    />
                  </fieldset>
                );
              }}
            />
          )
        );
      })}
    </div>
  );
}
