import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { trace, context } from '@opentelemetry/api';

@Injectable({ scope: Scope.TRANSIENT })
export class OpenTelemetryLogger extends ConsoleLogger {
  // Sobrescribe el método `log`
  log(message: any, context?: string) {
    this.printMessageWithTrace('debug', message, context);
  }

  // Sobrescribe el método `error`
  error(message: any, stack?: string, context?: string) {
    this.printMessageWithTrace('error', message, context, stack);
  }

  // Sobrescribe el método `warn`
  warn(message: any, context?: string) {
    this.printMessageWithTrace('warn', message, context);
  }

  private printMessageWithTrace(
    level: 'debug' | 'error' | 'warn' | 'fatal',
    message: any,
    logContext?: string,
    stack?: string,
  ) {
    // Obtenemos el span activo del contexto de OpenTelemetry
    const activeSpan = trace.getSpan(context.active());

    // Si no hay un span, simplemente logueamos de forma normal
    if (!activeSpan) {
      super[level](message, logContext);
      return;
    }

    // Si hay un span, extraemos su contexto
    const spanContext = activeSpan.spanContext();
    const { traceId, spanId } = spanContext;

    // Creamos un objeto de log enriquecido
    const enrichedLog = {
      message,
      trace_id: traceId,
      span_id: spanId,
    };

    // Usamos el método original de la clase padre para imprimir el mensaje
    // Lo convertimos a JSON para una mejor visualización estructurada
    super[level](JSON.stringify(enrichedLog), logContext);
  }
}
