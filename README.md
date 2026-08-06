Nexo Desarrollos

MVP frontend mobile-first para la gestión integral de desarrollos inmobiliarios.

Nexo Desarrollos centraliza el recorrido completo de cada oportunidad comercial y cada lote, desde la captación de un lead hasta la reserva, venta financiada, cobranza, escrituración, entrega, obras y servicios postventa.

Estado del proyecto

El proyecto se encuentra en etapa inicial de definición y prototipado del MVP frontend.

La primera versión prioriza:

Experiencia mobile-first.
Presentación comercial de alta calidad.
Datos simulados coherentes.
Arquitectura modular.
Navegación funcional.
Preparación para una futura integración con Supabase y Vercel.

Esta etapa no incluye backend productivo ni integraciones externas reales.

Objetivo

Construir una plataforma capaz de organizar y visualizar:

Campañas comerciales.
Captación de leads.
Calificación y seguimiento de oportunidades.
Visitas y reuniones.
Cotizaciones.
Disponibilidad de lotes.
Bloqueos temporales.
Promesas de seña.
Validación de señas.
Reservas.
Ventas financiadas.
Planes de cuotas.
Pagos y morosidad.
Documentación legal y técnica.
Escrituración.
Obras postventa.
Proveedores.
Servicios recurrentes.
Alertas y automatizaciones.
Recorrido principal
Campaña
→ Lead
→ Calificación
→ Seguimiento
→ Visita
→ Selección de lote
→ Cotización
→ Negociación
→ Bloqueo temporal
→ Intención de reserva
→ Seña
→ Reserva confirmada
→ Venta
→ Financiación
→ Cobranza
→ Escrituración
→ Entrega
→ Obras
→ Servicios recurrentes
Alcance del MVP

La primera versión debe permitir demostrar principalmente:

El ingreso de leads provenientes de campañas.
La depuración y calificación comercial.
El seguimiento de cada oportunidad.
La consulta de lotes disponibles.
La generación de cotizaciones.
El bloqueo temporal de lotes.
El registro y validación de señas.
La confirmación o caída de reservas.
El seguimiento de ventas financiadas.
La detección de cuotas vencidas.
La gestión del proceso de escrituración.
La identificación de oportunidades postventa.
Mobile-first

La experiencia móvil es la prioridad principal del proyecto.

Las interfaces deben diseñarse primero para teléfonos móviles y luego adaptarse a tablet y escritorio.

Resoluciones de referencia:

360 × 800
390 × 844
412 × 915
768 × 1024
1366 × 768
1440 × 900

Principios:

Navegación táctil.
Acciones principales accesibles.
Sin dependencias de hover.
Sin tablas inutilizables en teléfonos.
Formularios progresivos.
Bottom sheets y drawers.
Tarjetas adaptativas.
Sin desplazamiento horizontal global.
Áreas táctiles adecuadas.
Información presentada progresivamente.
Stack previsto
React.
TypeScript.
Vite.
React Router.
Tailwind CSS.
Lucide Icons.
Recharts.
React Hook Form.
Zod.
date-fns.
Vitest.
React Testing Library.

El stack definitivo podrá ajustarse durante la fundación técnica del proyecto.

Arquitectura prevista
src/
├── app/
│   ├── router/
│   ├── layouts/
│   ├── providers/
│   └── config/
│
├── modules/
│   ├── dashboard/
│   ├── campaigns/
│   ├── leads/
│   ├── developments/
│   ├── lots/
│   ├── quotes/
│   ├── reservations/
│   ├── sales/
│   ├── payments/
│   ├── customers/
│   ├── documents/
│   ├── legal/
│   ├── works/
│   ├── providers/
│   ├── automations/
│   ├── notifications/
│   └── reports/
│
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── charts/
│   ├── forms/
│   ├── cards/
│   ├── masterplan/
│   ├── timeline/
│   └── feedback/
│
├── domain/
│   ├── entities/
│   ├── enums/
│   ├── rules/
│   └── workflows/
│
├── services/
│   ├── interfaces/
│   ├── mock/
│   └── storage/
│
├── data/
│   ├── fixtures/
│   └── generators/
│
├── hooks/
├── utils/
├── types/
├── assets/
└── styles/

La interfaz no debe consumir datos simulados directamente.

Patrón previsto:

Página
→ Servicio
→ Interfaz de repositorio
→ Repositorio mock

En una etapa posterior:

Página
→ Servicio
→ Interfaz de repositorio
→ Repositorio Supabase
Entidades principales
Development.
DevelopmentStage.
Block.
Lot.
Campaign.
Lead.
LeadQualification.
Opportunity.
Activity.
Task.
Visit.
Quote.
LotHold.
ReservationIntent.
Deposit.
Reservation.
Sale.
Contract.
PaymentPlan.
Installment.
Payment.
Receipt.
Commission.
Document.
LegalProcess.
WorkRequest.
WorkOrder.
Provider.
ServiceSubscription.
Notification.
AutomationRule.
Reglas centrales
Reserva

Un lote no se considera reservado solamente porque un cliente haya manifestado interés.

La secuencia debe diferenciar:

Interés
→ Selección
→ Bloqueo temporal
→ Intención de reserva
→ Promesa de seña
→ Seña informada
→ Seña validada
→ Reserva confirmada

Solo una seña confirmada puede confirmar una reserva.

Bloqueo temporal

Un bloqueo:

Tiene un responsable.
Está asociado con un lead.
Posee fecha de inicio y vencimiento.
No equivale a una venta.
No equivale a una reserva.
Puede vencer y liberar nuevamente el lote.
Decisiones sensibles

Las decisiones contractuales o legales no deben ejecutarse automáticamente.

El sistema puede:

Generar alertas.
Crear tareas.
Recomendar acciones.
Escalar casos.

La decisión final debe requerir intervención humana.

Datos de demostración

El MVP utilizará datos simulados, deterministas y relacionados entre módulos.

Desarrollo ficticio inicial:

Altos del Horizonte

Los mismos datos deben reflejarse de forma coherente en:

Dashboard.
Campañas.
Leads.
Pipeline.
Agenda.
Masterplan.
Cotizaciones.
Reservas.
Cobranzas.
Ficha del lote.
Obras.
Alertas.
Ramas de trabajo
main

Versión estable e integrada.

ai-studio

Prototipo visual y funcional generado o consolidado desde Google AI Studio.

jul

Rama base futura para tareas ejecutadas mediante Jules.

Las ramas temporales podrán utilizar nombres como:

import/ai-studio-foundation
import/ai-studio-preventa
import/ai-studio-masterplan
jules/initial-mobile-mvp
Flujo de trabajo previsto
Google AI Studio
        ↓
Prototipo mobile
        ↓
Exportación o sincronización
        ↓
Rama ai-studio
        ↓
Validación local
        ↓
Pull request
        ↓
main
        ↓
Actualización de jul
        ↓
Implementación controlada con Jules
Ejecución local

Cuando la aplicación se encuentre inicializada:

npm install
npm run dev

Validaciones previstas:

npm run lint
npm run test
npm run build
Despliegue inicial

La primera versión se desplegará como frontend estático en BlueHost.

El proyecto deberá generar una carpeta de producción compatible con un servidor Apache.

En caso de utilizar React Router con rutas SPA, deberá incluirse una configuración de reescritura mediante .htaccess.

Evolución futura

El sistema podrá evolucionar hacia:

Supabase.
Vercel.
n8n.
Integración con Meta Ads.
Integración con Google Ads.
WhatsApp.
Correo electrónico.
Pasarelas de pago.
Firma digital.
Gestión documental.
Automatizaciones.
Portales para compradores y proveedores.
Aplicación PWA.
Arquitectura multiempresa.
Restricciones de esta etapa

No incorporar todavía:

Backend productivo.
Base de datos productiva.
Secretos.
Credenciales.
APIs pagas.
Autenticación real.
Pagos reales.
Automatizaciones reales.
Conexiones con entornos de producción.
Repositorio
https://github.com/amoresemiliano/realstate_integral
Licencia

Proyecto privado o de uso reservado hasta que se defina una licencia formal.
