import { DatePipe } from "@angular/common";

export class Shared {
  // Define date formats
  MONTH_YEAR_FORMAT = "MM/yyyy";
  FULL_DATE_FORMAT = "MM/dd/yyyy";

  // Create an instance of DatePipe
  datePipe = new DatePipe("en-US");

  formatDate(value) {
    try {
      const segments = value.split("-");
      switch (segments.length) {
        case 2:
          return (
            this.datePipe.transform(`${value}-01`, this.MONTH_YEAR_FORMAT) ||
            value
          );
        case 3:
          return this.datePipe.transform(value, this.FULL_DATE_FORMAT) || value;
        case 4:
          return (
            this.datePipe.transform(new Date(value), this.FULL_DATE_FORMAT) ||
            value
          );
        case 1:
        default:
          // Return the year if it is the only value
          return value;
      }
    } catch (error) {
      console.error(`Could not parse value: ${value}. Error: ${error}`);
      return value;
    }
  }
}
