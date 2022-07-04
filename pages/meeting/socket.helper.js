import meetingAgent from '../../agent';
import {
  EXIT_REASON,
  MEETING_EVENT_MAP,
  MEETING_MODE,
  END_MEETING_TYPE,
} from '../../constants/common';

const app = getApp();

export default {
  /** socket 事件处理 */
  initEventSystem() {
    meetingAgent.onMessage(e => {
      console.log('onMessage', e);
      switch (e.key) {
        case MEETING_EVENT_MAP.DISCONNECT:
          app.globalData.exitReason = EXIT_REASON.NETWORK_ERROR;
          this.exit();
          return;
        case MEETING_EVENT_MAP.KICK_OUT:
          app.globalData.exitReason = EXIT_REASON.KICK_OUT;
          this.exit();
          return;
        case MEETING_EVENT_MAP.MEETING_END: {
          const reasonType = e.data && e.data.reason && e.data.reason.type;
          if (reasonType === END_MEETING_TYPE.FREE_BENEFIT_EXPIRED) {
            app.globalData.exitReason = EXIT_REASON.FREE_BENEFIT_EXPIRED;
          } else if (reasonType === END_MEETING_TYPE.PAY_BENEFIR_EXPIRED) {
            app.globalData.exitReason = EXIT_REASON.PAY_BENEFIR_EXPIRED;
          } else if (reasonType === END_MEETING_TYPE.VMR_END_MEETING) {
            app.globalData.exitReason = EXIT_REASON.VMR_END_MEETING;
          }
          return this.exit();
        }
        case MEETING_EVENT_MAP.MEETING_INFO_UPDATE:
          return this.updateMeetingInfo(e.data);
        case MEETING_EVENT_MAP.MEMBER_JOIN:
          return this.addMember(e.data);
        case MEETING_EVENT_MAP.OPTIONS_CHANGED:
          return this.updateMeetingOptions(e.data);
        case MEETING_EVENT_MAP.MEMBER_QUIT:
          return this.deleteMember(e.data);
        case MEETING_EVENT_MAP.MEMBER_UPDATE:
          return this.updateMemberInfo(e.data, e.operator);
        case MEETING_EVENT_MAP.MODE_UPDATE:
          return this.updateMeetingMode(e.data);
        case MEETING_EVENT_MAP.MUTE_ALL:
          return this.onMuteAll(e.data);
        case MEETING_EVENT_MAP.REQUEST_TURN_ON_CAMERA:
          return this.showCameraModal();
        case MEETING_EVENT_MAP.REQUEST_TURN_ON_MICROPHONE:
          return this.showMircophoneModal();
        case MEETING_EVENT_MAP.MAIN_VENUE_UPDATE:
          return this.updateMainVenue(e.data);
        case MEETING_EVENT_MAP.ACTIVE_MEMBER_UPDATE:
          return this.updateActiveMember(e.data);
        default:
          console.warn('find unknown meeting event');
      }
    });
  },
  updateMeetingInfo(data) {
    // 更新会议信息
    const { name, code, password } = data;
    const info = {};
    if (name) {
      info.name = name.newValue;
    }
    if (code) {
      info.meetingCode = code.newValue;
    }
    if (password) {
      info.password = password.newValue;
    }
    this.setData({
      meetingInfo: { ...this.data.meetingInfo, ...info },
    });
  },
  updateMeetingMode(data) {
    const isShare = data.viewState === MEETING_MODE.SHARE;
    const newData = {
      presenter: isShare ? data.presenter || '' : '',
      viewState: data.viewState,
      isShowUnsupportWhiteBoard: data.viewState === MEETING_MODE.WHITE_BOARD,
    };
    if (isShare) {
      // 发起共享屏幕时，隐藏侧边栏
      newData.isShowMemberPanel = false;
      newData.isShowDetailPanel = false;
    }
    this.setData(newData);
  },
  updateMainVenue(data) {
    this.setData({
      mainVenueId: data.endpointId || '',
    });
    setTimeout(() => {
      this.setData({
        memberList: this.sortMemberList([...this.data.memberList]),
      });
    });
  },
  updateMemberInfo(member, operator = {}) {
    // 更新成员信息
    const memberList = [...this.data.memberList];
    const targetIndex = memberList.findIndex(
      item => item.endpointId === member.endpointId
    );
    const isSelfUpdate = member.endpointId === this.data.currentEndpointId;
    if (isSelfUpdate) {
      const isSelfAction =
        operator && this.data.currentEndpointId === operator.endpointId;
      if (member.isAudioMute && !isSelfAction) {
        // 关闭了我的麦克风
        this.showToast('主持人已关闭你的麦克风', 'middle');
        this.setData({
          isAudioMute: member.isAudioMute,
        });
      }
      if (member.isVideoMute && !isSelfAction) {
        // 关闭了我的摄像头
        this.showToast('主持人已关闭你的摄像头', 'middle');
        this.setData({
          isVideoMute: member.isVideoMute,
        });
      }
    }
    if (targetIndex > -1) {
      memberList[targetIndex] = { ...memberList[targetIndex], ...member };
    }
    this.setData({
      memberList: this.sortMemberList(memberList),
    });
  },
  addMember(member) {
    // 成员加入
    const memberList = [...this.data.memberList];
    const targetIndex = memberList.findIndex(
      item => item.endpointId === member.endpointId
    );
    if (targetIndex === -1) {
      this.preFormatMember(member);
      memberList.push(member);
      if (
        memberList.length <= 10 &&
        member.endpointId !== this.data.currentEndpointId
      ) {
        this.showToast(
          (member.name > 10 ? member.name.slice(0, 10) + '...' : member.name) +
            '加入会议'
        );
      }
      this.setData({
        memberList: this.sortMemberList(memberList),
        isFullScreen: memberList.length > 1 ? false : this.data.isFullScreen,
      });
    } else {
      // 如果加入的成员已经在列表里面了，只需要更新一下成员信息
      this.updateMemberInfo(member);
    }
  },
  deleteMember(member) {
    // 成员退出
    const memberList = [...this.data.memberList];
    const targetIndex = memberList.findIndex(
      item => item.endpointId === member.endpointId
    );
    if (targetIndex > -1) {
      const name = memberList[targetIndex].name;
      if (memberList.length <= 10) {
        this.showToast(
          (name > 10 ? name.slice(0, 10) + '...' : name) + '离开会议'
        );
      }
      memberList.splice(targetIndex, 1);
    }
    const { fixFirstEndpointId, activeVideoEndpointId } = this.data;
    const newData = {
      memberList: this.sortMemberList(memberList),
      isFullScreen: memberList.length === 1,
    };
    if (fixFirstEndpointId === member.endpointId) {
      // 如果固定在主屏幕的人走了，重置一下
      newData.fixFirstEndpointId = '';
      newData.isFixedMainScreen = false;
    }
    if (activeVideoEndpointId === member.endpointId) {
      newData.activeVideoEndpointId = '';
    }
    this.setData(newData);
  },
  onMuteAll(data) {
    const operator = data.operator;
    if (!this.data.isAudioMute) {
      this.showToast('主持人已关闭你的麦克风', 'middle');
    }
    // 全体静音
    const memberList = this.data.memberList.map(member => {
      if (
        member.endpointId === operator.endpointId ||
        this.data.mainVenueId === member.endpointId
      ) {
        // 主会场和操作者不静音
        return member;
      }
      return { ...member, isAudioMute: true };
    });
    this.setData({
      memberList: this.sortMemberList(memberList),
      isAudioMute: true,
    });
  },
  showCameraModal() {
    // 邀请打开摄像头
    this.setData({
      isShowMemberPanel: false,
      isShowDetailPanel: false,
      modal: {
        show: true,
        type: this.data.MODAL_TYPE.CAMERA,
        title: '主持人请求开启你的摄像头',
        cancelText: '保持关闭',
        confirmText: '开启',
      },
    });
  },
  showMircophoneModal() {
    // 邀请打开麦克风
    this.setData({
      isShowMemberPanel: false,
      isShowDetailPanel: false,
      modal: {
        show: true,
        type: this.data.MODAL_TYPE.MIC,
        title: '主持人请求开启你的麦克风',
        cancelText: '保持关闭',
        confirmText: '开启',
      },
    });
  },
  updateActiveMember(endpointId) {
    if (
      this.data.viewState !== MEETING_MODE.SHARE &&
      !this.data.isFixedMainScreen
    ) {
      // 不是共享屏幕，同时没有固定主画面
      this.setData({
        fixFirstEndpointId: endpointId,
      });
    }
    this.setData({
      activeVideoEndpointId: endpointId,
    });
  },
  updateMeetingOptions(data) {
    const { locked, unmuteSelfEnabled, muted } = data;
    this.setData({
      meetingOptions: { ...this.data.meetingOptions, ...data },
    });
    // locked 和 muted 不可能同时出现
    // unmuteSelfEnabled 和 muted 可以同时出现，但muted 出现就不用unmuteSelfEnabled的提示, muted的提示在另外逻辑处理
    if (muted !== undefined) {
      return;
    }
    if (locked) {
      this.showToast('会议已锁定，新成员将无法加入', 'middle');
    }
    if (locked === false) {
      this.showToast('会议已解除锁定，新成员可加入', 'middle');
    }
    if (unmuteSelfEnabled) {
      this.showToast('主持人已允许参会人自行解除静音', 'middle');
    }
    if (unmuteSelfEnabled === false) {
      this.showToast('主持人已禁止参会人自行解除静音', 'middle');
    }
  },
};
