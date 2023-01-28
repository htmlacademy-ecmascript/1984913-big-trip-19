import dayjs from 'dayjs';
import { FormatPattern } from '../consts.js';
const formatDate = (date, isTripInfo)=>{
  const pattern = isTripInfo ? FormatPattern.TRIP_INFO_DATE : FormatPattern.DATE;
  return date ? dayjs(date).format(pattern) : '';};

const formatTime = (time)=> time ? dayjs(time).format(FormatPattern.TIME) : '';

const formatEditDatetime = (datetime)=> datetime ? dayjs(datetime).format(FormatPattern.DATETIME) : '';

const formatDatetimeEvent = (datetime, start,end)=> datetime.toISOString().slice(start, end);

export {
  formatDate,
  formatTime,
  formatEditDatetime,
  formatDatetimeEvent
};
