# DocumentViewer

Приложение дает возможность просмотреть документ и добавить к нему аннотации.

[Demo](https://webatom.github.io/document-viewer/)

## Локальный запуск

```bash
  # если используется nvm, либо установить nodejs нужной версии (см. .nvmrc)
  nvm use

  npm i
  npm start
```

## Структура проекта

```
src/app/
├── features/zoom/       # Фича масштабирования
├── pages/document/      # Главная страница документа
│   ├── store/           # DocumentPageStore для управления состоянием
│   └── document-page.*  # Основной компонент страницы
├── shared/              # Общие компоненты и утилиты
│   ├── api/             # API сервисы
│   ├── models/          # TypeScript интерфейсы
│   ├── ui/              # Переиспользуемые UI компоненты
│   │   ├── annotation/  # Компонент аннотации
│   │   ├── draggable/   # Директива для перетаскивания
│   │   ├── page-viewer/ # Компонент отображения страницы
│   │   └── toolbar/     # Панель инструментов
│   └── utils/           # Утилиты
└── assets/mock/         # Тестовые данные
```

## Сильные стороны реализации

- ✅ **Современный Angular**: Использование Angular 20 с новейшими возможностями (signals, computed, zoneless change detection)
- ✅ **Архитектура**: Feature-based структура с четким разделением ответственности
- ✅ **TypeScript**: Строгая типизация с интерфейсами для всех моделей данных
- ✅ **Dependency Injection**: Использование Angular DI системы
- ✅ **Code quality tools**: ESLint, Prettier, Husky для поддержания качества
- ✅ **Lazy-загрузка страниц**: Страницы(картинки) будут подгружать по мере необходимости

## Слабые стороны и известные проблемы

### ❌ Мобильная адаптация

- **Отсутствие touch-событий**: Перетаскивание и создание аннотаций не работает на мобильных устройствах
- **Проблемы с размерами**: Интерфейс может быть неудобен на маленьких экранах

### ❌ Тестирование

- **Отсутствие unit-тестов**: Нет покрытия тестами компонентов и сервисов
- **Нет e2e тестов**: Отсутствует автоматизированное тестирование пользовательских сценариев

### ❌ Позиционирование аннотаций

- **Проблема с краями**: Аннотации могут быть созданы за пределами видимой области страницы
- **Нет автоматической коррекции**: Позиция исправляется только после перетаскивания

### ❌ Обработка ошибок

- **Простая обработка ошибок**: Минимальная обработка ошибок загрузки документов

## Возможные решения и улучшения

### 🔧 Мобильная адаптация

```typescript
// Добавить поддержку touch-событий в DraggableDirective
@HostListener('touchstart', ['$event'])
onTouchStart(event: TouchEvent) {
  event.preventDefault();
  const touch = event.touches[0];
  this.startDrag({ x: touch.clientX, y: touch.clientY });
}

@HostListener('touchmove', ['$event'])
onTouchMove(event: TouchEvent) {
  if (!this.isDragging()) return;
  const touch = event.touches[0];
  this.handleMove(event, { x: touch.clientX, y: touch.clientY });
}
```

### 🧪 Тестирование

```typescript
// Пример unit-теста для ZoomService
describe('ZoomService', () => {
  let service: ZoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoomService);
  });

  it('should increment zoom correctly', () => {
    service.increment();
    expect(service.zoomValue()).toBe(80);
  });
});
```

### 📍 Улучшение позиционирования

```typescript
// Добавить валидацию позиции при создании аннотации
private validateAnnotationPosition(x: number, y: number, container: HTMLElement): {x: number, y: number} {
  const rect = container.getBoundingClientRect();
  const clampedX = Math.max(0, Math.min(x, rect.width - ANNOTATION_WIDTH));
  const clampedY = Math.max(0, Math.min(y, rect.height - ANNOTATION_HEIGHT));

  return {
    x: (clampedX / rect.width) * 100,
    y: (clampedY / rect.height) * 100
  };
}
```

### ⚡ Оптимизация производительности

```typescript
// Добавить виртуализацию для больших документов
@Injectable()
export class VirtualScrollService {
  getVisiblePages(scrollTop: number, containerHeight: number): number[] {
    // Логика определения видимых страниц
  }
}
```
