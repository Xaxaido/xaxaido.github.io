(() => {
  const input = document.querySelector('#help-search');
  const results = document.querySelector('#search-results');
  if (!input || !results) return;

  const entries = [
    { title: 'Тренировки', description: 'Запланированные тренировки и шаблоны тренировок', url: 'articles/training.html', keywords: 'тренировка тренировки расписание шаблон шаблоны упражнения подходы вес повторения' },
    { title: 'Запланированные тренировки', description: 'Дата, время, круговой формат и напоминания', url: 'articles/scheduled-training.html', keywords: 'запланированная запланированные дата начало окончание время параллельная круговая подготовка работа отдых круги перерывы напоминание заметки' },
    { title: 'Шаблоны тренировок', description: 'Создание, упражнения, заметки и теги', url: 'articles/training-template.html', keywords: 'шаблон шаблоны тренировки создать сохранить завершённая теги заметки упражнения подходы повторения вес круговая' },
    { title: 'Управление уведомлениями', description: 'Разрешения и настройки уведомлений Android', url: 'articles/notifications.html', keywords: 'уведомления разрешения android не беспокоить батарея настройки напоминание' },
    { title: 'Политика конфиденциальности', description: 'Информация о конфиденциальности и обработке данных', url: 'articles/privacy_policy.html', keywords: 'политика конфиденциальности приватность данные разрешения' }
  ];

  document.body.append(results);

  function positionResults() {
    if (results.hidden) return;

    const rect = input.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewTop = viewport?.offsetTop ?? 0;
    const viewLeft = viewport?.offsetLeft ?? 0;
    const viewWidth = viewport?.width ?? window.innerWidth;
    const viewHeight = viewport?.height ?? window.innerHeight;
    const gap = 8;
    const padding = 10;
    const viewBottom = viewTop + viewHeight;
    const viewRight = viewLeft + viewWidth;
    const below = Math.max(0, viewBottom - rect.bottom - gap - padding);
    const above = Math.max(0, rect.top - viewTop - gap - padding);
    const estimatedHeight = Math.min(results.scrollHeight, 360);
    const showAbove = below < Math.min(estimatedHeight, 160) && above > below;
    const available = Math.max(0, showAbove ? above : below);
    const width = Math.min(rect.width, Math.max(0, viewWidth - padding * 2));
    const left = Math.max(viewLeft + padding, Math.min(rect.left, viewRight - width - padding));
    const height = Math.min(results.scrollHeight, 360, available);

    results.style.left = `${left}px`;
    results.style.width = `${width}px`;
    results.style.maxHeight = `${height}px`;
    results.style.top = showAbove
      ? `${Math.max(viewTop + padding, rect.top - gap - height)}px`
      : `${rect.bottom + gap}px`;
  }

  function render() {
    const query = input.value.trim().toLocaleLowerCase('ru');
    if (!query) {
      results.hidden = true;
      results.innerHTML = '';
      return;
    }
    const matches = entries.filter(entry =>
      (entry.title + ' ' + entry.description + ' ' + entry.keywords).toLocaleLowerCase('ru').includes(query)
    );
    results.innerHTML = matches.length
      ? matches.map(entry => `<a class="search-result" href="${entry.url}"><strong>${entry.title}</strong><small>${entry.description}</small></a>`).join('')
      : '<div class="no-results">Ничего не найдено. Попробуйте другой запрос.</div>';
    results.hidden = false;
    positionResults();
  }
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      input.value = '';
      results.hidden = true;
      input.blur();
    }
    if (event.key === 'Enter') {
      const first = results.querySelector('a');
      if (first && !results.hidden) window.location.href = first.href;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      input.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!results.contains(event.target) && !input.contains(event.target)) results.hidden = true;
  });
  window.addEventListener('resize', positionResults);
  window.addEventListener('scroll', positionResults, true);
  window.visualViewport?.addEventListener('resize', positionResults);
  window.visualViewport?.addEventListener('scroll', positionResults);
})();
