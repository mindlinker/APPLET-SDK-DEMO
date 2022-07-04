import { MEETING_MODE } from '../../../constants/common';
import {
  NETWORK_OFFLINE,
} from '../../../constants/mediaCode';


Component({
  properties: {
    audioPullUrl: {
      type: String,
      value: '',
    },
    member: {
      type: Array,
      value: [],
    },
    safeHeight: Number,
    mainScreenWidth: Number,
    cameraDirection: String,
    presenter: String,
    pushUrl: String,
    viewState: String,
    fixFirstEndpointId: String,
    topHeight: Number,
    isFullScreen: Boolean,
    mainVenueId: String,
  },
  data: {
    showMember: [],
  },
  observers: {
    'member, viewState, fixFirstEndpointId, presenter': function (
      memberList,
      viewState,
      fixFirstEndpointId,
      presenter
    ) {
      const showMemberList = this.computeShowMember(
        memberList,
        viewState,
        fixFirstEndpointId,
        presenter
      );
      this.setData({
        showMember: showMemberList,
      });
    },
  },
  methods: {
    computeShowMember(
      memberList = [],
      viewState,
      fixFirstEndpointId,
      presenter
    ) {
      // 计算应该显示在屏幕上的成员
      if (!memberList.length) {
        return [];
      }
      // 是否正在屏幕共享
      const isSharing = !!presenter && viewState === MEETING_MODE.SHARE;
      const sortedMemberList = [...memberList];
      sortedMemberList.sort((mA, mB) => {
        // 自己排在第一
        if (mA.isSelf) {
          return -1;
        } else if (mB.isSelf) {
          return 1;
        }
        // 如果在共享中，共享屏幕排第二
        if (isSharing) {
          if (mA.endpointId === presenter) {
            return -1;
          } else if (mB.endpointId === presenter) {
            return 1;
          }
        } else {
          // 人为的调整了位置，可能是用户调整了，也可能是activeVideo
          if (fixFirstEndpointId === mA.endpointId) {
            return -1;
          } else if (fixFirstEndpointId === mB.endpointId) {
            return 1;
          }
        }
        return mA.lastJoinTime - mB.lastJoinTime;
      });
      const showMemberList = sortedMemberList.slice(0, 4);
      if (showMemberList.length === 1) {
        // 如果只有自己在会中
        showMemberList[0] = {
          ...showMemberList[0],
          key: showMemberList[0].endpointId + showMemberList[0].isPresenter,
          isMain: true,
        };
        return showMemberList;
      }
      if (isSharing || fixFirstEndpointId !== showMemberList[0].endpointId) {
        // 排除非屏幕共享时，用户手动把"我"放到第一位
        // 其他情况下，"我"放在第二位
        const temp = showMemberList[0];
        showMemberList[0] = showMemberList[1];
        showMemberList[1] = temp;
      }
      if (isSharing && presenter === showMemberList[0].endpointId) {
        // 共享屏幕放在第一位
        const shareMember = showMemberList[0];
        const shareScreen = { ...showMemberList[0], isPresenter: true };
        showMemberList[0] = shareScreen;
        showMemberList.splice(2, 0, shareMember);
      }
      const newShowMember = showMemberList.slice(0, 4).map((member, index) => {
        member.key = member.endpointId + member.isPresenter;
        member.isMain = index === 0;
        return { ...member };
      });
      return newShowMember;
    },
    clickScreen(...args) {
      this.triggerEvent('clickScreen', ...args);
    },
    clickWrapper() {
      this.triggerEvent('clickScreen', {
        detail: {
          isMain: false,
          isWrapper: true,
        },
      });
    },
    onStateChange(e) {
      if (e.detail.code === NETWORK_OFFLINE) {
        // 如果是网络断连,1s后重试
        setTimeout(() => {
          const player = wx.createLivePlayerContext('_audio-live-player');
          player && player.play();
        }, 1000);
      }
    },
  },
});
