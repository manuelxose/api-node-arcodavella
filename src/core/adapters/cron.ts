import cron, { ScheduledTask } from "node-cron";
import logger from "../../core/adapters/logger";

export class CronAdapter {
  constructor() {}

  /**
   * Programa una tarea cron.
   * @param schedule - La expresión cron.
   * @param task - La función a ejecutar.
   * @returns La tarea programada.
   */
  scheduleTask(schedule: string, task: () => void): ScheduledTask {
    const scheduledTask = cron.schedule(schedule, task, {
      scheduled: false, // Para iniciar manualmente
    });

    logger.info(`Tarea cron programada: ${schedule}`);
    return scheduledTask;
  }
}
