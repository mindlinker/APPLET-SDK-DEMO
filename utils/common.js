/**
 * @desc: 在会议号中添加空格
 * @param {string} code 会议号
 * @return {string} 添加空格之后的会议号
 */
export const splitMeetingCode = code => {
  const prefix = Math.floor(code.length / 2);
  const subfix = Math.ceil(code.length / 2);
  if (code.length < 11) {
    return `${code.slice(0, prefix)} ${code.slice(-subfix)}`;
  } else {
    return `${code.slice(0, 4)} ${code.slice(4, 8)} ${code.slice(8, 11)}`;
  }
};
