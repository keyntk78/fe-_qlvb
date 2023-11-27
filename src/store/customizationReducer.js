// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
  users: [],
  roles: [],
  capBangInfor: '123',
  capBangBansao: '',
  selectedUser: '',
  selectedHocsinh: '',
  selectedRole: '',
  selectedReport: '',
  selectedFunction: '',
  selectedNamthi: '',
  selectedKhoathi: '',
  selectedHedaotao: '',
  selectedHinhthucdaotao: '',
  selectedMenu: '',
  selectedDonvitruong: '',
  selectedDanhmuc: '',
  selectedMonthi: '',
  selectedConfig: '',
  selectedPhoigoc: '',
  selectedPhoisao: '',
  selectedThongtin: '',
  selectedConfigPhoiGoc: '',
  selectedConfigPhoiSao: '',
  selectedCCCD: '',
  selectedConfigDonvi: '',
  selectedLoaiTinTuc: '',
  selectedTinTuc: '',
  selectedTinNhan: '',
  selectedDanToc: '',
  selectedMessageConfig: '',
  selectedInfoMessage: '',
  setTracuu: '',
  donvi: '',
  selectedDanhmuctotnghiep: '',
  openPopup: false,
  openSubPopup: false,
  openSubSubPopup: false,
  loading: false,
  disabledButton: false,
  openProfile: false,
  showAlert: [],
  alertId: null,
  alertType: '',
  alertContent: '',
  reloadData: false,
  reloadNotification: false,
  menu: [],
  selectedLanguage: 'vi',
  user: null,
  isNew: false,
  notifications: [],
  notificationCount: 0,
  pageSize: 10,
  infoHocSinh: null,
  report: [],
  up_vbcc: '',
  listDanhMuc: [],
  selectedValue: ''
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
  let id;
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id]
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened
      };
    case actionTypes.CAPBANG_INFOR:
      return {
        ...state,
        capBangInfor: action.capBangInfor
      };
    //Cấp bằng bản sao
    case actionTypes.CAPBANG_BANSAO:
      return {
        ...state,
        capBangBansao: action.capBangBansao
      };
    case actionTypes.SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.fontFamily
      };
    // TRA CỨU
    case actionTypes.TRACUU_VANBANG:
      return {
        ...state,
        setTracuu: action.setTracuu
      };
    case actionTypes.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.borderRadius
      };
    case actionTypes.NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications
      };
    // User
    case actionTypes.SET_USERS:
      return {
        ...state,
        users: action.users
      };
    // Role
    case actionTypes.SET_ROLES:
      return {
        ...state,
        roles: action.roles
      };
    case actionTypes.LIST_DANHMUC:
      return {
        ...state,
        listDanhMuc: action.listDanhMuc
      };
    // cổng thông tin
    case actionTypes.SELECTED_THONGTIN:
      return {
        ...state,
        selectedThongtin: action.selectedThongtin
      };
    case actionTypes.SELECTED_INFO_MESSAGE:
      return {
        ...state,
        selectedInfoMessage: action.selectedInfoMessage
      };
    case actionTypes.SELECTED_VALUE:
      return {
        ...state,
        selectedValue: action.selectedValue
      };
    case actionTypes.ADD_USER:
      return {
        ...state,
        users: [...state.users, action.user]
      };
    case actionTypes.ADD_ROLE:
      return {
        ...state,
        roles: [...state.roles, action.role]
      };
    case actionTypes.UPDATE_USER: {
      const updatedUser = action.user;
      const updatedUsers = state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      return {
        ...state,
        users: updatedUsers
      };
    }
    case actionTypes.UPDATE_ROLE: {
      const updatedRole = action.role;
      const updatedRoles = state.roles.map((role) => (role.roleId === updatedRole.roleId ? updatedRole : role));
      return {
        ...state,
        roles: updatedRoles
      };
    }
    case actionTypes.DELETE_USER: {
      const userIdToDelete = action.userId;
      const updatedUsers = state.users.filter((user) => user.id !== userIdToDelete);
      return {
        ...state,
        users: updatedUsers
      };
    }
    case actionTypes.DELETE_ROLE: {
      const roleIdToDelete = action.roleId;
      const updatedRoles = state.roles.filter((role) => role.roleId !== roleIdToDelete);
      return {
        ...state,
        roles: updatedRoles
      };
    }
    case actionTypes.SELECTED_USER:
      return {
        ...state,
        selectedUser: action.selectedUser
      };
    case actionTypes.SELECTED_HOCSINH:
      return {
        ...state,
        selectedHocsinh: action.selectedHocsinh
      };
    case actionTypes.NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action.notificationCount
      };
    case actionTypes.SELECTED_DANHMUC:
      return {
        ...state,
        selectedDanhmuc: action.selectedDanhmuc
      };
    case actionTypes.SELECTED_DANTOC:
      return {
        ...state,
        selectedDanToc: action.selectedDanToc
      };
    case actionTypes.SELECTED_LOAITINTUC:
      return {
        ...state,
        selectedLoaiTinTuc: action.selectedLoaiTinTuc
      };
    case actionTypes.SELECTED_TINTUC:
      return {
        ...state,
        selectedTinTuc: action.selectedTinTuc
      };
    case actionTypes.SELECTED_TINNHAN:
      return {
        ...state,
        selectedTinNhan: action.selectedTinNhan
      };
    //Hinhthucdaotao

    case actionTypes.SELECTED_HINHTHUCDAOTAO:
      return {
        ...state,
        selectedHinhthucdaotao: action.selectedHinhthucdaotao
      };
    //Config

    case actionTypes.SELECTED_CONFIG:
      return {
        ...state,
        selectedConfig: action.selectedConfig
      };
    case actionTypes.INFO_HOCSINH:
      return {
        ...state,
        infoHocSinh: action.infoHocSinh
      };
    case actionTypes.SELECTED_CONFIG_DONVI:
      return {
        ...state,
        selectedConfigDonvi: action.selectedConfigDonvi
      };
    //Menu

    case actionTypes.SELECTED_MENU:
      return {
        ...state,
        selectedMenu: action.selectedMenu
      };
    //MonThi

    case actionTypes.SELECTED_MONTHI:
      return {
        ...state,
        selectedMonthi: action.selectedMonthi
      };
    //Danhmuctotnghiep

    case actionTypes.SELECTED_DANHMUCTOTNGHIEP:
      return {
        ...state,
        selectedDanhmuctotnghiep: action.selectedDanhmuctotnghiep
      };
    //Donvitruong

    case actionTypes.SELECTED_DONVITRUONG:
      return {
        ...state,
        selectedDonvitruong: action.selectedDonvitruong
      };

    // Functions
    case actionTypes.SELECTED_FUNCTION:
      return {
        ...state,
        selectedFunction: action.selectedFunction
      };
    // PhoiGoc
    case actionTypes.SELECTED_PHOIGOC:
      return {
        ...state,
        selectedPhoigoc: action.selectedPhoigoc
      };
    //CCCD
    case actionTypes.SELECTED_CCCD:
      return {
        ...state,
        selectedCCCD: action.selectedCCCD
      };
    // Configphoigoc
    case actionTypes.SELECTED_CONFIGPHOIGOC:
      return {
        ...state,
        selectedConfigPhoiGoc: action.selectedConfigPhoiGoc
      };
    // Phoisao
    case actionTypes.SELECTED_PHOISAO:
      return {
        ...state,
        selectedPhoisao: action.selectedPhoisao
      };
    case actionTypes.SELECTED_MESSAGECONFIG:
      return {
        ...state,
        selectedMessageConfig: action.selectedMessageConfig
      };
    // Configphoisao
    case actionTypes.SELECTED_CONFIGPHOISAO:
      return {
        ...state,
        selectedConfigPhoiSao: action.selectedConfigPhoiSao
      };
    // SoGoc
    case actionTypes.SELECTED_SOGOC:
      return {
        ...state,
        selectedSogoc: action.selectedSogoc
      };
    // Sosao
    case actionTypes.SELECTED_SOSAO:
      return {
        ...state,
        selectedSosao: action.selectedSosao
      };
    // Nam thi
    case actionTypes.SELECTED_NAMTHI:
      return {
        ...state,
        selectedNamthi: action.selectedNamthi
      };
    case actionTypes.SELECTED_KHOATHI:
      return {
        ...state,
        selectedKhoathi: action.selectedKhoathi
      };
    case actionTypes.SELECTED_HEDAOTAO:
      return {
        ...state,
        selectedHedaotao: action.selectedHedaotao
      };
    case actionTypes.SELECTED_LANGUAGE:
      return {
        ...state,
        selectedLanguage: action.selectedLanguage
      };
    case actionTypes.SELECTED_ROLE:
      return {
        ...state,
        selectedRole: action.selectedRole
      };
    case actionTypes.SELECTED_REPORT:
      return {
        ...state,
        selectedReport: action.selectedReport
      };
    case actionTypes.POPUP_OPEN:
      return {
        ...state,
        openPopup: action.openPopup
      };
    case actionTypes.SUB_POPUP_OPEN:
      return {
        ...state,
        openSubPopup: action.openSubPopup
      };
    case actionTypes.SUB_SUB_POPUP_OPEN:
      return {
        ...state,
        openSubSubPopup: action.openSubSubPopup
      };
    case actionTypes.LOADING:
      return {
        ...state,
        loading: action.loading
      };
    case actionTypes.PAGE_SIZE:
      return {
        ...state,
        pageSize: action.pageSize
      };
    case actionTypes.DISABLED_BUTTON:
      return {
        ...state,
        disabledButton: action.disabledButton
      };
    case actionTypes.PROFILE_OPEN:
      return {
        ...state,
        openProfile: action.openProfile
      };
    case actionTypes.RELOAD_DATA:
      return {
        ...state,
        reloadData: action.reloadData
      };
    case actionTypes.RELOAD_NOTIFICATION:
      return {
        ...state,
        reloadNotification: action.reloadNotification
      };
    case actionTypes.SELECTED_ACTION:
      return {
        ...state,
        selectedAction: action.selectedAction
      };
    case actionTypes.SELECTED_HOCSINHTOTNGHIEP:
      return {
        ...state,
        selectedHocsinhtotnghiep: action.selectedHocsinhtotnghiep
      };
    case actionTypes.SHOW_ALERT:
      return {
        ...state,
        showAlert: [...state.showAlert, action.payload]
      };
    case actionTypes.HIDE_ALERT:
      return {
        ...state,
        showAlert: state.showAlert.filter((alert) => alert.alertId !== action.payload.alertId)
      };
    case actionTypes.SET_MENU_CUSTOM:
      return {
        ...state,
        menu: action.menu
      };
    case actionTypes.SET_REPORT:
      return {
        ...state,
        report: action.report
      };
    case actionTypes.USER_LOGIN:
      return {
        ...state,
        user: action.user
      };
    case actionTypes.DONVI:
      return {
        ...state,
        donvi: action.donvi
      };
    case actionTypes.IS_NEW:
      return {
        ...state,
        isNew: action.isNew
      };
    case actionTypes.UPDATE_VBCC:
      return {
        ...state,
        up_vbcc: action.up_vbcc
      };
    // Default
    default:
      return state;
  }
};

export default customizationReducer;
