// Northstar Logistics demo UI. Plain browser JavaScript, no build step.
// Every list/detail view exposes data-state="loading|ready" so tests can wait for real readiness.

const TOKEN_KEY = 'northstar.token';
const TASK_LABELS = { LOADING: 'loading', TRANSIT: 'transit', UNLOADING: 'unloading' };
const KNOWN_STATUSES = [
  'CREATED',
  'ASSIGNED',
  'ROUTE_PLANNED',
  'IN_TRANSIT',
  'DELIVERED',
  'CLOSED',
  'CANCELLED',
];

const $ = (selector) => document.querySelector(selector);

function token() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401 && document.body.dataset.page !== 'login') {
    localStorage.removeItem(TOKEN_KEY);
    location.href = 'index.html';
    throw new Error('Signed out');
  }
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? `Request failed (${res.status})`);
  return data;
}

function show(el, text) {
  el.textContent = text;
  el.hidden = false;
}

function hide(el) {
  el.hidden = true;
  el.textContent = '';
}

function fillSelect(select, items, label = (i) => i.name) {
  select.replaceChildren(
    ...items.map((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = label(item);
      return option;
    }),
  );
}

function badge(status) {
  const span = document.createElement('span');
  span.className = `badge badge-${KNOWN_STATUSES.includes(status) ? status.toLowerCase() : 'unknown'}`;
  span.dataset.testid = 'shipment-status';
  span.textContent = status;
  return span;
}

// ---------- Login ----------
function initLogin() {
  if (token()) location.href = 'shipments.html';
  $('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    hide($('#login-error'));
    try {
      const { token: newToken } = await api('/api/auth/login', {
        method: 'POST',
        body: { email: $('#email').value, password: $('#password').value },
      });
      localStorage.setItem(TOKEN_KEY, newToken);
      location.href = 'shipments.html';
    } catch (error) {
      show($('#login-error'), error.message);
    }
  });
}

// ---------- Shipment list ----------
async function initShipments() {
  if (!token()) return void (location.href = 'index.html');
  $('#sign-out').addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    location.href = 'index.html';
  });

  const ref = await api('/api/demo/reference-data');
  const names = Object.fromEntries(ref.customers.map((c) => [c.id, c.name]));
  fillSelect($('#customerId'), ref.customers);
  fillSelect($('#origin'), ref.locations);
  fillSelect($('#destination'), ref.locations);
  $('#destination').selectedIndex = 1;

  const table = $('[data-testid="shipment-table"]');
  async function load() {
    table.dataset.state = 'loading';
    const params = new URLSearchParams();
    if ($('#search').value.trim()) params.set('q', $('#search').value.trim());
    if ($('#status-filter').value) params.set('status', $('#status-filter').value);
    const { items } = await api(`/api/demo/shipments?${params}`);
    table.tBodies[0].replaceChildren(
      ...items.map((s) => {
        const row = document.createElement('tr');
        row.dataset.testid = 'shipment-row';
        row.dataset.shipmentId = s.shipmentId;
        const link = document.createElement('a');
        link.href = `shipment.html?id=${encodeURIComponent(s.shipmentId)}`;
        link.textContent = s.shipmentId;
        const cells = [
          link,
          s.reference,
          names[s.customerId] ?? s.customerId,
          badge(s.status),
          s.vehicleId ?? '—',
        ];
        row.replaceChildren(
          ...cells.map((content) => {
            const td = document.createElement('td');
            td.append(content);
            return td;
          }),
        );
        return row;
      }),
    );
    $('#empty-state').hidden = items.length > 0;
    table.dataset.state = 'ready';
  }

  let debounce;
  $('#search').addEventListener('input', () => {
    table.dataset.state = 'loading';
    clearTimeout(debounce);
    debounce = setTimeout(load, 250);
  });
  $('#status-filter').addEventListener('change', load);

  $('#create-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    hide($('#create-error'));
    hide($('#create-success'));
    const weight = $('#weightKg').value;
    try {
      const created = await api('/api/demo/shipments', {
        method: 'POST',
        body: {
          reference: $('#reference').value,
          customerId: $('#customerId').value,
          vehicleType: $('#vehicleType').value,
          origin: $('#origin').value,
          destination: $('#destination').value,
          weightKg: weight === '' ? undefined : Number(weight),
        },
      });
      show($('#create-success'), `Shipment ${created.shipmentId} created`);
      $('#reference').value = '';
      await load();
    } catch (error) {
      show($('#create-error'), error.message);
    }
  });

  await load();
}

// ---------- Shipment detail ----------
async function initShipment() {
  if (!token()) return void (location.href = 'index.html');
  const id = new URLSearchParams(location.search).get('id');
  const main = $('[data-testid="shipment-detail"]');
  const error = $('#detail-error');
  const ref = await api('/api/demo/reference-data');
  const names = Object.fromEntries([...ref.customers, ...ref.locations].map((x) => [x.id, x.name]));

  async function render() {
    main.dataset.state = 'loading';
    const s = await api(`/api/demo/shipments/${encodeURIComponent(id)}`);
    $('#shipment-title').textContent = `Shipment ${s.shipmentId}`;
    $('[data-testid="shipment-status"]').replaceWith(badge(s.status));
    $('[data-testid="shipment-reference"]').textContent = s.reference;
    $('[data-testid="shipment-customer"]').textContent = names[s.customerId] ?? s.customerId;
    $('[data-testid="shipment-route"]').textContent = `${names[s.origin]} → ${names[s.destination]}`;
    $('[data-testid="shipment-weight"]').textContent = `${s.weightKg} kg`;
    $('[data-testid="shipment-vehicle"]').textContent = s.vehicleId ?? 'Not assigned';

    const { items: vehicles } = await api(`/api/demo/vehicles?type=${s.vehicleType}`);
    fillSelect($('#vehicle-select'), vehicles, (v) => `${v.id} (${v.capacityKg} kg)`);

    const known = KNOWN_STATUSES.includes(s.status);
    const enabled = {
      assign: s.status === 'CREATED',
      plan: s.status === 'ASSIGNED',
      start: s.status === 'ROUTE_PLANNED',
      close: s.status === 'DELIVERED',
      cancel: ['CREATED', 'ASSIGNED', 'ROUTE_PLANNED'].includes(s.status),
    };
    for (const button of document.querySelectorAll('[data-action]')) {
      button.disabled = !known || !enabled[button.dataset.action];
    }
    $('#vehicle-select').disabled = !enabled.assign;

    const nextTask = s.tasks.find((t) => t.status === 'PENDING')?.type;
    $('#no-tasks').hidden = s.tasks.length > 0;
    $('#tasks').replaceChildren(
      ...s.tasks.map((task) => {
        const li = document.createElement('li');
        li.dataset.testid = `task-${task.type}`;
        li.dataset.taskStatus = task.status;
        const label = document.createElement('span');
        label.textContent = `${task.type} — ${task.status}`;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `Complete ${TASK_LABELS[task.type]}`;
        button.disabled = !known || s.status !== 'IN_TRANSIT' || task.type !== nextTask;
        button.addEventListener('click', () =>
          act(() => api(`/api/demo/shipments/${id}/tasks/${task.type}/complete`, { method: 'POST' })),
        );
        li.append(label, ' ', button);
        return li;
      }),
    );
    $('#history').replaceChildren(
      ...s.history.map((h) => {
        const li = document.createElement('li');
        li.textContent = `${h.from ?? '—'} → ${h.to}`;
        return li;
      }),
    );
    main.dataset.state = 'ready';
  }

  async function act(call) {
    hide(error);
    try {
      await call();
    } catch (e) {
      show(error, e.message);
    }
    await render();
  }

  const patch = (status) => () =>
    api(`/api/demo/shipments/${id}/status`, { method: 'PATCH', body: { status } });
  const handlers = {
    assign: () =>
      api(`/api/demo/shipments/${id}/assign`, {
        method: 'POST',
        body: { vehicleId: $('#vehicle-select').value },
      }),
    plan: patch('ROUTE_PLANNED'),
    start: patch('IN_TRANSIT'),
    close: patch('CLOSED'),
    cancel: patch('CANCELLED'),
  };
  for (const button of document.querySelectorAll('[data-action]')) {
    button.addEventListener('click', () => act(handlers[button.dataset.action]));
  }

  try {
    await render();
  } catch (e) {
    show(error, e.message);
    main.dataset.state = 'ready';
  }
}

const pages = { login: initLogin, shipments: initShipments, shipment: initShipment };
pages[document.body.dataset.page]?.();
