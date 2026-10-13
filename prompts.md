# AI interaction log

Этот документ содержит существенные пользовательские запросы, использованные при разработке проекта.

Не следует записывать сюда системные инструкции, скрытые рассуждения, пароли, токены и другие секреты.

Для каждого значимого запроса добавляется отдельная запись.

---

## Prompt 001 — Project initialization

**Date:** 2026-10-13.

**Goal:** инициализировать Angular-проект и проверить базовую конфигурацию.

**Model and tools:** OpenAI Codex (GPT-5), Angular CLI 21.1.2, Angular CLI MCP,
PowerShell и npm 11.16.0.

### Prompt

Прочитай `AGENTS.md`, `docs/task.md` и файлы в `docs/reference/`.

Инициализируй Angular-проект версии 20 или новее непосредственно в корне текущего репозитория.

Требования к начальному проекту:

- standalone architecture;
- strict TypeScript и Angular templates;
- SCSS;
- routing;
- без SSR;
- без дополнительных UI-библиотек;
- без вложенного Git-репозитория;
- сохрани существующие документы и reference-файлы;
- выбери корректное имя Angular-проекта на основе имени репозитория.

Пока не реализуй дизайн страницы.

После инициализации:

1. Проверь конфигурацию workspace.
2. Если Angular CLI MCP доступен, выполни `list_projects` и `get_best_practices`.
3. Удали стандартный демонстрационный контент Angular, оставив минимальный рабочий root-компонент.
4. Запусти production-сборку и тесты.
5. Запусти lint, только если он уже настроен.
6. Не добавляй новые зависимости без необходимости.
7. Обнови `prompts.md` и `ai_decisions.md`.
8. Покажи созданные файлы, принятые решения и результаты проверок.

Не создавай коммит без моего отдельного указания.

### Result

В корне репозитория создан Angular 21 workspace `iron-facts` без SSR и вложенного
Git-репозитория. Настроены standalone architecture, routing, SCSS, строгие проверки
TypeScript и Angular templates, стандартный префикс селекторов `app` и `OnPush` для минимального
root-компонента. Стандартный демонстрационный шаблон и favicon удалены. Существующие
документы и reference-файлы сохранены; дизайн страницы не реализовывался.

### Verification

- `npm.cmd run build -- --configuration production` — успешно.
- `npm.cmd test -- --watch=false` — успешно, 1 test file и 2 tests.
- Lint не запускался: lint script/target в созданном workspace не настроен.
- Angular CLI MCP `list_projects` обнаружил workspace и Angular 21.
- Angular CLI MCP `get_best_practices` был вызван, но сервер вернул
  `Unexpected response type`.

### Corrections

После первоначальной инициализации пользователь уточнил, что следует сохранить стандартный
Angular-префикс `app`, а также указал избегать лишних повторных MCP-вызовов. Первые запуски
сборки и тестов в ограниченной песочнице не имели доступа к родительским каталогам;
проверки были повторены с разрешённым доступом и успешно завершились.

---

## Prompt 002 — Initialization corrections

**Date:** 2026-10-13.

**Goal:** скорректировать префикс компонентов и дисциплину MCP-вызовов.

### Prompt

Почему использовал префикс `tmt`? Префикс должен быть стандартным.

Почему `get_best_practices` вызвался дважды? Нужно избегать лишних вызовов.

### Result

Префикс workspace и root-компонента возвращён к стандартному `app`. Зафиксировано, что
для инициализации достаточно одного обязательного вызова `get_best_practices` после
обнаружения созданного workspace; неуспешный вызов не следует повторять без новой причины.

### Verification

- Angular CLI MCP `list_projects` выполнен один раз перед корректировкой.
- Angular CLI MCP `get_best_practices` выполнен один раз и снова вернул
  `Unexpected response type`; повторной попытки не было.
- Production-сборка и unit-тесты повторно запущены после изменения префикса.

### Corrections

Исправлены выбранный префикс и процесс использования Angular CLI MCP.

---

## Prompt 003 — Figma working-copy verification

**Date:** 2026-10-13.

**Goal:** проверить read-only доступ к рабочей копии макета и определить основные desktop/mobile frames.

### Prompt

Используй только read-only инструменты Figma MCP. Ничего не изменяй в Figma и пока не реализовывай дизайн в коде.

Рабочая копия макета:

`https://www.figma.com/design/dCgNBuiICUtay8FMobj7Nt/Quiz--Copy-?node-id=0-1`

1. Вызови `whoami` и проверь, что используется аккаунт `mansur0510@gmail.com`.
2. Получи метаданные файла и список его страниц и верхнеуровневых frames.
3. Найди frames, соответствующие desktop- и mobile-версиям главной страницы.
4. Для найденных frames получи screenshots.
5. Сопоставь screenshots с:
   - `docs/reference/desktop.png`;
   - `docs/reference/mobile.png`.
6. Сообщи:
   - название каждой найденной страницы;
   - названия подходящих frames;
   - точные node ID desktop- и mobile-макетов;
   - ссылки на эти frames;
   - удалось ли получить screenshots;
   - есть ли дополнительные варианты или состояния страницы.

Не вызывай `get_design_context` для всего корневого узла `0:1`, если он содержит много элементов. Сначала найди конкретные целевые frames.

Не изменяй application-код. Сохрани этот промпт и краткий результат проверки в `prompts.md`.

### Result

Figma MCP авторизован как `mansur0510@gmail.com`. В файле найдена одна страница `Page 1`
(`0:1`). Основные макеты: desktop frame `desktop` (`1:1588`, 1440×6421) и mobile frame
`mob` (`1:271`, 375×6043.6). Screenshots обоих frames получены и визуально совпадают с
локальными эталонами. Размеры reference-файлов соответствуют экспорту 2×: desktop
2880×12842 и mobile 750×12088.

Постоянные ссылки:

- Desktop: `https://www.figma.com/design/dCgNBuiICUtay8FMobj7Nt/Quiz--Copy-?node-id=1-1588`.
- Mobile: `https://www.figma.com/design/dCgNBuiICUtay8FMobj7Nt/Quiz--Copy-?node-id=1-271`.

Дополнительно обнаружены верхнеуровневые frames `mob` (`1:834`), `hero` (`1:1264`),
`mob menu` (`1:1540`) и `Final Scroll State` (`1:2104`), а также демонстрационные frames
компонентов `Button`, `Hero Cards` и `Navbar`.

### Verification

- Использованы только read-only вызовы `whoami`, `get_metadata` и `get_screenshot`.
- `get_design_context`, `use_figma` и другие инструменты записи не вызывались.
- Application-код и Figma-файл не изменялись.

---

## Prompt 004 — Proposed design-to-code architecture

**Date:** 2026-10-13.

**Goal:** провести подробный design-to-code анализ без реализации интерфейса.

### Prompt

Прочитай `AGENTS.md`, `docs/assignment.md`, `docs/task.md`, `prompts.md` и `ai_decisions.md`.

Проведи подробный design-to-code анализ рабочей копии Figma. На этом этапе не реализовывай интерфейс и не изменяй application-код.

Рабочий файл:

`https://www.figma.com/design/dCgNBuiICUtay8FMobj7Nt/Quiz--Copy-`

Основные frames:

- Desktop: `1:1588`
- Mobile: `1:271`

Дополнительные состояния и компоненты:

- Mobile alternative: `1:834`
- Hero: `1:1264`
- Button: `1:1322`
- Hero Cards: `1:1412`
- Mobile menu: `1:1540`
- Navbar: `1:1548`
- Final Scroll State: `1:2104`

Используй Figma MCP и workflow `figma-design-to-code`.

Для desktop- и mobile-frame вызови `get_design_context` с получением screenshot. Если ответ для большого frame будет отмечен как sparse или окажется неполным:

1. Не используй неполный ответ как достаточную основу реализации.
2. Сопоставь screenshot с иерархией дочерних узлов.
3. Раздели страницу на видимые секции.
4. Получи `get_design_context` для соответствующих дочерних узлов отдельными параллельными запросами.
5. Дополнительно изучи перечисленные изолированные компоненты и состояния.

Сопоставь данные Figma с:

- `docs/reference/desktop.png`;
- `docs/reference/mobile.png`;
- функциональными требованиями из `docs/assignment.md`;
- критериями приёмки из `docs/task.md`.

Также изучи текущую структуру Angular-проекта в read-only режиме.

Подготовь отчёт со следующими разделами:

1. Структура страницы и перечень секций.
2. Предлагаемое дерево Angular-компонентов.
3. Границы ответственности компонентов.
4. Дизайн-токены: цвета, типографика, размеры, отступы, скругления, тени, ширины контейнеров и уровни наложения.
5. Полный перечень необходимых изображений, SVG, иконок и шрифтов.
6. Переиспользуемые компоненты и их варианты.
7. Соответствие desktop- и mobile-макетов.
8. Предлагаемые промежуточные breakpoints для планшетов.
9. Поведение композиции на широких и 8K-экранах.
10. Структура конфигурационных данных.

Учти, что контент, которым нужно управлять без пересборки frontend-приложения, нельзя хранить в скомпилированных TypeScript-константах. Предложи runtime-конфигурацию, например JSON-файлы в `public/config`, загружаемые при запуске приложения.

Отдельно опиши предполагаемую реализацию автоматической смены hero-карточек, бегущей строки, перекрытия карточек при прокрутке, состояний кнопок, мобильного меню, `prefers-reduced-motion`, клавиатурной навигации и focus-состояний.

Предложи модели данных, необходимые Angular-сервисы, использование signals, маршрутизацию, unit-тесты, интеграционные проверки, визуальные viewport-проверки и последовательность небольших коммитов.

Для каждого архитектурного решения укажи рекомендуемый вариант, рассмотренные альтернативы, преимущества, риски или ограничения.

Не скачивай ассеты, не создавай компоненты и не изменяй стили. Не принимай архитектурные решения от имени пользователя: обозначь их как Proposed.

Сохрани этот промпт и краткий результат в `prompts.md`. Подготовь предложенные решения для последующего утверждения и записи в `ai_decisions.md`.

### Result

Получены полные, не sparse, `get_design_context` и screenshots для desktop (`1:1588`) и
mobile (`1:271`), а также контексты семи перечисленных компонентов и состояний. Макеты
сопоставлены с локальными reference-файлами и требованиями. Figma variable definitions
для основных frames отсутствуют, поэтому подготовлен Proposed-набор токенов на основе
фактических значений слоёв. Предложены компонентная архитектура Angular, runtime JSON-конфигурация,
модели, сервисы, signals, responsive-стратегия, доступность, проверки и план небольших коммитов.

Для анализа использована точная расшифровка задания; после архитектурного согласования она
перемещена в `docs/assignment.md`. После получения основных контекстов лимит Figma MCP Starter
был исчерпан на дополнительных metadata-запросах, но это не повлияло на полноту анализа.

### Verification

- Figma-файл, application-код и стили не изменялись.
- Ассеты не скачивались, временные Figma asset URL не сохранялись.
- Изменён только `prompts.md`; Proposed-решения не записывались в `ai_decisions.md` до утверждения.

---

## Prompt 005 — Accepted design-to-code architecture corrections

**Date:** 2026-10-13.

**Goal:** утвердить основу design-to-code архитектуры с человеческими корректировками, не
изменяя application-код.

### Prompt

Я изучил предложенный design-to-code анализ и принимаю его основу со следующими корректировками.

1. Перемести точную расшифровку задания из `docs/reference/assignment.md` в `docs/assignment.md`.
   Обнови ссылки в `AGENTS.md` и других документах. В `docs/reference/` должны остаться только
   reference-материалы.
2. Не создавай избыточно дробную иерархию компонентов. На первом этапе оставь `PrizeIntro`,
   podium cards, leaderboard rows и mechanic stats внутренней разметкой соответствующих секций.
   Выделяй их в компоненты только при самостоятельной логике или реальном переиспользовании.
3. Сохрани runtime-конфигурацию в `public/config/site-content.json`, но дополни решение поведением
   при ошибке загрузки, невалидной структуре и неподдерживаемой версии схемы. Не добавляй стороннюю
   библиотеку валидации без отдельного обоснования.
4. Не создавай заранее отдельный полный manifest для всех технических asset references из Figma.
   Извлекай только необходимые семантические ассеты по мере реализации соответствующих секций.
   Для каждого фактически используемого ассета сохраняй краткое соответствие: назначение, Figma
   node ID, локальный путь, формат и использование в desktop/mobile. Не загружай дубликаты,
   технические фрагменты слоёв и не оставляй временные Figma URL в коде.
5. Проверь наличие и право использования WOFF2-файлов корпоративных шрифтов. Если файлы
   недоступны, предложи fallback и зафиксируй отличие как ограничение. Не скачивай шрифты из
   неофициальных источников.
6. Используй content-driven breakpoints. Значения 600, 768 и 1024 считай начальными ориентирами,
   а не жёстким контрактом.
7. Для hero-карточек принимается автосмена примерно раз в 7 секунд, пауза при hover, focus и
   скрытой вкладке, а также отключение при `prefers-reduced-motion`. Отсутствие отдельной кнопки
   паузы зафиксируй как осознанный компромисс.
8. Добавляй unit-тесты вместе с соответствующими функциями, а не отдельным финальным этапом.
   Playwright и visual regression оставь на конец и добавляй только при достаточном времени.
9. Уменьши план до примерно 8–10 сфокусированных коммитов. Тесты конкретной функции должны
   входить в тот же коммит, что и функция.

Обнови `prompts.md`. Перенеси утверждённые решения в `ai_decisions.md` со статусом Accepted, явно
сохранив рассмотренные альтернативы и внесённые человеком корректировки.

Пока не изменяй application-код, не скачивай ассеты и не создавай компоненты. Покажи итоговую
архитектуру, список принятых решений и обновлённый план реализации.

### Result

Точная расшифровка перемещена в `docs/assignment.md`; ссылки обновлены, а в
`docs/reference/` оставлены только изображения и их индекс. В `ai_decisions.md` добавлен ADR-002
со статусом Accepted: зафиксированы упрощённое секционное дерево, runtime JSON и три класса
ошибок, инкрементальная работа с ассетами, content-driven responsive-стратегия, поведение hero,
правила тестирования и план из девяти коммитов.

Корпоративные font-файлы и подтверждающие лицензионные материалы в репозитории не найдены.
Принят временный системный fallback, а расхождение метрик и компромисс без отдельной pause-кнопки
зафиксированы в `KNOWN_ISSUES.md`. Application-код, стили и Figma не изменялись; ассеты и шрифты
не скачивались.

---

## Prompt 006 — Documentation-only commit verification

**Date:** 2026-10-13.

**Goal:** проверить границы незакоммиченных изменений и создать один сфокусированный
документационный коммит без отправки в remote-репозиторий.

### Prompt

Проверь текущие незакоммиченные изменения.

Ожидается, что они затрагивают только документацию:

- `AGENTS.md`;
- `docs/assignment.md`;
- `docs/task.md`;
- `docs/reference/README.md`;
- `prompts.md`;
- `ai_decisions.md`;
- `KNOWN_ISSUES.md`;
- удаление прежнего `docs/reference/assignment.md` как результат его переноса.

Убедись, что application-код, Angular-конфигурация и зависимости не изменены.

Добавь этот запрос и результат проверки в `prompts.md`, выполни `git diff --check`, после чего
создай один сфокусированный коммит:

`docs: approve homepage architecture`

Не отправляй изменения в remote-репозиторий. После коммита покажи hash коммита, включённые файлы,
результат `git status` и результат проверки.

### Result

Перед коммитом проверены tracked и untracked изменения. Они ограничены перечисленными
документационными файлами; `docs/reference/assignment.md` перенесён в `docs/assignment.md` без
изменения содержимого. Изменений в `src/`, `public/`, `angular.json`, `package.json`,
`package-lock.json` и TypeScript-конфигурациях нет. `git diff --check` завершился успешно.

Создан один локальный коммит `docs: approve homepage architecture`. Отправка в remote-репозиторий
не выполнялась.

---

## Prompt 007 — Runtime content configuration

**Date:** 2026-10-13.

**Goal:** реализовать второй этап утверждённого плана — типизированную runtime-конфигурацию,
валидацию, загрузку, состояния shell и unit-тесты без продуктовой вёрстки.

### Prompt

Прочитай `AGENTS.md`, `docs/assignment.md`, `docs/task.md`, `ai_decisions.md` и
`KNOWN_ISSUES.md`.

Реализуй только следующий этап утверждённого плана: runtime-конфигурацию контента. Не начинай
визуальную вёрстку секций и не скачивай Figma-ассеты.

Перед изменением Angular-кода:

1. Используй Angular CLI MCP `list_projects`.
2. Один раз попробуй получить `get_best_practices`.
3. Если снова возникнет уже известная ошибка `Unexpected response type`, не повторяй вызов и
   продолжи на основании конфигурации репозитория и официальной документации Angular.

Не добавляй сторонние зависимости.

Нужно реализовать:

1. Строго типизированные модели runtime-контента: `SiteContent`, navigation, hero и hero slides,
   prizes, leaderboard, mechanics, final CTA, footer и ссылки на ассеты.
2. `public/config/site-content.json` со `schemaVersion` и фактическими текстами и данными страницы.
   Контент не должен дублироваться в TypeScript; для уточнения текстов разрешён только read-only
   Figma MCP; временные Figma URL запрещены.
3. Небольшой собственный runtime-валидатор: поддерживаемая версия схемы, обязательные объекты и
   массивы, основные строки и числа, путь первого ошибочного поля, без сторонней библиотеки.
4. `SiteContentService`: загрузка через `HttpClient`, readonly signal-состояние
   `loading | ready | error`, отсутствие публикации частичных данных, публичный retry, безопасное
   сообщение и подробность только в development-режиме.
5. Инициализацию через `provideHttpClient` и `provideAppInitializer`, которая завершается даже при
   ошибке загрузки.
6. Минимальный route/home shell для `/`, wildcard redirect, loading/error/ready, доступную retry-
   кнопку, без продуктовой вёрстки.
7. Unit-тесты валидной конфигурации, невалидного обязательного поля, неподдерживаемой версии,
   успешной загрузки, HTTP-ошибки, retry и отсутствия публикации частично валидных данных.

Соблюдай strict typing, standalone architecture, `OnPush`, signals и стандартный префикс `app`.

После реализации запусти production build и все unit-тесты, выполни `git diff --check`, проверь
отсутствие временных Figma URL, обнови `prompts.md`, а новые решения или ограничения зафиксируй в
соответствующем Markdown-документе. Не создавай коммит без отдельного подтверждения.

### Result

Angular CLI MCP `list_projects` обнаружил Angular 21 workspace `iron-facts`. Единственный вызов
`get_best_practices` вернул известную ошибку `Unexpected response type` и не повторялся.

Добавлены типизированная схема `SiteContent`, runtime JSON, собственный валидатор с первым
ошибочным JSON-path, signal-based `SiteContentService`, `provideHttpClient`, современный
`provideAppInitializer`, маршрут `/`, wildcard redirect и минимальный shell для состояний
loading/error/ready с retry-кнопкой. Продуктовая вёрстка и Figma-ассеты не добавлялись; новые
зависимости не устанавливались.

Read-only уточнение текстов через Figma MCP не удалось из-за лимита Starter plan и не
повторялось. Конфигурация основана на локальных reference-материалах. Поэтому подтверждён один
видимый hero-slide, а placeholders footer сохранены как runtime-данные и записаны в
`KNOWN_ISSUES.md`. Asset references необязательны до появления локальных файлов, а валидатор
отклоняет внешние asset URL; решение дополнено в `ai_decisions.md`.

### Verification

- Production build — успешно.
- Unit tests — 4 test files, 13 tests, все успешно.
- Поставляемый `public/config/site-content.json` отдельно проходит runtime-валидатор в unit-тесте.
- Сторонние зависимости не добавлены.
- Продуктовая вёрстка и ассеты не добавлены.
- Коммит не создавался.

---

## Prompt 008 — Separate service types, constants and HTTP error formatting

**Date:** 2026-10-13.

**Goal:** уменьшить ответственность `SiteContentService` без изменения его публичного поведения.

### Improved prompt

Проведи сфокусированный рефакторинг runtime-content слоя.

1. Вынеси из `SiteContentService` типы состояния и причин ошибки в отдельный model-файл рядом с
   content domain.
2. Вынеси URL runtime-конфигурации и системные пользовательские сообщения в отдельный
   constants-файл.
3. Вынеси `describeHttpError` из сервиса в переиспользуемый helper внутри `core/http`.
4. Обнови все production- и test-импорты. Не оставляй compatibility re-export из сервиса, если он
   не нужен текущему коду.
5. Добавь прямые unit-тесты для вынесенного HTTP helper; существующее поведение сервиса и его
   тестовые сценарии должны сохраниться.

Ограничения:

- не меняй runtime-контракт, тексты сообщений и поведение `loading | ready | error`;
- не добавляй зависимости;
- не затрагивай продуктовую вёрстку и контент JSON;
- соблюдай strict typing и текущие правила импортов;
- не создавай коммит без отдельного подтверждения.

После изменений запусти production build, все unit-тесты и `git diff --check`. Если полноценный
Angular-запуск блокируется sandbox-ограничениями, выполни доступные TypeScript-проверки и явно
сообщи, какие проверки не удалось повторить.

### Result

`SiteContentState` и `SiteContentErrorReason` перенесены в `site-content-state.model.ts`. URL и
пользовательские сообщения перенесены в `site-content.constants.ts`. `describeHttpError` перенесён
в переиспользуемый `core/http/describe-http-error.ts` и получил отдельные unit-тесты. Production-
и test-импорты обновлены; публичное поведение сервиса и runtime-контракт не менялись, зависимости
не добавлялись.

Angular CLI MCP обнаружил Angular 21 workspace. Единственный вызов `get_best_practices` снова
вернул `Unexpected response type` и не повторялся. Строгая TypeScript-компиляция `tsconfig.app.json`
и `tsconfig.spec.json` прошла успешно. Angular production build и unit-тесты в sandbox были
заблокированы ошибкой доступа к родительским каталогам; повторный запуск вне sandbox не был
разрешён, поэтому эти две проверки после рефакторинга не подтверждены.

---

## Prompt 009 — Runtime path and link safety corrections

**Date:** 2026-10-13.

**Goal:** минимально скорректировать runtime-config для размещения приложения в подпапке и
зафиксировать простые безопасные соглашения для будущих путей.

### Prompt

Проведи минимальную корректировку runtime-config этапа. Не начинай вёрстку и не создавай коммит.

1. Замени URL конфигурации `/config/site-content.json` на `config/site-content.json`, чтобы он
   работал при размещении приложения в подпапке.
2. Зафиксируй соглашение для будущих ассетов: файлы находятся в `public/assets/...`, а JSON
   использует пути `assets/...`. Валидатор должен отклонять внешние URL, `..` и обратные слеши.
3. Оставь для `ContentLink.href` простую проверку строки, но отклоняй `javascript:`, `data:` и
   protocol-relative URL с `//`. Не добавляй сложный URL parser и проверки уникальности
   идентификаторов или позиций рейтинга.
4. Добавь только минимальные unit-тесты: локальный путь `assets/...` принимается, внешний asset
   URL отклоняется, `javascript:` отклоняется, а поставляемый `site-content.json` остаётся
   валидным.
5. При необходимости обнови соглашение в `ai_decisions.md` и добавь запрос с результатом в
   `prompts.md`.

После изменений запусти production build, unit-тесты, `git diff --check` и поиск временных Figma
URL. Не добавляй зависимости и не создавай коммит. Покажи изменённые файлы и результаты проверок.

### Result

URL runtime-конфигурации изменён на относительный `config/site-content.json`. Для asset references
принято соглашение `public/assets/...` на диске и `assets/...` в JSON; валидатор отклоняет внешние
URL, `..` и обратные слеши. `ContentLink.href` дополнительно отклоняет `javascript:`, `data:` и
значения, начинающиеся с `//`, без полноценного URL parser и дополнительных проверок
уникальности.

Добавлены три новых теста валидатора; существующий тест продолжает проверять поставляемый
`site-content.json`. Production build прошёл успешно. Все 5 test files и 19 tests прошли.
Зависимости и продуктовая вёрстка не изменялись, коммит не создавался.

---

## Prompt 010 — Commit runtime content configuration

**Date:** 2026-10-13.

**Goal:** проверить границы runtime-config этапа и сохранить его одним сфокусированным локальным
коммитом.

### Prompt

Проверь, что текущие изменения относятся только к этапу runtime-конфигурации, его тестам и
сопровождающей документации.

Добавь этот запрос и результат в `prompts.md`, выполни `git diff --check` и создай коммит:

`feat: add runtime content configuration`

Не отправляй коммит в remote. После создания покажи hash коммита и итоговый `git status`.

### Result

Проверены tracked и untracked изменения. Production-код ограничен runtime JSON, типизированными
моделями, валидатором, сервисом загрузки, HTTP error helper, инициализацией и минимальным
loading/error/ready shell. Остальные изменения — unit-тесты, test-конфигурация и сопровождающие
`prompts.md`, `ai_decisions.md`, `KNOWN_ISSUES.md`. Продуктовые секции, Figma-ассеты, зависимости
и dependency-файлы не изменялись. Изменения подготовлены к одному локальному коммиту; push не
выполняется.

---

## Prompt 011 — Replace manual content validation with Valibot

**Date:** 2026-10-13.

**Goal:** упростить сложный ручной runtime-валидатор с помощью декларативной schema-библиотеки.

### Prompt

Пользователь попросил оценить способы упрощения функций в `site-content.validator.ts`, после
обсуждения альтернатив выбрал Valibot и поручил использовать его.

### Result

Добавлен Valibot 1.5 как единственная новая production-зависимость. Структура runtime-контента
перенесена в декларативные схемы `site-content.schema.ts`; TypeScript-модели теперь выводятся из
этих схем и сохраняют глубокую readonly-типизацию. Валидатор сокращён до адаптера результата
`safeParse`, который сохраняет прежние error codes, сообщения и формат пути первого ошибочного
поля. Проверки версии схемы, локальных asset paths и опасных link prefixes сохранены.

Angular CLI MCP определил Angular 21 workspace. Единственная попытка получить
`get_best_practices` снова завершилась известной ошибкой `Unexpected response type` и не
повторялась. Строгая TypeScript-компиляция приложения и тестов прошла; все 5 test files и 21 test
прошли. Production build, `git diff --check` и поиск временных Figma URL также завершились
успешно. Коммит не создавался.

---

## Prompt 012 — Implement header and mobile navigation slice

**Date:** 2026-10-13.

**Goal:** реализовать только базовые design tokens, shared button, header, mobile menu и их
интеграцию с ready-state без начала продуктовых секций.

### Prompt

Прочитать `AGENTS.md`, `docs/assignment.md`, `docs/task.md`, `ai_decisions.md` и
`KNOWN_ISSUES.md`. Перед изменением Angular-кода один раз выполнить Angular CLI MCP
`list_projects` и `get_best_practices`; известную ошибку `Unexpected response type` не повторять.

Реализовать глобальные CSS custom-property tokens и base styles, standalone
`AppButtonComponent`, standalone `SiteHeaderComponent`, закрытое/открытое mobile menu внутри
header и подключить header к валидированному `content.navigation` в ready-state home. Использовать
нативные button/link и `<dialog>`, обеспечить disabled, hover/active/focus-visible, Escape,
возврат фокуса, закрытие после выбора пункта, безопасные external links и общую runtime-модель
desktop/mobile. Не реализовывать hero, marquee, prizes, leaderboard, mechanics, final CTA или
footer.

Применить workflow `figma-design-to-code` к точечным узлам Navbar `1:1548`, Mobile menu
`1:1540` и Button `1:1322`, не запрашивая повторно полные frames `1:1588` и `1:271`. При лимите
не подменять оригинальные ассеты, не добавлять приблизительный логотип и явно перечислить
непроверенное. Ассеты допустимы только через Figma workflow в `public/assets/...` с путями
`assets/...`; обновить реестр реально добавленных файлов.

Добавить полезные unit-тесты кнопки, header/menu и home integration. Если доступен browser tool,
проверить `375×812`, `768×1024`, `1024×768`, `1440×900`, overflow, русские подписи, состояния,
открытое меню и layout shifts. Затем выполнить production build, все тесты, `git diff --check`,
поиск временных Figma URL и проверку неизменности зависимостей. Обновить документацию только для
новых решений/ограничений и не создавать коммит.

### Result

Добавлены глобальные tokens/base styles, `AppButtonComponent`, `SiteHeaderComponent` с общей
runtime-моделью desktop/mobile и нативное modal mobile menu. Ready-state home передаёт
`content.navigation` в header; loading/error/retry сохранены, остальные секции не начаты. Mobile
menu закрывается кнопкой, Escape и выбором пункта, возвращает фокус hamburger и автоматически
закрывается при переходе на desktop. Production build прошёл. Все 7 test files и 30 unit-тестов
прошли. `git diff --check` и поиск временных Figma URL прошли, зависимости не изменены.

---

## Prompt 013 — Add manually supplied header logo and mobile-menu reference

**Date:** 2026-10-13.

**Goal:** завершить точный ассет логотипа и уточнить mobile menu без дополнительных Figma MCP-
вызовов.

### Prompt

Пользователь предоставил `LOGO.svg` и screenshot открытого mobile menu. Использовать только эти
точные материалы вместо приблизительных замен.

### Result

Предоставленный SVG размером `185×41` сохранён в `public/assets/brand/logo.svg` и подключён через
`navigation.logo` в `public/config/site-content.json` относительным путём `assets/brand/logo.svg`.
Компонент по-прежнему не содержит хардкода ассета. В asset registry указан source frame Navbar
`1:1548`; неизвестный ID внутреннего слоя не придумывался.

По screenshot `375×775` уточнены центрирование и вертикальный ритм пунктов mobile menu, размер
текста, размер close icon, нижний отступ CTA, размер обычной кнопки и срез только её нижнего
правого угла. Production build прошёл, локальный SVG попал в build output, все 7 test files и
30 unit-тестов прошли, `git diff --check` не нашёл ошибок, временных Figma URL нет. Новые
зависимости не добавлялись, продуктовые секции не затрагивались.
