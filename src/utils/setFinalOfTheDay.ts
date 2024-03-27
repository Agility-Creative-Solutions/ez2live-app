import dayjs from "dayjs";

export default function setFinalOfTheDay(date: Date) {
  return dayjs(date).add(24, "hours").toDate();
}
