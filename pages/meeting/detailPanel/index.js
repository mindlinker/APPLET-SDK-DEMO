const { splitMeetingCode } = require('../../../utils/common');

Component({
  properties: {
    show: Boolean,
    name: String,
    password: String,
    meetingCode: String,
  },
  data: {
    translate: 0,
    showMeetingCode: '',
  },
  observers: {
    meetingCode(meetingCode) {
      this.setData({
        showMeetingCode: splitMeetingCode(meetingCode),
      });
    },
  },
  position: 0,
  methods: {
    onClickMask() {
      this.triggerEvent('hide');
    },
    handleTouchStart(e) {
      this.position = e.changedTouches[0].clientX;
    },
    handleTouchMove(e) {
      const clientX = e.changedTouches[0].clientX;
      if (clientX - this.position < 0) {
        return;
      }
      this.setData({
        translate: clientX - this.position,
      });
    },
    handleTouchEnd() {
      if (this.data.translate > 120) {
        this.triggerEvent('hide');
      }
      this.setData({
        translate: 0,
      });
    },
  },
});
