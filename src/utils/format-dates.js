import dayjs from 'dayjs';
import { FormatPattern } from '../consts.js';
const formatDate = (date)=> date ? dayjs(date).format(FormatPattern.DATE) : '';

const formatTime = (time)=> time ? dayjs(time).format(FormatPattern.TIME) : '';

const formatEditDatetime = (datetime)=> datetime ? dayjs(datetime).format(FormatPattern.DATETIME) : '';

const formatDatetimeEvent = (datetime, start,end)=> datetime.toISOString().slice(start, end);

export {
  formatDate,
  formatTime,
  formatEditDatetime,
  formatDatetimeEvent
};
