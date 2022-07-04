import meetingAgent from '../../agent';
import { EROLE_TYPE, MEETING_MODE } from '../../constants/common';
import { PERMISSION_DENIED } from '../../constants/sdkCode';
import { storageGet } from '../../utils/storage';
import { MICROPHONE_STORAGE_KEY } from '../index/index.js';
import SocketHelper from './socket.helper';

const app = getApp();

Page({
  data: {
    topHeight: 72,
    safeHeight: 0,
    mainScreenWidth: 300,
    isShowControlBar: true,
    memberList: [],
    audioPullUrl: '',
    pushUrl: '',
    cameraDirection: 'front',
    presenter: '',
    viewState: '',
    isFullScreen: false,
    currentEndpointId: '',
    isShowMemberPanel: false,
    isShowDetailPanel: false,
    isFooterMenuShow: false,
    isVideoMute: false,
    isAudioMute: false,
    isShowUnsupportWhiteBoard: false,
    toast: {
      show: false,
      title: '',
      position: 'bottom',
    },
    footerMenu: [],
    footerMenuTitle: '',
    mainVenueId: '',
    fixFirstEndpointId: '', // 在主屏幕成员的endpointId
    activeVideoEndpointId: '', // activeVideo的成员endpointId
    isFixedMainScreen: false, // 是否已经固定了主画面
    meetingInfo: {
      name: '',
      password: '',
      meetingCode: '',
    },
    meetingOptions: {
      locked: false,
      turnOnVideoSelfEnabled: true,
      unmuteSelfEnabled: true,
      muted: false,
    },
    modal: {
      show: false,
      type: '',
      title: '',
      cancelText: '',
      confirmText: '',
    },
    MODAL_TYPE: {
      MIC: 'MIC',
      CAMERA: 'CAMERA',
      MIC_SETTING: 'MIC_SETTING',
      CAMERA_SETTING: 'CAMERA_SETTING',
    },
  },
  controlBarTimeout: null,
  toastTimeout: null,
  keepScreenOnTimeout: null,
  retryLayoutTimes: 0, // 重试获取页面高宽样式布局的次数
  onUnload() {
    clearTimeout(this.toastTimeout);
    clearTimeout(this.controlBarTimeout);
    clearTimeout(this.keepScreenOnTimeout);
    this.toastTimeout = null;
    this.controlBarTimeout = null;
    this.keepScreenOnTimeout = null;
    if (app.globalData.meetingInfo) {
      this.exit();
    }
  },
  onLoad() {
    this.keepScreenOn();
    // 刚进入页面时获取到的页面数据可能会错误，延迟一点计算布局
    setTimeout(() => {
      this.computeStyle();
      this.showControlBar();
      this.initMeetingData();
    }, 80);
  },
  hideTips() {
    this.setData({
      isShowUnsupportWhiteBoard: false,
    });
  },
  showToast(title, position = 'bottom') {
    clearTimeout(this.toastTimeout);
    this.setData({
      toast: {
        show: true,
        title,
        position,
      },
    });
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 1500);
  },
  hideToast() {
    clearTimeout(this.toastTimeout);
    this.toastTimeout = null;
    this.setData({
      toast: {
        ...this.data.toast,
        show: false,
        title: '',
      },
    });
  },
  showControlBar() {
    clearTimeout(this.controlBarTimeout);
    this.setData({
      isShowControlBar: true,
    });
    this.controlBarTimeout = setTimeout(() => {
      this.setData({
        isShowControlBar: false,
      });
    }, 3000);
  },
  hideControlBar() {
    clearTimeout(this.controlBarTimeout);
    this.controlBarTimeout = null;
    this.setData({
      isShowControlBar: false,
    });
  },
  showMemberPanel() {
    this.setData({
      isShowMemberPanel: true,
      isShowDetailPanel: false,
    });
  },
  hideMemberPanel() {
    this.setData({
      isShowMemberPanel: false,
    });
  },
  showDetailPanel() {
    this.setData({
      isShowDetailPanel: true,
      isShowMemberPanel: false,
    });
  },
  hideDetailPanel() {
    this.setData({
      isShowDetailPanel: false,
    });
  },
  onModalCancel() {
    // 弹窗取消
    const { modal, MODAL_TYPE } = this.data;
    switch (modal.type) {
      case MODAL_TYPE.MIC:
        meetingAgent.rejectTurnOnMicrophone();
        break;
      case MODAL_TYPE.CAMERA:
        meetingAgent.rejectTurnOnCamera();
    }
    this.setData({
      modal: {
        ...this.data.modal,
        show: false,
      },
    });
  },
  async onModalConfirm() {
    // 弹窗确定
    const { modal, MODAL_TYPE } = this.data;
    switch (modal.type) {
      case MODAL_TYPE.MIC:
        this.switchMic(true);
        break;
      case MODAL_TYPE.CAMERA:
        this.switchCamera(true);
        break;
    }
    this.setData({
      modal: {
        ...this.data.modal,
        show: false,
      },
    });
  },
  computeStyle() {
    const rect = wx.getMenuButtonBoundingClientRect();
    const landscapeSystemInfo = wx.getSystemInfoSync();
    // 胶囊的距离屏幕顶部距离,px
    const topPosition = rect.top;
    // 胶囊高度,px
    const height = rect.height;
    const navBarHeight = topPosition + height + 4;
    const computeNavBarHeight = Math.min(navBarHeight, 72);
    const { windowHeight, windowWidth, safeArea } = landscapeSystemInfo;
    const safeHeight = windowHeight - safeArea.bottom;
    if (windowHeight > windowWidth && this.retryLayoutTimes < 3) {
      this.retryLayoutTimes++;
      setTimeout(() => {
        this.computeStyle();
      }, 500);
      return;
    }
    // （屏幕高度 - 顶部栏高度）/ 3 为小屏幕的高度，再按16:9换算得到宽度
    const minScreenWidth =
      (((windowHeight - computeNavBarHeight) / 3) * 16) / 9;
    const mainScreenWidth = windowWidth - minScreenWidth;
    this.setData({
      topHeight: computeNavBarHeight,
      safeHeight,
      mainScreenWidth,
    });
  },
  async initMeetingData() {
    if (app.globalData.meetingInfo) {
      const {
        endpoint: { id, isAudioMute, isVideoMute },
        serverOpts: { pushUrl, audioPullUrl },
        session: {
          code,
          topic: name,
          password,
          mode: { viewState, presenter },
          mainVenueId = '',
          options,
        },
      } = app.globalData.meetingInfo;

      const authIsVideoMute = await this.checkCameraAuth(isVideoMute);

      this.setData({
        pushUrl,
        audioPullUrl,
        presenter: viewState === MEETING_MODE.SHARE ? presenter : '',
        viewState,
        isShowUnsupportWhiteBoard: viewState === MEETING_MODE.WHITE_BOARD,
        currentEndpointId: id,
        meetingInfo: {
          meetingCode: code,
          password,
          name,
        },
        isAudioMute,
        isVideoMute: authIsVideoMute,
        mainVenueId,
        meetingOptions: options,
      });
      const joinIsAudioMute = await storageGet(MICROPHONE_STORAGE_KEY);
      if (isAudioMute && joinIsAudioMute) {
        // 入会即被静音，toast提示
        this.showToast('主持人已关闭你的麦克风', 'middle');
      }
      await this.initMember();
      this.initEventSystem();
    } else {
      wx.navigateBack({
        fail() {
          wx.redirectTo({
            url: '/pages/index/index',
          });
        },
      });
    }
  },
  ...SocketHelper,
  async checkCameraAuth(isVideoMute) {
    const { authSetting } = await wx.getSetting();
    const cameraAuth = authSetting['scope.camera'];
    // 没给摄像头权限，同时开了摄像头入会，给提示
    if (cameraAuth === false && !isVideoMute) {
      this.setData({
        modal: {
          show: true,
          type: this.data.MODAL_TYPE.CAMERA_SETTING,
          title: '您需要授权摄像头的使用权限，以更好的体验会议',
          cancelText: '取消',
          confirmText: '前往设置',
        },
      });
      await meetingAgent.turnOffCamera();
      return true;
    }
    return isVideoMute;
  },
  async initMember() {
    // 初始化成员
    const memberData = await meetingAgent.getMemberList();
    memberData.data.forEach(this.preFormatMember);
    const memberList = this.sortMemberList(memberData.data);
    const activeMember = memberList.find(
      item => item.endpointId !== this.data.currentEndpointId
    );
    this.setData({
      memberList,
      isFullScreen: memberData.data.length === 1,
      fixFirstEndpointId: activeMember
        ? activeMember.endpointId
        : memberList[0].endpointId,
      activeVideoEndpointId:
        this.data.activeVideoEndpointId ||
        (activeMember && activeMember.endpointId) ||
        memberList[0].endpointId,
    });
  },
  sortMemberList(memberList) {
    // 排序
    const { currentEndpointId, mainVenueId } = this.data;
    memberList.sort((a, b) => {
      if (a.endpointId === currentEndpointId) {
        // 我优先
        return -1;
      } else if (b.endpointId === currentEndpointId) {
        return 1;
      }
      if (
        (EROLE_TYPE[a.roleType] === EROLE_TYPE.MEMBER &&
          EROLE_TYPE[b.roleType] !== EROLE_TYPE.MEMBER) ||
        (EROLE_TYPE[b.roleType] === EROLE_TYPE.MEMBER &&
          EROLE_TYPE[a.roleType] !== EROLE_TYPE.MEMBER)
      ) {
        // 一个是主持人/组织者，一个是普通参会者，主持人优先
        return EROLE_TYPE[a.roleType] - EROLE_TYPE[b.roleType];
      }
      if (
        EROLE_TYPE[a.roleType] === EROLE_TYPE.HOST &&
        EROLE_TYPE[b.roleType] === EROLE_TYPE.HOST &&
        a.lastJoinTime < b.lastJoinTime
      ) {
        // 主持人按参会时间排
        return -1;
      }
      if (
        EROLE_TYPE[a.roleType] === EROLE_TYPE.MEMBER &&
        EROLE_TYPE[b.roleType] === EROLE_TYPE.MEMBER
      ) {
        // 普通参会人
        if (a.endpointId === mainVenueId) {
          // 如果是主会场
          return -1;
        } else if (b.endpointId === mainVenueId) {
          return 1;
        }
        // 参会时间
        if (a.lastJoinTime < b.lastJoinTime) {
          return -1;
        }
      }
      return 1;
    });
    return memberList;
  },
  preFormatMember(member) {
    const currentEndpointId = app.globalData.meetingInfo.endpoint.id;
    member.name = member.nickname;
    member.defaultAvatar = member.nickname.slice(0, 1);
    member.avatar = member.headImage;
    member.isSelf = currentEndpointId === member.id;
  },
  async switchMic(e) {
    // val true 打开麦克风，false 关闭麦克风
    const val = typeof e === 'boolean' ? e : this.data.isAudioMute;
    // 权限校验
    const { authSetting } = await wx.getSetting();
    const audioAuth = authSetting['scope.record'];
    if (!audioAuth && val === true) {
      this.setData({
        modal: {
          show: true,
          type: this.data.MODAL_TYPE.MIC_SETTING,
          title: '您需要授权麦克风的使用权限，以更好的体验会议',
          cancelText: '取消',
          confirmText: '前往设置',
        },
      });
      return;
    }
    const currentMemberIndex = this.data.memberList.findIndex(
      member => member.endpointId === this.data.currentEndpointId
    );
    const currentMember = this.data.memberList[currentMemberIndex];
    try {
      if (currentMember.isAudioMute || val === true) {
        await meetingAgent.turnOnMicrophone();
      } else {
        await meetingAgent.turnOffMicrophone();
      }
      const memberList = [...this.data.memberList];
      memberList[currentMemberIndex] = {
        ...currentMember,
        isAudioMute: val === true ? false : !currentMember.isAudioMute,
      };
      this.setData({
        memberList: this.sortMemberList(memberList),
        isAudioMute: val === true ? false : !currentMember.isAudioMute,
      });
    } catch (err) {
      const code = err.data && err.data.code;
      if (code === PERMISSION_DENIED) {
        this.showToast('主持人已禁止参会人自行解除静音', 'middle');
      }
    }
  },
  async switchCamera(e) {
    // val true 打开摄像头，false 关闭摄像头
    const val = typeof e === 'boolean' ? e : this.data.isVideoMute;
    // 权限校验
    const { authSetting } = await wx.getSetting();
    let cameraAuth = authSetting['scope.camera'];
    if (typeof cameraAuth === 'undefined') {
      // 没有授权过摄像头，弹出授权弹窗
      try {
        await wx.authorize({
          scope: 'scope.camera',
        });
      } catch (error) {
        cameraAuth = false;
      }
    }
    if (cameraAuth === false && val === true) {
      this.setData({
        modal: {
          show: true,
          type: this.data.MODAL_TYPE.CAMERA_SETTING,
          title: '您需要授权摄像头的使用权限，以更好的体验会议',
          cancelText: '取消',
          confirmText: '前往设置',
        },
      });
      return;
    }
    try {
      const currentMemberIndex = this.data.memberList.findIndex(
        member => member.endpointId === this.data.currentEndpointId
      );
      const currentMember = this.data.memberList[currentMemberIndex];
      if (currentMember.isVideoMute || val === true) {
        await meetingAgent.turnOnCamera();
      } else {
        await meetingAgent.turnOffCamera();
      }
      const memberList = [...this.data.memberList];
      memberList[currentMemberIndex] = {
        ...currentMember,
        isVideoMute: val === true ? false : !currentMember.isVideoMute,
      };
      this.setData({
        memberList: this.sortMemberList(memberList),
        isVideoMute: val === true ? false : !currentMember.isVideoMute,
      });
    } catch (err) {
      const code = err.data && err.data.code;
      if (code === PERMISSION_DENIED) {
        this.showToast('主持人已禁止参会人自行开启摄像头', 'middle');
      }
    }
  },
  switchCameraDirection() {
    this.setData({
      cameraDirection: this.data.cameraDirection === 'front' ? 'back' : 'front',
    });
  },
  showMenu(e) {
    this.setData({
      isFooterMenuShow: true,
      footerMenuTitle: '',
      footerMenu: e.detail,
    });
  },
  showExitMenu() {
    // 打开底部退出菜单
    this.setData({
      isFooterMenuShow: true,
      footerMenuTitle: '确定离开当前会议吗？',
      footerMenu: [
        {
          label: '离开会议',
          color: '#ff5151',
          id: 'exit',
        },
      ],
    });
  },
  hideFooterMenu() {
    this.setData({
      isFooterMenuShow: false,
      menu: [],
    });
  },
  onClickMenu(e) {
    const { id, data } = e.detail;
    const { viewState, fixFirstEndpointId, activeVideoEndpointId } = this.data;
    if (id === 'exit') {
      // 退会
      this.exit();
    } else if (id === 'mic') {
      // 静音/取消静音
      this.switchMic();
    } else if (id === 'fixed') {
      // 固定主屏幕
      if (viewState === MEETING_MODE.SHARE) {
        this.showToast('正在接收桌面共享，无法切换画面', 'middle');
      } else {
        const isFixAction = fixFirstEndpointId !== data.endpointId;
        this.setData({
          fixFirstEndpointId: isFixAction
            ? data.endpointId
            : activeVideoEndpointId,
          isFixedMainScreen: isFixAction,
        });
        this.showToast(
          isFixAction ? '已固定当前画面' : '已恢复到默认显示',
          'middle'
        );
      }
    }
  },
  async exit() {
    // 退出会议
    this.exitMeeting();
    app.globalData.meetingInfo = null;
    wx.navigateBack({
      fail() {
        wx.redirectTo({
          url: '/pages/index/index',
        });
      },
    });
  },
  async exitMeeting() {
    try {
      await meetingAgent.quitMeeting();
    } catch (error) {
      console.warn(error);
    }
  },
  clickScreen(e) {
    if (e.detail.detail.isMain || e.detail.detail.isWrapper) {
      // 点击主画面时，显示/隐藏底部控制菜单
      if (this.data.isShowControlBar) {
        this.hideControlBar();
      } else {
        this.showControlBar();
      }
    } else {
      // 点击小画面，切换主次画面
      if (this.data.viewState === MEETING_MODE.SHARE) {
        this.showToast('正在接收桌面共享，无法切换画面', 'middle');
        return;
      }
      this.setData({
        fixFirstEndpointId: e.detail.detail.member.endpointId,
        isFixedMainScreen: true,
      });
      this.showToast('已固定当前画面', 'middle');
    }
  },
  keepScreenOn() {
    wx.setKeepScreenOn({
      keepScreenOn: true,
      complete: () => {
        setTimeout(() => {
          this.keepScreenOn();
        }, 10000);
      },
    });
  },
});
