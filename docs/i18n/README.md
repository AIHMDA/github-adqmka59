# Internationalization (i18n) Guide

## Supported Languages
- English (en) - Default
- Arabic (ar) - Right-to-left
- Somali (so)

## Directory Structure
```
src/
  ├── locales/
  │   ├── en/
  │   │   ├── common.json
  │   │   ├── auth.json
  │   │   └── dashboard.json
  │   ├── ar/
  │   │   ├── common.json
  │   │   ├── auth.json
  │   │   └── dashboard.json
  │   └── so/
  │       ├── common.json
  │       ├── auth.json
  │       └── dashboard.json
```

## Usage

### In Components
```tsx
import { useTranslation } from 'next-i18next'

export function MyComponent() {
  const { t } = useTranslation('common')
  
  return <h1>{t('welcome')}</h1>
}
```

### Dynamic Content
```tsx
// With variables
t('greeting', { name: 'John' })

// With plurals
t('items', { count: 2 })

// With formatting
t('price', { value: 1000, currency: 'USD' })
```

## RTL Support
Arabic requires right-to-left (RTL) support:

```tsx
// _app.tsx
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const { locale } = useRouter()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  
  return (
    <div dir={dir}>
      <Component {...pageProps} />
    </div>
  )
}
```

## Date & Number Formatting
Use the Intl API for consistent formatting:

```tsx
// Date formatting
const date = new Date()
new Intl.DateTimeFormat(locale).format(date)

// Number formatting
const number = 1000.50
new Intl.NumberFormat(locale).format(number)

// Currency formatting
new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'USD'
}).format(1000.50)
```