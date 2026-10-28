(() => {
  /* Live local time */
  const timeEl = document.getElementById('ct-time');
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver' });
    const tick = () => { timeEl.textContent = 'It\u2019s ' + fmt.format(new Date()) + ' in Provo, UT'; };
    tick();
    setInterval(tick, 30000);
  }

  /* Postcard composer: builds an email, no server needed */
  const form = document.querySelector('[data-postcard]');
  if (!form) return;
  const TO = 'angeleeb@byu.edu';
  const status = form.querySelector('.pc-status');
  const compose = () => {
    const topic = form.querySelector('input[name="topic"]:checked')?.value || 'Hello';
    const name = form.elements.name.value.trim();
    const message = form.elements.message.value.trim();
    const subject = topic + (name ? ' \u2014 ' + name : '');
    const body = (message || 'Hi Angelee,') + (name ? '\n\n\u2014 ' + name : '');
    return { subject, body };
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.elements.message.value.trim()) {
      status.textContent = 'Write me a line or two first \u2726';
      form.elements.message.focus();
      return;
    }
    const { subject, body } = compose();
    form.classList.remove('sent'); void form.offsetWidth; form.classList.add('sent');
    status.textContent = 'Opening your email app\u2026 if nothing happens, use \u201cCopy message\u201d and send it to ' + TO + '.';
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  form.querySelector('.pc-copy').addEventListener('click', async () => {
    if (!form.elements.message.value.trim()) {
      status.textContent = 'Write me a line or two first \u2726';
      form.elements.message.focus();
      return;
    }
    const { subject, body } = compose();
    try {
      await navigator.clipboard.writeText('To: ' + TO + '\nSubject: ' + subject + '\n\n' + body);
      status.textContent = 'Copied! Paste it into any email to ' + TO + '.';
    } catch (err) {
      status.textContent = 'Couldn\u2019t copy automatically. Select the text and copy it, then email ' + TO + '.';
    }
  });
})();
