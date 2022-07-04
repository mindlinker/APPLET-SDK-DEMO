import meetingAgent from '../../../../agent';
import {
  NETWORK_OFFLINE,
  CONNECTED_SERVER_CODE,
  RECRIVE_FIRST_SCREEN,
  VIDEO_STUCK,
  START_RECONNECT_CODE,
  RTMP_DISCONNECT,
  BACK_PROCESS,
  PUSH_OFFLINE,
} from '../../../../constants/mediaCode';
import { EROLE } from '../../../../constants/common';


Component({
  properties: {
    cameraDirection: {
      type: String,
      value: 'front',
    },
    pushUrl: String,
    safeHeight: Number,
    mainScreenWidth: Number,
    isFullScreen: Boolean,
    member: Object,
    mainVenueId: String,
  },

  data: {
    videoState: 0,
    videoSrc: '',
    isLoading: true,
    style: {},
    isMain: false,
    EROLE,
    showPlayer: true,
  },
  observeTimeout: null,
  pusherContext: null,
  mainChangeTimeout: null,
  hasChangeLoading: false,
  pageLifetimes: {
    hide() {
      if (!this.properties.member.isSelf) {
        this.setData({
          isLoading: true,
        });
        this.hasChangeLoading = true;
      }
    },
    show() {
      // 修复切后台的时候，成员开了摄像头，回来的时候要重新装载拉流组件
      this.setData({
        showPlayer: false,
      });
      setTimeout(() => {
        this.setData({
          showPlayer: true,
        });
      }, 500);
    },
  },
  lifetimes: {
    ready() {
      if (this.properties.member.isSelf) {
        const pusherContext = wx.createLivePusherContext();
        pusherContext.start();
        this.pusherContext = pusherContext;
      }
    },
    detached() {
      if (this.data.videoSrc) {
        // 如果有开视频，取消订阅
        meetingAgent.unobserveMember({
          endpointId: this.properties.member.endpointId,
          pullUrl: this.data.videoSrc,
        });
      }
      clearTimeout(this.observeTimeout);
      clearTimeout(this.mainChangeTimeout);
    },
  },
  observers: {
    cameraDirection(cameraDirection) {
      this.pusherContext && this.pusherContext.switchCamera();
    },
    member(member) {
      const { isPresenter, isMain, isVideoMute, isSelf } = member;
      const { isMain: oldIsMain } = this.data;
      const { mainScreenWidth, isFullScreen } = this.properties;
      const { isLoading, videoSrc } = this.data;
      if (isMain && !oldIsMain & !isSelf && !isLoading) {
        // live-player 刚刚切换到主屏幕
        this.setData({
          isLoading: true,
        });
        // 先隐藏视频窗口，0.1s后再显示
        this.hasChangeLoading = false;
        // 规避live-player resize时会闪屏问题
        this.mainChangeTimeout = setTimeout(() => {
          this.resetLoading(isLoading);
        }, 400);
      }
      this.setData({
        style: `background-color: ${
          isPresenter && isLoading ? '#000' : '#1a1a1a'
        }; width: ${
          isFullScreen ? '100%' : isMain ? mainScreenWidth + 'px' : '100%'
        };`,
        isMain,
      });
      if (isSelf && !isVideoMute) {
        this.setData({
          isLoading: false,
        });
      } else if (isVideoMute && !isPresenter) {
        this.setData({
          isLoading: true,
          videoSrc: '',
          videoState: 0,
        });
        this.stopObserveVideo();
      }
      if (!videoSrc) {
        this.initPullUrl();
      }
    },
  },
  methods: {
    resetLoading(isLoading) {
      if (this.hasChangeLoading) {
        return;
      }
      this.setData({
        isLoading,
      });
      clearTimeout(this.mainChangeTimeout);
    },
    async initPullUrl() {
      const { isVideoMute, endpointId, isPresenter } = this.properties.member;
      if (!isVideoMute || isPresenter) {
        // 开了视频，或者是共享屏幕，获取拉流地址
        const { pullUrl } = await meetingAgent.getVideoPullUrl({
          endpointId,
          isPresenter,
        });
        if (pullUrl) {
          this.setData({
            videoSrc: pullUrl,
          });
        }
      }
    },
    onClickScreen() {
      this.triggerEvent('clickScreen', {
        isMain: this.properties.member.isMain,
        member: this.properties.member,
      });
    },
    async startObserveVideo() {
      const { videoSrc } = this.data;
      clearTimeout(this.observeTimeout);
      const { endpointId, isPresenter } = this.properties.member;
      if (videoSrc) {
        // 开始订阅视频
        await meetingAgent.observeMember({
          pullUrl: videoSrc,
          endpointId,
          isPresenter,
        });
        this.observeTimeout = setTimeout(() => {
          this.startObserveVideo();
        }, 1500);
      }
    },
    stopObserveVideo() {
      // 取消订阅视频
      clearTimeout(this.observeTimeout);
      this.observeTimeout = null;
    },
    onPusherStateChange(e) {
      const code = e.detail && e.detail.code;
      const msg = e.detail && e.detail.message;
      if (code === PUSH_OFFLINE) {
        // 如果网络断连，需要手动重启推流
        setTimeout(() => {
          if (this.pusherContext) {
            this.pusherContext.start();
          } else {
          }
        }, 500);
      }
    },
    onPlayerStateChange(e) {
      const code = e.detail.code;
      switch (code) {
        case CONNECTED_SERVER_CODE:
          this.startObserveVideo();
          break;
        case RECRIVE_FIRST_SCREEN:
        case VIDEO_STUCK:
          this.setData({
            isLoading: false,
          });
          this.stopObserveVideo();
          this.hasChangeLoading = true;
          break;
        case RTMP_DISCONNECT:
        case START_RECONNECT_CODE:
          this.setData({
            isLoading: true,
          });
          this.hasChangeLoading = true;
          break;
        case NETWORK_OFFLINE:
          // 如果是网络断连,1s后重试
          this.setData({
            isLoading: true,
          });
          this.hasChangeLoading = true;
          setTimeout(() => {
            const player = wx.createLivePlayerContext(
              this.properties.member.key
            );
            player && player.play();
          }, 1000);
          break;
        case BACK_PROCESS:
          // 后台回来会重新拉流，设置loading
          if (!this.properties.member.isSelf) {
            this.setData({
              isLoading: true,
            });
            this.hasChangeLoading = true;
          }
      }
    },
  },
});
