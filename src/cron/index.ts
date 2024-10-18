import { FetchContactsCron } from "./tasks/fetchContacts.cron";

export class InitializeCronJobs {
  constructor() {
    new FetchContactsCron().scheduleTask();
  }
}
