# Миграция авторизации с Redux на TanStack Query

## Что изменилось

### Удаленные файлы:

- `src/entities/User/model/thunks.ts` - заменен на хуки в `useAuth.ts`
- `src/entities/User/model/slice.ts` - заменен на TanStack Query
- `src/entities/User/model/selectors.ts` - заменен на хуки в `useAuth.ts`

### Новые хуки в `src/shared/hooks/useAuth.ts`:

```typescript
// Основной хук для авторизации
const { user, isAuthenticated, isInitialized, isLoading, error } = useAuth();

// Хук для получения профиля (с кэшированием)
const { data: user, isLoading, error } = useProfile();

// Хук для входа
const loginMutation = useLogin();
loginMutation.mutate({ email, password });

// Хук для регистрации
const registerMutation = useRegister();
registerMutation.mutate({ email, password });

// Хук для выхода
const logoutMutation = useLogout();
logoutMutation.mutate();
```

## Преимущества миграции

1. **Меньше кода**: 166 строк Redux кода → ~60 строк TanStack Query
2. **Автоматическое кэширование**: профиль кэшируется на 5 минут
3. **Синхронизация между вкладками**: автоматически
4. **Background refetch**: автоматическая проверка валидности токена
5. **Встроенная обработка ошибок**: меньше бойлерплейта

## Обновленные компоненты

- `LoginForm` - использует `useLogin()`
- `RegisterForm` - использует `useRegister()`
- `Sidebar` - использует `useLogout()`
- `MobileMenu` - использует `useLogout()`
- `AuthProvider` - упрощен, использует `useAuth()`

## Настройки кэширования

- **staleTime**: 5 минут - данные считаются свежими
- **gcTime**: 30 минут - данные хранятся в памяти
- **retry**: false - не повторяем запросы при 401 ошибке

## Совместимость

Все существующие компоненты продолжают работать с новым API через хук `useAuth()`, который возвращает тот же интерфейс.
