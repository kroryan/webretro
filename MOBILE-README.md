# WebRetro Mobile Enhancement

## Descripción

Se ha implementado compatibilidad completa con dispositivos móviles iOS y Android para el proyecto WebRetro, añadiendo controles táctiles y optimizaciones específicas para dispositivos móviles.

## Características Implementadas

### 🎮 Controles Táctiles
- **D-Pad Virtual**: Control direccional completo (arriba, abajo, izquierda, derecha)
- **Botones de Acción**: A, B, X, Y con colores distintivos
- **Botones de Hombro**: L, R, L2, R2 para juegos que los requieran
- **Controles de Sistema**: Start y Select
- **Retroalimentación Visual**: Animaciones y efectos visuales al tocar
- **Retroalimentación Háptica**: Vibración en dispositivos compatibles

### 📱 Optimizaciones Móviles
- **Detección Automática**: Los controles aparecen automáticamente en dispositivos móviles
- **Diseño Responsivo**: Adaptación a diferentes tamaños de pantalla y orientaciones
- **Prevención de Zoom**: Evita el zoom accidental durante el juego
- **Gestos Táctiles**: Deslizar para mostrar/ocultar menú
- **Auto-ocultar**: Los controles se ocultan tras 10 segundos de inactividad
- **Orientación Preferida**: Optimizado para modo paisaje

### 🔧 Mejoras Técnicas
- **Canvas Responsivo**: Ajusta automáticamente el tamaño según los controles activos
- **Optimización de Rendimiento**: Configuraciones especiales para dispositivos de bajo rendimiento
- **PWA Mejorada**: Mejor experiencia como aplicación web instalable
- **Soporte Multi-touch**: Manejo adecuado de múltiples toques simultáneos

## Archivos Añadidos/Modificados

### Nuevos Archivos
- `assets/mobile-controls.css` - Estilos para controles móviles
- `assets/mobile-controls.js` - Lógica de controles táctiles
- `assets/mobile-integration.js` - Integración con WebRetro existente
- `mobile-test.html` - Página de prueba y documentación
- `MOBILE-README.md` - Esta documentación

### Archivos Modificados
- `index.html` - Añadidas referencias a archivos móviles y meta tags
- `library.html` - Optimizaciones móviles para la biblioteca de ROMs
- `manifest.json` - Configuración PWA mejorada
- `assets/base.css` - Estilos adicionales para móvil

## Uso

### Instalación
Los archivos ya están integrados. Solo necesitas:

1. Subir todos los archivos al servidor
2. Acceder desde un dispositivo móvil
3. Los controles aparecerán automáticamente

### Controles Táctiles

```
┌─────────────────────────────────────┐
│  ☰                                  │
│                                     │
│  ▲     [L] [R]        Y             │
│ ◀ ▶   [L2][R2]      X   A           │
│  ▼   [SEL][START]     B             │
│                                CTRL │
└─────────────────────────────────────┘
```

- **D-Pad** (Izquierda): Control direccional
- **Botones ABXY** (Derecha): Acciones principales
- **L/R/L2/R2** (Centro superior): Botones de hombro
- **SELECT/START** (Centro inferior): Controles de sistema
- **☰** (Superior izquierda): Toggle menú
- **CTRL** (Inferior derecha): Mostrar/ocultar controles

### Gestos
- **Deslizar hacia arriba** desde la parte inferior: Mostrar menú
- **Deslizar hacia abajo** desde la parte superior: Ocultar menú
- **Toque largo**: Menú contextual (en algunos elementos)

### PWA (Progressive Web App)
Para instalar como aplicación:

1. **Chrome Android**: Menú → "Añadir a pantalla de inicio"
2. **Safari iOS**: Compartir → "Añadir a pantalla de inicio"
3. **Edge**: Menú → "Aplicaciones" → "Instalar esta aplicación"

## Compatibilidad

### Dispositivos Soportados
- ✅ **iPhone/iPad** (iOS 12+)
- ✅ **Android** (Chrome, Firefox, Edge)
- ✅ **Tablets Android**
- ✅ **Dispositivos con pantalla táctil**

### Navegadores Compatibles
- ✅ Safari (iOS)
- ✅ Chrome (Android/iOS)
- ✅ Firefox Mobile
- ✅ Edge Mobile
- ✅ Samsung Internet

## Configuración Avanzada

### Personalización de Controles
Para modificar el mapeo de controles, edita el objeto `buttonMap` en `mobile-controls.js`:

```javascript
this.buttonMap = {
    'dpad-up': 'ArrowUp',
    'dpad-down': 'ArrowDown',
    'dpad-left': 'ArrowLeft',
    'dpad-right': 'ArrowRight',
    'btn-a': 'h',
    'btn-b': 'g',
    // ... más controles
};
```

### Ajustar Sensibilidad
Para cambiar la sensibilidad del joystick virtual, modifica `maxDistance` en la función `updateJoystick()`.

### Desactivar Funciones
Para desactivar ciertas funciones móviles, comenta las líneas correspondientes en `mobile-integration.js`:

```javascript
// setupAutoHideControls(); // Desactiva auto-ocultar
// addHapticFeedback();      // Desactiva vibración
// setupGestureControls();   // Desactiva gestos
```

## Solución de Problemas

### Los controles no aparecen
1. Verifica que estés en un dispositivo móvil o pantalla táctil
2. Comprueba que los archivos CSS y JS se carguen correctamente
3. Abre las herramientas de desarrollador y busca errores en consola

### Los controles no responden
1. Asegúrate de que el juego esté cargado completamente
2. Verifica que no hay otros elementos interceptando los toques
3. Prueba recargando la página

### Problemas de rendimiento
1. Cierra otras aplicaciones en segundo plano
2. Usa modo paisaje para mejor rendimiento
3. Considera reducir la resolución en configuración de RetroArch

### Problemas de orientación
1. Activa la rotación automática del dispositivo
2. Usa modo paisaje para mejor experiencia
3. Si persiste, recarga la página tras rotar

## Desarrollo

### Estructura del Código
```
assets/
├── mobile-controls.css      # Estilos de controles
├── mobile-controls.js       # Clase principal de controles
├── mobile-integration.js    # Integración con WebRetro
└── base.css                # Estilos base (modificado)
```

### Eventos Principales
- `touchstart/touchend`: Manejo de toques en botones
- `orientationchange`: Ajuste de layout en rotación
- `resize`: Redimensionamiento dinámico

### API Expuesta
```javascript
window.mobileControls        // Instancia de controles
window.webretroMobile        // Utilidades móviles
```

## Contribución

Para contribuir mejoras:

1. Mantén la compatibilidad con la versión desktop
2. Prueba en múltiples dispositivos y navegadores
3. Documenta cambios significativos
4. Sigue las convenciones de código existentes

## Licencia

Mantiene la misma licencia que el proyecto WebRetro original.

---

**¡Disfruta jugando retro games en tu móvil! 🎮📱**