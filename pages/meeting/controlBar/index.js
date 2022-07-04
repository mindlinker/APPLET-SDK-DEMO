Component({
  properties: {
    show: {
      type: Boolean,
      value: true,
    },
    safeHeight: {
      type: Number,
    },
    isAudioMute: {
      type: Boolean,
      value: true,
    },
    isVideoMute: {
      type: Boolean,
      value: true,
    },
    memberCount: {
      type: Number,
      value: 0,
    },
  },
  methods: {
    showControlBar() {
      this.triggerEvent('click');
    },
    showMemberPanel() {
      this.triggerEvent('showMemberPanel');
    },
    exitMeeting() {
      this.triggerEvent('exit');
    },
    switchMic() {
      this.triggerEvent('switchMic');
    },
    switchCamera() {
      this.triggerEvent('switchCamera');
    },
    switchCameraDirection() {
      this.triggerEvent('switchCameraDirection');
    },
  },
});
