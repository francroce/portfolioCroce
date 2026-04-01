# Franco — Portfolio

Portfolio personal con panel de administración privado, cursor custom, partículas interactivas y command palette. Estética dark editorial con diseño responsive.

## Stack

- **React 18** + **Vite**
- CSS modular (sin frameworks)
- localStorage para persistencia de datos del admin
- Desplegado en **Vercel**

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Deploy en Vercel

### Opción 1: Desde GitHub (recomendado)
1. Subí el proyecto a un repo de GitHub
2. Andá a [vercel.com](https://vercel.com) → New Project → Import desde GitHub
3. Vercel auto-detecta Vite. Click en **Deploy**

### Opción 2: CLI
```bash
npm i -g vercel
vercel
```

## Panel Admin (privado)

Accedé a `/admin` en tu sitio. Te va a pedir una contraseña.

**Contraseña por defecto:** `franco2024`

> Para cambiar la contraseña, editá la constante `ADMIN_PASSWORD` en `src/App.jsx`.

Desde el panel podés editar:
- **Hero**: nombre, título, tagline, CTAs
- **Sobre mí**: descripción, estadísticas
- **Skills**: agregar/eliminar skills con nivel y categoría
- **Trayectoria**: experiencia, educación y certificaciones
- **Proyectos**: título, descripción, tags, links, imagen, destacado
- **Contacto**: email, redes sociales

Los cambios se guardan en `localStorage` del navegador.

## Features especiales

- **🎯 Cursor custom**: dot + glow ring que reacciona a hovers, con ripple al hacer click. Se desactiva en mobile/touch.
- **✨ Partículas interactivas**: constelación de nodos en el Hero que se repelen con el mouse y se conectan entre sí.
- **⌘K Command Palette**: buscador rápido (Cmd+K / Ctrl+K) para navegar entre secciones, abrir links y togglear el efecto grain.

## Estructura

```
src/
├── components/
│   ├── AdminPanel.*    # Panel CRUD completo
│   ├── CommandBar.*    # ⌘K command palette
│   ├── CustomCursor.*  # Cursor interactivo
│   ├── HeroParticles.* # Canvas de partículas
│   ├── Hero/About/Skills/Timeline/Projects/Contact/Footer
│   └── Icons.jsx       # SVG icons
├── data/               # Datos por defecto
├── hooks/              # Custom hooks
├── utils/              # Storage y utilidades
├── App.jsx             # Routing + auth + composición
├── main.jsx            # Entry point
└── styles.css          # Estilos globales
```
