import type { Locator } from '@playwright/test';
import type { TaskType } from '../api/models/shipment.types';

const LABELS: Record<TaskType, string> = { LOADING: 'loading', TRANSIT: 'transit', UNLOADING: 'unloading' };

/** The journey task list on the shipment detail page. */
export class TaskList {
  constructor(readonly root: Locator) {}

  task(type: TaskType): Locator {
    return this.root.getByTestId(`task-${type}`);
  }

  completeButton(type: TaskType): Locator {
    return this.task(type).getByRole('button', { name: `Complete ${LABELS[type]}` });
  }
}
