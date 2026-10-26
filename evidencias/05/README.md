# Bloque 05

## Resultado

- Qué añadí al proyecto: comprobé la selección de la segunda tarjeta y restauré después el botón de EVT-101 para conservar el estado base.
- Ruta o pantalla comprobada: pantalla `Programación` de la aplicación móvil en Expo Web (`http://localhost:8082/`).
- Estado y respuesta observados: al pulsar `Seleccionar EVT-102`, la pantalla mostró `Selección: EVT-102`. Al terminar, restauré el botón para que vuelva a seleccionar `EVT-101`.

## Comprensión

- Recorrido del dato, explicado con mis palabras: al pulsar el botón, su manejador llama a `setSelected` con el identificador del evento. React actualiza el estado `selected` y la pantalla presenta ese valor en el texto `Selección:`.
- Cambio guiado y resultado: cambié temporalmente el identificador del manejador y el texto del botón a `EVT-102`. Pulsé el botón y comprobé que la selección cambió a `EVT-102`; luego restauré el identificador y el texto a `EVT-101`.
- Error encontrado y cómo lo resolví: el puerto 8081 ya estaba ocupado, así que inicié Expo Web en el puerto 8082. La aplicación cargó y se pudo comprobar el resultado sin modificar la configuración del proyecto.

## Evidencias

- Captura o transcripción breve, sin credenciales:

  ```text
  Antes de pulsar: botón "Seleccionar EVT-102" · Selección: ninguna
  Después de pulsar: Selección: EVT-102
  Estado base restaurado: botón "Seleccionar EVT-101"
  ```

  `npm run typecheck` y `npm run build:web` terminaron correctamente con el cambio temporal.

- Limitaciones del ejercicio: los eventos y la selección son locales al estado de la pantalla; no se envía la selección a una API ni se persiste al cerrar o recargar la aplicación.
 