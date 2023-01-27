import dayjs from 'dayjs';

const getDurationInfo = ({days, hours, minutes}) =>{
  let durationInfo = '';
  if(days > 0){
    const daysInfo = days < 10 ? `0${days}` : days;
    durationInfo += `${daysInfo}D `;
  }
  if(hours > 0){
    const hoursInfo = hours < 10 ? `0${hours}` : hours;
    durationInfo += `${hoursInfo}H `;
  }
  if(minutes > 0){
    const minutesInfo = minutes < 10 ? `0${minutes}` : minutes;
    durationInfo += `${minutesInfo }M `;
  }
  return durationInfo;

};

const countDuration = (start, end)=> {
  const difference = dayjs(end).diff(start, 'minutes',true);
  const hours = Math.floor(difference / 60);
  const days = hours > 24 ? Math.floor(hours / 24) : 0;
  const minutes = Math.ceil(difference - (hours * 60));
  return {
    days,
    hours:hours - (days * 24),
    minutes};
};

const capitalizeFirstLetter = (word)=> word.charAt(0).toUpperCase() + word.slice(1);


const isEscapeKey = (evt)=>evt.key === 'Escape' || evt.key === 'Esc';

export {
  countDuration,
  getDurationInfo,
  capitalizeFirstLetter,
  isEscapeKey
};
