import { randomBytes } from 'node:crypto';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import { CUSTOMERS, DomainError, LOCATIONS, VEHICLES } from './domain';
import { type Fault, ShipmentStore } from './store';
import { validateCreateShipment } from './validation';

/** Fake demo account. Matches no real system. */
export const DEMO_USER = { email: 'demo.user@example.test', password: 'demo-password' } as const;

export interface AppOptions {
  /** Enables /api/test/* (store reset, fault injection). Off unless explicitly requested. */
  testMode?: boolean;
  store?: ShipmentStore;
}

const FAULTS: readonly Fault[] = ['STUCK_TASK', 'UNKNOWN_STATE'];

function param(req: Request, name: string): string {
  const value = req.params[name];
  return typeof value === 'string' ? value : '';
}

export function createApp(options: AppOptions = {}) {
  const store = options.store ?? new ShipmentStore();
  const tokens = new Set<string>();
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = (req.body ?? {}) as Record<string, unknown>;
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      throw new DomainError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    const token = `demo-${randomBytes(16).toString('hex')}`;
    tokens.add(token);
    res.json({ token, tokenType: 'Bearer' });
  });

  const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
    const header = req.get('authorization') ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token || !tokens.has(token)) {
      throw new DomainError(401, 'UNAUTHORIZED', 'A valid Bearer token is required');
    }
    next();
  };

  const api = express.Router();
  api.use(requireAuth);

  api.get('/reference-data', (_req, res) => {
    res.json({ customers: CUSTOMERS, locations: LOCATIONS, vehicles: VEHICLES });
  });

  api.get('/vehicles', (req, res) => {
    const type = typeof req.query.type === 'string' ? req.query.type : undefined;
    res.json({ items: VEHICLES.filter((v) => !type || v.type === type) });
  });

  api.get('/shipments', (req, res) => {
    const items = store.list({
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
    });
    res.json({ items, total: items.length });
  });

  api.post('/shipments', (req, res) => {
    res.status(201).json(store.create(validateCreateShipment(req.body)));
  });

  api.get('/shipments/:id', (req, res) => {
    res.json(store.get(param(req, 'id')));
  });

  api.delete('/shipments/:id', (req, res) => {
    store.delete(param(req, 'id'));
    res.status(204).end();
  });

  api.post('/shipments/:id/assign', (req, res) => {
    res.json(store.assign(param(req, 'id'), (req.body ?? {}).vehicleId));
  });

  api.patch('/shipments/:id/status', (req, res) => {
    res.json(store.changeStatus(param(req, 'id'), (req.body ?? {}).status));
  });

  api.post('/shipments/:id/tasks/:taskType/complete', (req, res) => {
    res.json(store.completeTask(param(req, 'id'), param(req, 'taskType')));
  });

  app.use('/api/demo', api);

  if (options.testMode) {
    const testApi = express.Router();
    testApi.post('/reset', (_req, res) => {
      store.reset();
      res.status(204).end();
    });
    testApi.post('/faults', (req, res) => {
      const { shipmentId, fault } = (req.body ?? {}) as Record<string, unknown>;
      if (typeof shipmentId !== 'string' || !FAULTS.includes(fault as Fault)) {
        throw new DomainError(400, 'INVALID_FAULT', `fault must be one of ${FAULTS.join(', ')}`);
      }
      res.json(store.injectFault(shipmentId, fault as Fault));
    });
    app.use('/api/test', testApi);
  }

  app.use('/api', (_req, _res) => {
    throw new DomainError(404, 'NOT_FOUND', 'Unknown API route');
  });

  // Express 5 forwards thrown and rejected errors here.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof DomainError) {
      res.status(err.httpStatus).json({
        error: { code: err.code, message: err.message, ...(err.field ? { field: err.field } : {}) },
      });
      return;
    }
    if (err instanceof SyntaxError) {
      res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body is not valid JSON' } });
      return;
    }
    console.error('[demo-app] unexpected error', err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error' } });
  });

  return app;
}
