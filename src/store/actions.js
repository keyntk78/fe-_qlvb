// action - customization reducer
export const SET_MENU = '@customization/SET_MENU';
export const MENU_TOGGLE = '@customization/MENU_TOGGLE';
export const MENU_OPEN = '@customization/MENU_OPEN';
export const SET_FONT_FAMILY = '@customization/SET_FONT_FAMILY';
export const SET_BORDER_RADIUS = '@customization/SET_BORDER_RADIUS';
export const SET_USERS = '@customization/SET_USERS';
export const SET_ROLES = '@customization/SET_ROLES';
export const SET_HINHTHUCDAOTAO = '@customization/SET_HINHTHUCDAOTAO';
export const ADD_USER = '@customization/ADD_USER';
export const ADD_ROLE = '@customization/ADD_ROLE';
export const UPDATE_USER = '@customization/UPDATE_USER';
export const UPDATE_ROLE = '@customization/UPDATE_ROLE';
export const DELETE_USER = '@customization/DELETE_USER';
export const DELETE_ROLE = '@customization/DELETE_ROLE';
export const SELECTED_USER = '@customization/SELECTED_USER';
export const SELECTED_ROLE = '@customization/SELECTED_ROLE';
export const SELECTED_REPORT = '@customization/SELECTED_REPORT';
export const POPUP_OPEN = '@customization/POPUP_OPEN';
export const LOADING = '@customization/LOADING';
export const DISABLED_BUTTON = '@customization/DISABLED_BUTTON';
export const SUB_POPUP_OPEN = '@customization/SUB_POPUP_OPEN';
export const SUB_SUB_POPUP_OPEN = '@customization/SUB_SUB_POPUP_OPEN';
export const PROFILE_OPEN = '@customization/PROFILE_OPEN';
export const INSTRUCT_OPEN = '@customization/INSTRUCT_OPEN';
export const SHOW_ALERT = '@customization/SHOW_ALERT';
export const HIDE_ALERT = '@customization/HIDE_ALERT';
export const RELOAD_DATA = '@customization/RELOAD_DATA';
export const RELOAD_NOTIFICATION = '@customization/RELOAD_NOTIFICATION';
export const SET_MENU_CUSTOM = '@customization/SET_MENU_CUSTOME';
export const SET_REPORT = '@customization/SET_REPORT';
export const SELECTED_FUNCTION = '@customization/SELECTED_FUNCTION';
export const SELECTED_HINHTHUCDAOTAO = '@customization/SELECTED_HINHTHUCDAOTAO';
export const SELECTED_MENU = '@customization/SELECTED_MENU';
export const DONVI = '@customization/DONVI';
export const SELECTED_MONTHI = '@customization/SELECTED_MONTHI';
export const SELECTED_DONVITRUONG = '@customization/SELECTED_DONVITRUONG';
export const SELECTED_DANHMUC = '@customization/SELECTED_DANHMUC';
export const SELECTED_LANGUAGE = '@customization/SELECTED_LANGUAGE';
export const SELECTED_ACTION = '@customization/SELECTED_ACTION';
export const SELECTED_NAMTHI = '@customization/SELECTED_NAMTHI';
export const SELECTED_HEDAOTAO = '@customization/SELECTED_HEDAOTAO';
export const SELECTED_KHOATHI = '@customization/SELECTED_KHOATHI';
export const SELECTED_CONFIG = '@customization/SELECTED_CONFIG';
export const SELECTED_HOCSINH = '@customization/SELECTED_HOCSINH';
export const SELECTED_CONFIG_DONVI = '@customization/SELECTED_CONFIG_DONVI';
export const USER_LOGIN = '@customization/USER_LOGIN';
export const SELECTED_HOCSINHTOTNGHIEP = '@customization/SELECTED_HOCSINHTOTNGHIEP';
export const SELECTED_PHOIGOC = '@customization/SELECTED_PHOIGOC';
export const SELECTED_CCCD = '@customization/SELECTED_CCCD';
export const SELECTED_PHOISAO = '@customization/SELECTED_PHOISAO';
export const SELECTED_DANHMUCTOTNGHIEP = '@customization/SELECTED_DANHMUCTOTNGHIEP';
export const SELECTED_DANTOC = '@customization/SELECTED_DANTOC';
export const SELECTED_SOGOC = '@customization/SELECTED_SOGOC';
export const SELECTED_SOSAO = '@customization/SELECTED_SOSAO';
export const CAPBANG_INFOR = '@customization/CAPBANG_INFOR';
export const CAPBANG_BANSAO = '@customization/CAPBANG_BANSAO';
export const TRACUU_VANBANG = '@customization/TRACUU_VANBANG';
export const SELECTED_CONFIGPHOIGOC = '@customization/SELECTED_CONFIGPHOIGOC';
export const SELECTED_CONFIGPHOISAO = '@customization/SELECTED_CONFIGPHOISAO';
export const SELECTED_LOAITINTUC = '@customization/SELECTED_LOAITINTUC';
export const SELECTED_TINTUC = '@customization/SELECTED_TINTUC';
export const SELECTED_TINNHAN = '@customization/SELECTED_TINNHAN';
export const SELECTED_THONGTIN = '@customization/SELECTED_THONGTIN';
export const SELECTED_MESSAGECONFIG = '@customization/SELECTED_MESSAGECONFIG';
export const IS_NEW = '@customization/IS_NEW';
export const NOTIFICATIONS = '@customization/NOTIFICATIONS';
export const NOTIFICATION_COUNT = '@customization/NOTIFICATION_COUNT';
export const PAGE_SIZE = '@customization/PAGE_SIZE';
export const SELECTED_INFO_MESSAGE = '@customization/SELECTED_INFO_MESSAGE';
export const INFO_HOCSINH = '@customization/INFO_HOCSINH';
export const UPDATE_VBCC = '@customization/UPDATE_VBCC';
export const LIST_DANHMUC = '@customization/LIST_DANHMUC';
export const SELECTED_VALUE = '@customization/SELECTED_VALUE';

// actions.js
export const setUsers = (data) => ({ type: SET_USERS, users: data });
export const setRoles = (data) => ({ type: SET_ROLES, roles: data });
export const addUser = (user) => ({ type: ADD_USER, user: user });
export const addRole = (role) => ({ type: ADD_ROLE, role: role });
export const updatedUser = (user) => ({ type: UPDATE_USER, user: user });
export const updatedRole = (role) => ({ type: UPDATE_ROLE, role: role });
export const deletedUser = (userId) => ({ type: DELETE_USER, userId: userId });
export const deletedRole = (roleId) => ({ type: DELETE_ROLE, roleId: roleId });
export const selectedUser = (user) => ({ type: SELECTED_USER, selectedUser: user });
export const selectedHocsinh = (hocsinh) => ({ type: SELECTED_HOCSINH, selectedHocsinh: hocsinh });
export const selectedCCCD = (cccd) => ({ type: SELECTED_CCCD, selectedCCCD: cccd });
export const selectedRole = (role) => ({ type: SELECTED_ROLE, selectedRole: role });
export const selectedReport = (report) => ({ type: SELECTED_REPORT, selectedReport: report });
export const setOpenPopup = (status) => ({ type: POPUP_OPEN, openPopup: status });
export const setLoading = (status) => ({ type: LOADING, loading: status });
export const setDisabledButton = (status) => ({ type: DISABLED_BUTTON, disabledButton: status });
export const setOpenSubPopup = (status) => ({ type: SUB_POPUP_OPEN, openSubPopup: status });
export const setOpenSubSubPopup = (status) => ({ type: SUB_SUB_POPUP_OPEN, openSubSubPopup: status });
export const setOpenProfile = (status) => ({ type: PROFILE_OPEN, openProfile: status });
export const setOpenInstruct = (status) => ({ type: INSTRUCT_OPEN, openInstruct: status });
export const setReloadData = (status) => ({ type: RELOAD_DATA, reloadData: status });
export const setReloadNotification = (status) => ({ type: RELOAD_NOTIFICATION, reloadNotification: status });
export const selectedFunction = (functions) => ({ type: SELECTED_FUNCTION, selectedFunction: functions });
export const selectedHinhthucdaotao = (hinhthucdaotao) => ({ type: SELECTED_HINHTHUCDAOTAO, selectedHinhthucdaotao: hinhthucdaotao });
export const selectedMenu = (menu) => ({ type: SELECTED_MENU, selectedMenu: menu });
export const selectedMonthi = (monthi) => ({ type: SELECTED_MONTHI, selectedMonthi: monthi });
export const selectedDonvitruong = (donvitruong) => ({ type: SELECTED_DONVITRUONG, selectedDonvitruong: donvitruong });
export const selectedDanhmuc = (danhmuc) => ({ type: SELECTED_DANHMUC, selectedDanhmuc: danhmuc });
export const selectedAction = (action) => ({ type: SELECTED_ACTION, selectedAction: action });
export const selectedNamthi = (namthi) => ({ type: SELECTED_NAMTHI, selectedNamthi: namthi });
export const selectedKhoathi = (khoathi) => ({ type: SELECTED_KHOATHI, selectedKhoathi: khoathi });
export const selectedHedaotao = (hedaotao) => ({ type: SELECTED_HEDAOTAO, selectedHedaotao: hedaotao });
export const selectedConfig = (config) => ({ type: SELECTED_CONFIG, selectedConfig: config });
export const selectedConfigDonvi = (config) => ({ type: SELECTED_CONFIG_DONVI, selectedConfigDonvi: config });
export const selectedPhoigoc = (phoigoc) => ({ type: SELECTED_PHOIGOC, selectedPhoigoc: phoigoc });
export const selectedPhoisao = (phoisao) => ({ type: SELECTED_PHOISAO, selectedPhoisao: phoisao });
export const selectedLoaiTinTuc = (data) => ({ type: SELECTED_LOAITINTUC, selectedLoaiTinTuc: data });
export const selectedTinTuc = (data) => ({ type: SELECTED_TINTUC, selectedTinTuc: data });
export const selectedTinNhan = (data) => ({ type: SELECTED_TINNHAN, selectedTinNhan: data });
export const selectedMessageConfig = (data) => ({ type: SELECTED_MESSAGECONFIG, selectedMessageConfig: data });
export const selectedDanToc = (data) => ({ type: SELECTED_DANTOC, selectedDanToc: data });
export const setIsNew = (data) => ({ type: IS_NEW, isNew: data });
export const setNotifications = (data) => ({ type: NOTIFICATIONS, notifications: data });
export const setNotificationCount = (data) => ({ type: NOTIFICATION_COUNT, notificationCount: data });
export const setPageSize = (data) => ({ type: PAGE_SIZE, pageSize: data });
export const setSelectedInfoMessage = (data) => ({ type: SELECTED_INFO_MESSAGE, selectedInfoMessage: data });
export const setInfoHocSinh = (data) => ({ type: INFO_HOCSINH, infoHocSinh: data });
export const listDanhMuc = (data) => ({ type: LIST_DANHMUC, listDanhMuc: data });
export const setCapBangInfor = (infor) => ({ type: CAPBANG_INFOR, capBangInfor: infor });
export const setCapBangBanSao = (infor) => ({ type: CAPBANG_BANSAO, capBangBansao: infor });
export const setSelectedValue = (value) => ({ type: SELECTED_VALUE, selectedValue: value });

export const selectedConfigPhoiGoc = (configphoigoc) => ({ type: SELECTED_CONFIGPHOIGOC, selectedConfigPhoiGoc: configphoigoc });
export const selectedConfigPhoiSao = (configphoisao) => ({ type: SELECTED_CONFIGPHOISAO, selectedConfigPhoiSao: configphoisao });

export const selectedDanhmuctotnghiep = (danhmuctotnghiep) => ({
  type: SELECTED_DANHMUCTOTNGHIEP,
  selectedDanhmuctotnghiep: danhmuctotnghiep
});

export const selectedSogoc = (sogoc) => ({ type: SELECTED_SOGOC, selectedSogoc: sogoc });
export const selectedSosao = (sosao) => ({ type: SELECTED_SOSAO, selectedSosao: sosao });
export const setTracuu = (infor) => ({ type: TRACUU_VANBANG, setTracuu: infor });
export const setSelectedLanguage = (language) => ({ type: SELECTED_LANGUAGE, selectedLanguage: language });
export const selectedThongtin = (thongtin) => ({ type: SELECTED_THONGTIN, selectedThongtin: thongtin });
export const selectedHocsinhtotnghiep = (hocsinh) => ({ type: SELECTED_HOCSINHTOTNGHIEP, selectedHocsinhtotnghiep: hocsinh });
export const showAlert = (alertId, alertType, alertContent) => ({
  type: SHOW_ALERT,
  payload: { alertId, alertType, alertContent }
});
export const hideAlert = (alertId) => ({
  type: HIDE_ALERT,
  payload: { alertId }
});
export const setMenuCustom = (menu) => ({
  type: SET_MENU_CUSTOM,
  menu: menu
});
export const setReport = (report) => ({
  type: SET_REPORT,
  report: report
});
export const setDonvi = (donvi) => ({
  type: DONVI,
  donvi: donvi
});
export const userLogin = (user) => ({
  type: USER_LOGIN,
  user: user
});
export const upDateVBCC = (up_vbcc) => ({
  type: UPDATE_VBCC,
  up_vbcc: up_vbcc
});
