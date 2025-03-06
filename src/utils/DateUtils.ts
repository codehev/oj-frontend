/**
 * 格式化时间工具类
 */
export class DateUtils {
  /**
   * 将时间戳格式化为指定格式的日期字符串
   * @param timestamp 时间戳（毫秒）
   * @param format 格式字符串，支持 'YYYY-MM-DD HH:mm:ss' 和 'YYYY/MM/DD'
   * @returns 格式化后的日期字符串
   */
  static formatTimestamp(
    timestamp: number,
    format = "YYYY-MM-DD HH:mm:ss"
  ): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const parts = new Intl.DateTimeFormat("zh-CN", options).formatToParts(date);
    const formattedDate: { [key: string]: string } = {};
    parts.forEach((part) => {
      if (part.type !== "literal") {
        formattedDate[part.type] = part.value;
      }
    });

    return format
      .replace("YYYY", formattedDate.year)
      .replace("MM", formattedDate.month)
      .replace("DD", formattedDate.day)
      .replace("HH", formattedDate.hour)
      .replace("mm", formattedDate.minute)
      .replace("ss", formattedDate.second);
  }
}
