import { EROLE } from '../../../constants/common';

const PRE_PAGE_NUMBER = 15;

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    memberList: {
      type: Array,
      value: [],
    },
    currentEndpointId: {
      type: String,
      value: '',
    },
    mainVenueId: String,
    fixFirstEndpointId: String,
    presenter: String,
  },
  data: {
    translate: 0,
    EROLE,
    showNum: PRE_PAGE_NUMBER,
    showMemberList: [],
  },
  observers: {
    show() {
      this.setData({
        showNum: PRE_PAGE_NUMBER,
      });
    },
    memberList(memberList) {
      this.setData({
        showMemberList: memberList.slice(0, this.data.showNum),
      });
    },
    showNum(showNum) {
      this.setData({
        showMemberList: this.properties.memberList.slice(0, showNum),
      });
    },
  },
  position: 0,
  methods: {
    onClickMask() {
      this.triggerEvent('hide');
    },
    onClickMember(e) {
      const fixFirstEndpointId = this.properties.fixFirstEndpointId;
      const item = e.currentTarget.dataset.item;
      const menu = [
        {
          id: 'fixed',
          label:
            fixFirstEndpointId === item.endpointId
              ? '取消主画面'
              : '固定主画面',
          data: item,
        },
      ];
      if (item.endpointId === this.properties.currentEndpointId) {
        // 点击自己
        menu.unshift({
          id: 'mic',
          label: item.isAudioMute ? '取消静音' : '静音',
        });
      }
      this.triggerEvent('showMenu', menu);
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
    loadMore() {
      this.setData({
        showNum: this.data.showNum + PRE_PAGE_NUMBER,
      });
    },
  },
});
