(() => {
  const input = document.querySelector('#help-search');
  const results = document.querySelector('#search-results');
  if (!input || !results) return;

  const entries = [
    { title: 'Тренировка', description: 'Проведение тренировки и работа с упражнениями', url: 'articles/training.html', keywords: 'тренировка упражнение подход вес повторение результат начало завершение' },
    { title: 'Шаблон тренировки', description: 'Создание, редактирование и использование шаблонов', url: 'articles/training-template.html', keywords: 'шаблон тренировки создать редактировать упражнение план' },
    { title: 'Управление уведомлениями', description: 'Разрешения и настройки уведомлений Android', url: 'articles/notifications.html', keywords: 'уведомления разрешения android не беспокоить батарея настройки' },
    { title: 'Политика конфиденциальности', description: 'Информация о конфиденциальности и обработке данных', url: 'articles/privacy_policy.html', keywords: 'политика конфиденциальности приватность данные разрешения' }
  ];

  // Render the dropdown outside .hero so its overflow/background cannot clip it.
  document.body.append(results);

  function positionResults() {
    if (results.hidden) return;

    const rect = input.getBoundingClientRect();
    const gap = 8;
    const viewportPadding = 10;
    const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
    const spaceAbove = rect.top - gap - viewportPadding;
    const showAbove = spaceBelow < Math.min(220, results.scrollHeight) && spaceAbove > spaceBelow;
    const maxHeight = Math.max(100, showAbove ? spaceAbove : spaceBelow);

    results.style.left = `${rect.left}px`;
    results.style.width = `${rect.width}px`;
    results.style.maxHeight = `${maxHeight}px`;
    results.style.top = showAbove
      ? `${Math.max(viewportPadding, rect.top - gap - Math.min(results.scrollHeight, maxHeight))}px`
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
})();
