// ---------- Мобильное меню ----------
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------- Данные услуг для диалога ----------
const SERVICES = {
  coffee: {
    title: 'Кофе на зерне',
    text: 'Эспрессо, американо, капучино, флэт-уайт и фильтр. ' +
          'Зерно трёх обжарок в ротации, всегда есть декаф. ' +
          'Бублик лично следит за помолом.',
    price: 'от 180 ₽ за чашку',
  },
  bakery: {
    title: 'Выпечка «Мур»',
    text: 'Круассаны с миндалём, синнабоны, тарты с сезонными ' +
          'фруктами и домашний хлеб на закваске. Печём утром, ' +
          'пока кот спит на подоконнике.',
    price: 'от 120 ₽ за позицию',
  },
  breakfast: {
    title: 'Завтраки «С лапками»',
    text: 'Сырники со сметаной, омлет с томатами, каша на кокосовом ' +
          'молоке и тосты с авокадо. Подаём с 7:30 — раньше, ' +
          'чем кот проснётся.',
    price: 'от 290 ₽ за порцию',
  },
};

// ---------- Диалог услуги ----------
const dialog = document.getElementById('service-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogText = document.getElementById('dialog-text');
const dialogPrice = document.getElementById('dialog-price');

let lastTrigger = null;

document.querySelectorAll('[data-service]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.service;
    const data = SERVICES[key];
    if (!data || !dialog) return;

    dialogTitle.textContent = data.title;
    dialogText.textContent = data.text;
    dialogPrice.textContent = data.price;

    lastTrigger = btn;
    dialog.showModal();
  });
});

if (dialog) {
  dialog.addEventListener('close', () => {
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  });
}

// ---------- Валидация формы ----------
const form = document.getElementById('booking-form');
const status = document.getElementById('form-status');

function setError(field, message) {
  const wrap = field.closest('.field');
  const box = wrap.querySelector('.error');
  if (message) {
    wrap.classList.add('has-error');
    box.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  } else {
    wrap.classList.remove('has-error');
    box.textContent = '';
    field.removeAttribute('aria-invalid');
  }
}

function isBlank(value) {
  return value.trim().length === 0;
}

function validateForm() {
  let firstInvalid = null;

  const name = form.elements.name;
  const email = form.elements.email;
  const service = form.elements.service;
  const message = form.elements.message;

  if (isBlank(name.value)) {
    setError(name, 'Введите имя.');
    firstInvalid ||= name;
  } else {
    setError(name, '');
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  if (isBlank(email.value)) {
    setError(email, 'Введите email.');
    firstInvalid ||= email;
  } else if (!emailOk) {
    setError(email, 'Проверьте формат email.');
    firstInvalid ||= email;
  } else {
    setError(email, '');
  }

  if (isBlank(service.value)) {
    setError(service, 'Выберите вариант.');
    firstInvalid ||= service;
  } else {
    setError(service, '');
  }

  if (isBlank(message.value)) {
    setError(message, 'Напишите пару слов.');
    firstInvalid ||= message;
  } else {
    setError(message, '');
  }

  return firstInvalid;
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstInvalid = validateForm();

    if (firstInvalid) {
      status.textContent = '';
      firstInvalid.focus();
      return;
    }

    status.textContent =
      'Данные проверены. Это учебное демо: заявка не отправлена — Бублик спит.';
    form.reset();
    document.querySelectorAll('.field.has-error').forEach((el) =>
      el.classList.remove('has-error')
    );
    document.querySelectorAll('.error').forEach((el) => (el.textContent = ''));
  });
}