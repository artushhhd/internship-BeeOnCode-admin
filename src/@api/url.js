// dashboard

export const getDashboardURL = '/auth/settings/dashboard/data';

// roles
export const getRolesURL = '/auth/role/all';
export const addRoleURL = '/auth/role/add';
export const editRoleURL = '/auth/role/edit';
export const deleteRoleURL = '/auth/role/delete';

// permissions
export const synchronizationURL = '/auth/role/sections';
export const changePermissionStatusURL = '/auth/role/permission/change';
export const allPermissionsURL = '/auth/role/permissions/all';
export const getPermissionsByIdURL = '/auth/role/permission';

// admins
export const fetchAdminsUrl = '/auth/admin/all';
export const registerAdminUrl = '/auth/admin/add';
export const editAdminUrl = '/auth/admin/edit';
export const deleteAdminUrl = '/auth/admin/delete';
export const loginAdminUrl = '/auth/login';
export const editShortCutsURL = 'auth/admin/shortcuts';
export const checkSignedAdminURL = '/check/admin';

// languages
export const getLanguagesURL = '/auth/languages/all';
export const addLanguagesURL = '/auth/languages/add';
export const editLanguagesURL = '/auth/languages/edit';
export const deleteLanguageURL = '/auth/languages/delete';
export const orderLanguageURL = '/auth/languages/order';

// social

export const getSocialsURL = '/auth/social/all';
export const editSocialsURL = '/auth/social/save';
export const orderSocialURL = '/auth/social/order';
export const editSocialStatusURL = `/auth/social/status`;

// announcement

export const getAnnouncementURL = `/auth/announcement/all`;
export const addAnnouncementURL = '/auth/announcement/add';
export const deleteAnnouncementURL = '/auth/announcement/delete';
export const editAnnouncementURL = '/auth/announcement/edit';
export const orderAnnouncementURL = '/auth/announcement/order';
export const editAnnouncemenStatusURL = `/auth/announcement/status`;

// services
export const getServicesAll = '/auth/services/all';
export const addServicesURL = '/auth/services/add';
export const getServiceById = '/auth/services/get';
export const serviceDeleteURL = '/auth/services/delete';
export const editServiceURL = '/auth/services/edit';
export const serviceIsPublished = '/auth/services/is_published';
export const servicesOrderURL = '/auth/services/order';

// slides
export const getSlidesURL = `/auth/slider/all/active`;
export const addSlideURL = '/auth/slider/add';
export const editSlideURL = '/auth/slider/edit';
// export const SlideChangerURL = '/auth/slider/status';
export const deleteSlideURL = '/auth/slider/delete';
export const orderSlideUrl = `/auth/slider/order`;

// Step
export const getSecondaryMenuURL = `/auth/secondary_menu/all`;
export const orderSecondaryMenuURL = '/auth/secondary_menu/order';
export const addSecondaryMenuURL = '/auth/secondary_menu/add';
export const editSecondaryMenuURL = '/auth/secondary_menu/edit';
export const deleteSecondaryMenuURL = '/auth/secondary_menu/delete';
export const restoreSecondaryMenuURL = '/auth/status/restore';
export const editSecondaryMenuInfoURL = '/auth/status/edit/info';
export const getSecondaryMenuStatusUrl = '/auth/secondary_menu/status';
export const getSecondaryMenuUrl = '/auth/secondary_menu/get';

// settings
export const getSettingsURL = '/auth/settings/all';
export const saveSettingsURL = '/auth/settings/save';
export const getMissionURL = '/auth/homepage_section/all/active';
export const saveMissionURL = '/auth/homepage_section/save';

// footer
export const getSectionsURL = '/auth/footer-section/all';
export const addSectionURL = '/auth/footer-section/add';
export const editSectionURL = '/auth/footer-section/edit';
export const deleteSectionURL = '/auth/footer-section/delete';
export const orderSectionUrl = `/auth/footer-section/order`;

// pages
export const getPagesURL = `/auth/page/all`;
export const addPagesURL = `/auth/page/add`;
export const editPagesURL = `/auth/page/edit`;
export const editPagesStatusURL = `/auth/page/status`;
export const deletePagesURL = `/auth/page/delete`;
export const getSectionURL = `/auth/page/section/getbyid`;
export const addPagesSectionURL = `/auth/page/section/add`;
export const editPagesSectionURL = `/auth/page/section/edit`;
export const editPagesFileSectionFileURL = `/auth/page/section/file/edit`;
export const deletePagesSectionURL = `/auth/page/section/delete`;
export const addPagesSectionTabURL = `/auth/page/section/tab/add`;
export const editPagesSectionTabURL = `/auth/page/section/tab/edit`;
export const deletePagesSectionTabURL = `/auth/page/section/tab/delete`;
export const addPagesSectionAccordionURL = `/auth/page/section/accordion/add`;
export const editPagesSectionAccordionURL = `/auth/page/section/accordion/edit`;
export const deletePagesSectionAccordionURL = `/auth/page/section/accordion/delete`;
export const pageSectionsOrderUrl = `/auth/page/section/order`;
export const pageTabsOrderUrl = `/auth/page/section/tab/order`;
export const pageAccordionsOrderUrl = `/auth/page/section/accordion/order`;
export const pageDeleteStatusUrl = `/auth/page/delete/status`;
export const pageFilesOrderUrl = `/auth/page/section/file/order`;
export const pageLinkOrderUrl = `/auth/page/section/link/order`;
export const pageGalleryOrderUrl = `/auth/page/section/gallery/order`;
export const moveFileFromSectionURL = `/auth/page/section/move_items`;
export const moveSectionFromPageURL = `/auth/page/section/move_sections`;

// pageTemplates

export const getPageTemplatesURL = `/auth/page/template/all`;
export const addPageTemplatesURL = `/auth/page/template/add`;
export const editPageTemplatesURL = `/auth/page/template/edit`;
export const getPageTemplateSectionURL = `/auth/page/template/section/getbyid`;
export const addPageTemplateSectionURL = `/auth/page/template/section/add`;
export const deletePageTemplatesURL = `/auth/page/template/delete`;
export const PageTemplatesSectionsOrderURL = `/auth/page/template/section/order`;
export const editPageTemplatesStatusURL = `/auth/page/status`;
export const pageTemplateDeleteStatusUrl = `/auth/page/template/delete/status`;
export const deletePageSectionsSectionURL = `/auth/page/template/section/delete`;
export const addPageTemplateSectionTabURL = `/auth/page/template/section/tab/add`;
export const deletePageSectionsSectionTabURL = `/auth/page/template/section/tab/delete`;
export const addPageTemplatesSectionAccordionURL = `/auth/page/template/section/accordion/add`;
export const deletePageTemplateSectionAccordionURL = `/auth/page/template/section/accordion/delete`;

// menu
export const getMenuURL = `/auth/menu/all`;
export const orderMenuURL = '/auth/menu/order';
export const addMenuURL = '/auth/menu/add';
export const editMenuURL = '/auth/menu/edit';
export const deleteMenuURL = '/auth/menu/delete';
export const restoreMenuURL = '/auth/menu/restore';
export const editMenuInfoURL = '/auth/menu/edit/info';
export const getMenuByIdURL = '/auth/menu/get';
export const placeMenuURL = '/auth/menu/append';

// FAQ

export const getFAQURL = `/auth/faq/all`;
export const addFAQURL = '/auth/faq/add';
export const deleteFAQURL = '/auth/faq/delete';
export const editFAQURL = '/auth/faq/edit';
export const orderFAQURL = '/auth/faq/order';

// developers

export const dataResetUrl = `/auth/data/reset`;

export const cropImageURL = `/auth/media/crop`;

// file manager
export const getAllFilesURL = `/auth/media/all`;
export const getFileURL = `/auth/media/get`;
export const getAddFilesURL = `/auth/media/add`;
export const getAllFilesCountURL = `auth/media/count`;
export const editFileTitleAlt = `/auth/media/edit`;
export const addFolderURL = `/auth/media/folder/add`;
export const editFolderURL = `/auth/media/folder/edit`;
export const moveFilesURL = `/auth/media/move_files`;
export const deleteFileURL = `/auth/media/delete`;
export const extractFilesURL = `/auth/media/extract_files`;

// about
export const getAboutURL = `/auth/about`;
export const addAboutURL = `/auth/about/add`;
export const editAboutURL = `/auth/about/edit`;
export const deleteAboutURL = `/auth/about/delete`;

// backups
export const getDepartmentsURL = `/auth/department/all`;
export const orderDepartmentURL = '/auth/department/order';
export const addDepartmentURL = '/auth/department/add';
export const editDepartmentURL = '/auth/department/edit';
export const deleteDepartmentURL = '/auth/department/delete';
export const getDepartmentURL = '/auth/department/get';

// partners
export const getPartnersURL = `/auth/partners/all`;
export const orderPartnerURL = '/auth/partners/order';
export const addPartnerURL = '/auth/partners/add';
export const editPartnerURL = '/auth/partners/edit';
export const deletePartnerURL = '/auth/partners/delete';
export const getPartnerURL = '/auth/partners/get';
export const statusPartnerURL = '/auth/partners/status';

export const visiblePartnerURL = '/auth/partners/is_visible';

// Projects
export const getProjectsURL = '/auth/project/all';
export const getProjectByIdURL = '/auth/project/get';
export const addProjectURL = '/auth/project/add';
export const editProjectURL = '/auth/project/edit';
export const deleteProjectURL = '/auth/project/delete';
export const orderProjectURL = '/auth/project/order';
export const statusProjectURL = '/auth/project/is_published';
export const notifiedProjectURL = '/auth/project/is_notified';
export const excelUpload = '/auth/excel/upload';
export const excelEdit = '/auth/excel/edit';
export const downloadExcelURL = '/auth/excel/download-excel';

// projects areas
export const getAreasURL = `/auth/project/area/all`;
export const orderAreaURL = '/auth/project/area/order';
export const addAreaURL = '/auth/project/area/add';
export const editAreaURL = '/auth/project/area/edit';
export const deleteAreaURL = '/auth/project/area/delete';
export const getAreaByIdURL = '/auth/project/area/get';

// projects status
export const getStatusesURL = `/auth/project/status/all`;
export const orderStatusURL = '/auth/project/status/order';
export const addStatusURL = '/auth/project/status/add';
export const editStatusURL = '/auth/project/status/edit';
export const deleteStatusURL = '/auth/project/status/delete';
export const getStatusByIdURL = '/auth/project/status/get';

// projects regions
export const getRegionsURL = `/auth/project/region/all`;
export const orderRegionURL = '/auth/project/region/order';
export const addRegionURL = '/auth/project/region/add';
export const editRegionURL = '/auth/project/region/edit';
export const deleteRegionURL = '/auth/project/region/delete';
export const getRegionByIdURL = '/auth/project/region/get';
export const projectFilterURL = '/auth/project/all';

// categories
export const getCategoryURL = `/auth/page/gallery/category/all`;
export const orderCategoryURL = '/auth/project/region/order';
export const addCategoryURL = '/auth/page/gallery/category/add';
export const editCategoryURL = '/auth/page/gallery/category/edit';
export const deleteCategoryURL = '/auth/page/gallery/category/delete';
export const getCategoryByIdURL = '/auth/page/gallery/category/get';
// export const projectFilterURL = '/auth/project/all';

// News
export const getNewsURL = '/auth/news/all';
export const orderNewsURL = '/auth/news/order';
export const addNewsItemURL = '/auth/news/add';
export const editNewsItemURL = '/auth/news/edit';
export const deleteNewsItemURL = '/auth/news/delete';
export const getNewsByIdURL = '/auth/news/get';

export const statusNewsURL = '/auth/news/is_published';
export const isNotifiedNewsURL = '/auth/news/is_notified';
export const newsFilterURL = '/auth/news/all';

// step
export const getStepURL = '/auth/project/steps/all';
export const getStepByIdURL = '/auth/project/steps/get';
export const downloadFileURL = '/auth/project/steps/download';
export const addStepURL = '/auth/project/steps/add';
export const deleteStepURL = '/auth/project/steps/delete';
export const editStepURL = '/auth/project/steps/edit';
export const changeOrderURL = '/auth/project/steps/order';

// statistics
export const getStatisticsAll = '/auth/statistics/all';
export const addStatisticsURL = '/auth/statistics/add';
export const getStatisticById = '/auth/statistics/get';
export const statisticDeleteURL = '/auth/statistics/delete';
export const editStatisticURL = '/auth/statistics/edit';
export const statisticIsPubleshed = 'auth/statistics/is_published';
export const statisticsOrderURL = '/auth/statistics/order';

// youtube
export const getYoutubeSettingsURL = '/auth/youtube/all';
export const syncYoutubeSettingsURL = '/auth/youtube/sync';
export const changeStatusYoutubeSettingsURL = '/auth/youtube/status';
export const youtubeSettingsOrderURL = '/auth/youtube/order';

// translations
export const getTranslationsURL = '/auth/translations/all';
export const updateTranslationURL = '/auth/translations/edit';

// Backup

export const getBackupURL = '/backup/my_backup';
export const backupRestoreURL = '/backup/restore';
export const backupRunUrl = '/backup/run';
export const backupSaveURL = '/auth/backup_setting/save';
export const backupSettingsGet = '/auth/backup_setting/all';
