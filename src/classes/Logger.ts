export default class Logger {

   private static get formattedTime() {

      function formatNumber(number: number) {

         return number < 10 ? `0${number}` : number.toString();

      }

      const date = new Date();

      const days = formatNumber(date.getDate());
      const months = formatNumber(date.getMonth() + 1);
      const hours = formatNumber(date.getHours());
      const minutes = formatNumber(date.getMinutes());
      const seconds = formatNumber(date.getSeconds());

      return `${days}/${months} ${hours}:${minutes}:${seconds}`;

   }

   public static debug(message: string): void {
      
      console.log(`[\u001b[38;5;6mDEBUG\u001b[0m](\u001b[38;5;8m${this.formattedTime}\u001b[0m) ${message}`);

   }

   public static info(message: string): void {

      console.log(`[\u001b[38;5;12mINFO\u001b[0m](\u001b[38;5;8m${this.formattedTime}\u001b[0m) ${message}`);

   }

   public static warn(message: string): void {

      console.log(`[\u001b[38;5;3mWARN\u001b[0m](\u001b[38;5;8m${this.formattedTime}\u001b[0m) ${message}`);

   }

   public static error(message: string): void {

      console.log(`[\u001b[38;5;1mERROR\u001b[0m](\u001b[38;5;8m${this.formattedTime}\u001b[0m) ${message}`);

   }

}