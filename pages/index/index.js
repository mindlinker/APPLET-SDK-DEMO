// index.js
// 获取应用实例
import meetingAgent from '../../agent';
import { storageGet, storageSet } from '../../utils/storage';
import { EXIT_REASON } from '../../constants/common';
import CONFIG from '../../config.js';
import {
  USER_NO_REGISTER,
  MEETING_ROOM_PASSWORD_ERROR,
  MEETING_ROOM_PASSWORD_ANTI_BRUSH,
  MEETING_SESSION_NO_EXISTED,
  BEYOBD_MEETING_COUNT,
  MEETING_LOCKED,
  MEETING_BAN_JOIN,
  MEETING_MEMBER_BEYOND_COUNT,
  MEETING_MEMBER_BEYOND_COUNT_S,
  MEETING_USER_ALREADY_JOIN_OTHER_MEETING,
  MEETING_OTHER_USER_ALREADY_JOIN_OTHER_MEETING,
  APPLET_JOIN_LIMITED,
  MEETING_NOT_EXIST,
} from '../../constants/sdkCode';

const app = getApp();

const MEETING_CODE_STORAGE_KEY = 'joinCode';
const NAME_STORAGE_KEY = 'joinName';
export const MICROPHONE_STORAGE_KEY = 'joinMicphone';
const CAMERA_STORAGE_KEY = 'joinCamera';

Page({
  data: {
    meetingCode: '',
    name: '',
    microphoneActive: false,
    cameraActive: false,
    password: '',
    btnDisabled: true,
    bindingCode: '',
    buttonType: 'join',
    showPasswordInput: false,
    passwordWrong: false,
    showPassword: false,
    isJoining: false,
    modal: {
      title: '',
      type: '',
      mode: 'confirm',
      cancelText: '',
      confirmText: '',
    },
    MODAL_TYPE: {
      MIC_AUTH: 'MIC_AUTH',
      KICK_OUT: 'KICK_OUT',
      NETWORK_ERROR: 'NETWORK_ERROR',
      FREE_BENEFIT_EXPIRED: 'FREE_BENEFIT_EXPIRED',
      PAY_BENEFIR_EXPIRED: 'PAY_BENEFIR_EXPIRED',
      VMR_END_MEETING: 'VMR_END_MEETING',
    },
  },
  async onShow() {
    const exitReason = app.globalData.exitReason;
    switch (exitReason) {
      case EXIT_REASON.KICK_OUT:
        this.setData({
          modal: {
            show: true,
            type: this.data.MODAL_TYPE.KICK_OUT,
            mode: 'notice',
            title: '你已被主持人移出会议',
            confirmText: '确定',
          },
        });
        break;
      case EXIT_REASON.NETWORK_ERROR:
        this.setData({
          modal: {
            show: true,
            type: this.data.MODAL_TYPE.NETWORK_ERROR,
            title: '网络可能已断开',
            mode: 'confirm',
            confirmText: '重新入会',
            cancelText: '取消',
          },
        });
        break;
      case EXIT_REASON.FREE_BENEFIT_EXPIRED:
        this.setData({
          modal: {
            show: true,
            type: this.data.MODAL_TYPE.FREE_BENEFIT_EXPIRED,
            title: '免费服务单次会议最多为45分钟',
            mode: 'notice',
            confirmText: '确定',
          },
        });
        break;
      case EXIT_REASON.PAY_BENEFIR_EXPIRED:
        this.setData({
          modal: {
            show: true,
            type: this.data.MODAL_TYPE.PAY_BENEFIR_EXPIRED,
            title: '当前视频会议套餐已到期',
            mode: 'notice',
            confirmText: '确定',
          },
        });
        break;
      case EXIT_REASON.VMR_END_MEETING:
        this.setData({
          modal: {
            show: true,
            type: this.data.MODAL_TYPE.VMR_END_MEETING,
            title: '会议创建者已开启新的会议并结束了本场会议',
            mode: 'notice',
            confirmText: '确定',
          },
        });
        break;
    }
    app.globalData.exitReason = '';
  },
  async onLoad() {
    if (!app.globalData.logined) {
      await this.init();
    }
    const cacheCode = await storageGet(MEETING_CODE_STORAGE_KEY);
    const cacheName = await storageGet(NAME_STORAGE_KEY);
    const cacheMicphoneActive = await storageGet(MICROPHONE_STORAGE_KEY);
    const cacheCameraActive = await storageGet(CAMERA_STORAGE_KEY);
    const name =
      cacheName ||
      (app.globalData.userInfo
        ? app.globalData.userInfo.realName ||
          app.globalData.userInfo.displayName
        : '');
    this.setData({
      meetingCode: cacheCode || '',
      btnDisabled: (cacheCode || '').length < 8,
      name,
      microphoneActive: cacheMicphoneActive,
      cameraActive: cacheCameraActive,
    });
  },
  async init() {
    wx.showLoading({
      title: '加载中...',
    });
    try {
      await meetingAgent.init({
        serverUrl: CONFIG.serverUrl,
      });
      const userInfo = await meetingAgent.login();
      app.globalData.logined = true;
      app.globalData.userInfo = userInfo;
    } catch (err) {
      if (err.data && err.data.code === USER_NO_REGISTER) {
        const { bindingCode } = err.data;
        this.setData({
          bindingCode,
          buttonType: 'register',
        });
      }
    }
    wx.hideLoading();
  },
  onCodeInput(e) {
    // 会议号输入
    const strCode = (e.detail.value + '').trim().replace(/\D/g, '');
    this.setData({
      meetingCode: strCode.slice(0, 11),
      btnDisabled: strCode.length < 8,
    });
    storageSet(MEETING_CODE_STORAGE_KEY, strCode);
  },
  onPasswordInput(e) {
    // 密码输入
    this.setData({
      password: e.detail.value,
      passwordWrong: false,
    });
  },
  onMeetingNameInput(e) {
    // 参会名称输入
    this.setData({
      name: e.detail.value,
    });
    storageSet(NAME_STORAGE_KEY, e.detail.value);
  },
  switchMicrophone(e) {
    // 开关麦克风
    this.setData({
      microphoneActive: e.detail.value,
    });
    storageSet(MICROPHONE_STORAGE_KEY, e.detail.value);
  },
  switchCamera(e) {
    // 开关摄像头
    this.setData({
      cameraActive: e.detail.value,
    });
    storageSet(CAMERA_STORAGE_KEY, e.detail.value);
  },
  async joinMeeting() {
    if (!app.globalData.networkStatus.isConnected) {
      wx.showToast({
        title: '网络异常，请检查网络后重试',
        icon: 'none',
      });
      return;
    }
    // 加入会议
    wx.showLoading({
      title: '正在加入...',
    });
    this.setData({
      isJoining: true,
    });
    const { name, microphoneActive, cameraActive, meetingCode, password } =
      this.data;
    try {
      const { authSetting } = await wx.getSetting();
      let audioAuth = authSetting['scope.record'];
      if (typeof audioAuth === 'undefined') {
        // 没有授权过麦克风，弹出授权弹窗
        try {
          await wx.authorize({
            scope: 'scope.record',
          });
        } catch (error) {
          audioAuth = false;
        }
      }
      if (audioAuth === false) {
        this.setData({
          modal: {
            show: true,
            mode: 'confirm',
            type: this.data.MODAL_TYPE.MIC_AUTH,
            title: '您需要授权麦克风的使用权限，以更好的体验会议',
            cancelText: '取消',
            confirmText: '前往设置',
          },
        });
        wx.hideLoading();
        this.setData({
          isJoining: false,
        });
        return;
      }
      const result = await meetingAgent.joinMeeting({
        code: meetingCode.replace(/\s/g, ''),
        name,
        turnOnCamera: cameraActive,
        turnOnMicrophone: microphoneActive,
        password,
      });
      app.globalData.meetingInfo = result;
      wx.navigateTo({
        url: '/pages/meeting/index',
      });
      this.setData({
        isJoining: false,
        password: '',
      });
      wx.hideLoading();
      return true;
    } catch (err) {
      wx.hideLoading();
      if (err.data) {
        const { code } = err.data;
        switch (code) {
          case MEETING_ROOM_PASSWORD_ERROR:
            // 密码错误，弹出密码弹窗
            this.setData({
              showPasswordInput: true,
              passwordWrong: false,
              password: '',
            });
            break;
          case MEETING_ROOM_PASSWORD_ANTI_BRUSH:
            wx.showToast({
              icon: 'none',
              title: '密码输入错误次数过多，请5分钟后重试',
            });
            break;
          case MEETING_SESSION_NO_EXISTED:
          case MEETING_NOT_EXIST:
            wx.showToast({
              icon: 'none',
              title: '会议号错误或会议已结束',
            });
            break;
          case BEYOBD_MEETING_COUNT:
            wx.showToast({
              icon: 'none',
              title:
                '您的企业当前开启的会议场次已达上限，请等待其他会议结束后再试',
            });
            break;
          case MEETING_LOCKED:
            wx.showToast({
              icon: 'none',
              title: '会议已锁定，如需加入请联系主持人',
            });
            break;
          case MEETING_BAN_JOIN:
            wx.showToast({
              icon: 'none',
              title: '您已被禁止进入本次会议',
            });
            break;
          case MEETING_MEMBER_BEYOND_COUNT:
          case MEETING_MEMBER_BEYOND_COUNT_S:
            wx.showToast({
              icon: 'none',
              title: '当前视频会议参会人数已达上限',
            });
            break;
          case MEETING_USER_ALREADY_JOIN_OTHER_MEETING:
            wx.showToast({
              icon: 'none',
              title: '您有一场会议正在进行，需结束后才能发起新的会议',
            });
            break;
          case MEETING_OTHER_USER_ALREADY_JOIN_OTHER_MEETING:
            wx.showToast({
              icon: 'none',
              title: '会议发起人已在其他会议中，您暂时无法加入会议',
            });
            break;
          case APPLET_JOIN_LIMITED:
            wx.showToast({
              icon: 'none',
              title: '已达到小程序参会人数上限，无法加入',
            });
            break;
          default:
            wx.showToast({
              icon: 'none',
              title: '加入失败，' + code,
            });
        }
      } else {
        console.error(err);
        wx.showToast({
          title: '网络异常，请检查网络后重试',
          icon: 'none',
        });
      }
      this.setData({
        isJoining: false,
      });
      return err.data && err.data.code;
    }
  },
  async onGetPhoneNumber(e) {
    // 授权手机号并加入会议
    const { iv, encryptedData } = e.detail;
    if (iv && encryptedData) {
      const userInfo = await meetingAgent.registerByPhoneCode({
        code: this.data.bindingCode,
        encryptedData,
        iv,
      });
      this.setData({
        buttonType: 'join',
        name: userInfo.realName || userInfo.displayName,
      });
      app.globalData.logined = true;
      app.globalData.userInfo = userInfo;
      await this.joinMeeting();
    }
  },
  onHidePasswordModal() {
    this.setData({
      showPasswordInput: false,
      password: '',
    });
  },
  async onConfirmJoin() {
    this.setData({
      showPasswordInput: false,
    });
    const result = await this.joinMeeting();
    if (result === MEETING_ROOM_PASSWORD_ERROR) {
      this.setData({
        passwordWrong: true,
        password: '',
      });
    }
  },
  onSwitchShowPassword() {
    this.setData({
      showPassword: !this.data.showPassword,
    });
  },
  onModalCancel() {
    this.setData({
      modal: {
        ...this.data.modal,
        show: false,
      },
    });
  },
  onModalConfirm() {
    const { modal, MODAL_TYPE } = this.data;
    this.setData({
      modal: {
        ...modal,
        show: false,
      },
    });
    if (modal.type === MODAL_TYPE.NETWORK_ERROR) {
      this.joinMeeting();
    }
  },
});
