import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { VenueZone, ZoneStatus, ZoneInput } from './src/types';
import {
  API_URL,
  getZones,
  getZone,
  createZone,
  replaceZone,
  updateZoneStatus,
  deleteZone
} from './src/api';

export default function App() {
  const [zones, setZones] = useState<VenueZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  async function loadZones() {
    setLoading(true);
    setError('');
    try {
      const data = await getZones();
      setZones(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error al conectar con la API');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadZones();
  }, []);

  async function runAction(label: string, task: () => Promise<unknown>) {
    setBusy(true);
    setError('');
    setResult('');
    try {
      const res = await task();
      setResult(`${label}\n${JSON.stringify(res, null, 2)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error en la petición');
    } finally {
      setBusy(false);
    }
  }

  const sampleNewZone: ZoneInput = {
    name: 'Acoustic Dome',
    capacity: 950,
    status: 'OPEN'
  };

  const sampleReplaceZone: ZoneInput = {
    name: 'Main Stage Ultra',
    capacity: 6500,
    status: 'OPEN'
  };

  const statusColor = (status: ZoneStatus) => {
    switch (status) {
      case 'OPEN':
        return '#00e5a3';
      case 'FULL':
        return '#ffb300';
      case 'CLOSED':
        return '#ff4d6d';
      default:
        return '#a0a3b1';
    }
  };

  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Text style={styles.eyebrow}>VENUE CONTROL</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>FESTIVAL OPERATIONS</Text>
          <Text style={styles.title}>Espacios y Zonas</Text>
          <Text style={styles.meta}>
            {zones.length} zonas en operación ·{' '}
            <Text style={styles.endpointMeta}>
              {API_URL.includes('localhost') ? 'Entorno Local' : 'AWS Cloud'}
            </Text>
          </Text>
        </View>

        {/* Listado de Zonas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ESPACIOS OPERATIVOS</Text>
          <Pressable
            accessibilityRole="button"
            disabled={loading || busy}
            style={[styles.smallButton, (loading || busy) && styles.disabledButton]}
            onPress={() => void loadZones()}
          >
            <Text style={styles.smallButtonText}>
              {loading ? 'Recargando…' : '↻ GET Recargar'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {zones.map(zone => {
            const dotColor = statusColor(zone.status);
            return (
              <View key={zone.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.zoneId}>{zone.id}</Text>
                  <View style={[styles.statusPill, { borderColor: dotColor }]}>
                    <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                    <Text style={[styles.statusText, { color: dotColor }]}>
                      {zone.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.zoneName}>{zone.name.toUpperCase()}</Text>
                <View style={styles.capacityRow}>
                  <Text style={styles.capacityValue}>
                    {zone.capacity.toLocaleString('es-ES')}
                  </Text>
                  <Text style={styles.capacityLabel}>CAPACIDAD MÁXIMA</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Notificación de Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        ) : null}

        {/* Botones de Operaciones del Contrato API */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>OPERACIONES DEL CONTRATO (HTTP)</Text>
          <Text style={styles.helpText}>
            Pulsa cualquier operación para enviarla a la API. Las escrituras son simuladas
            por el backend y se verifican en la consola inferior.
          </Text>

          <View style={styles.buttonStack}>
            <Pressable
              accessibilityRole="button"
              disabled={busy || loading}
              style={[styles.actionBtn, styles.btnGet]}
              onPress={() => void runAction('GET /zones/ZONE-01 (Detalle)', () => getZone('ZONE-01'))}
            >
              <Text style={styles.actionBtnText}>GET /zones/ZONE-01 · Detalle</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={busy || loading}
              style={[styles.actionBtn, styles.btnPost]}
              onPress={() => void runAction('POST /zones (Crear nuevo)', () => createZone(sampleNewZone))}
            >
              <Text style={styles.actionBtnText}>＋ NUEVO ESPACIO (POST /zones)</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={busy || loading}
              style={[styles.actionBtn, styles.btnPut]}
              onPress={() =>
                void runAction('PUT /zones/ZONE-01 (Reemplazo)', () =>
                  replaceZone('ZONE-01', sampleReplaceZone)
                )
              }
            >
              <Text style={styles.actionBtnText}>PUT /zones/ZONE-01 · Reemplazar</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={busy || loading}
              style={[styles.actionBtn, styles.btnPatch]}
              onPress={() =>
                void runAction('PATCH /zones/ZONE-02 (Actualizar estado)', () =>
                  updateZoneStatus('ZONE-02', 'OPEN')
                )
              }
            >
              <Text style={styles.actionBtnText}>PATCH /zones/ZONE-02 · Estado a OPEN</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={busy || loading}
              style={[styles.actionBtn, styles.btnDelete]}
              onPress={() => void runAction('DELETE /zones/ZONE-04 (Eliminar)', () => deleteZone('ZONE-04'))}
            >
              <Text style={styles.actionBtnText}>DELETE /zones/ZONE-04 · Eliminar</Text>
            </Pressable>
          </View>
        </View>

        {/* Consola de Resultados HTTP */}
        <View style={styles.consoleSection}>
          <View style={styles.consoleHeader}>
            <Text style={styles.consoleTitle}>RESPUESTA HTTP & LOGS</Text>
            {busy ? <Text style={styles.busyIndicator}>Enviando petición…</Text> : null}
          </View>
          <View style={styles.consoleBody}>
            <Text style={styles.consoleText}>
              {result || 'Esperando invocación de la API…'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0a0c14'
  },
  content: {
    padding: 24,
    paddingTop: 48,
    gap: 20,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center'
  },
  header: {
    gap: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1d2238'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eyebrow: {
    color: '#ff4b9b',
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 13
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0a291f',
    borderColor: '#00e5a3',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00e5a3'
  },
  liveText: {
    color: '#00e5a3',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1
  },
  subtitle: {
    color: '#8b92af',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 12,
    marginTop: 4
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  meta: {
    color: '#a0a6c2',
    fontSize: 14,
    marginTop: 2
  },
  endpointMeta: {
    color: '#00d4ff',
    fontWeight: '700'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5
  },
  smallButton: {
    backgroundColor: '#1f253e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#343c62'
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  disabledButton: {
    opacity: 0.5
  },
  grid: {
    gap: 12
  },
  card: {
    backgroundColor: '#131726',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#242b45',
    gap: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  zoneId: {
    color: '#ff4b9b',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#0c0f1c'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  zoneName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800'
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8
  },
  capacityValue: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900'
  },
  capacityLabel: {
    color: '#7b839e',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1
  },
  errorBox: {
    backgroundColor: '#35121b',
    borderColor: '#ff4d6d',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12
  },
  errorText: {
    color: '#ff94a8',
    fontSize: 14,
    fontWeight: '600'
  },
  actionsSection: {
    backgroundColor: '#121522',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#22273e',
    gap: 12,
    marginTop: 8
  },
  helpText: {
    color: '#8b92af',
    fontSize: 13,
    lineHeight: 18
  },
  buttonStack: {
    gap: 10,
    marginTop: 4
  },
  actionBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnGet: {
    backgroundColor: '#1e284a'
  },
  btnPost: {
    backgroundColor: '#cf236e'
  },
  btnPut: {
    backgroundColor: '#7b2cbf'
  },
  btnPatch: {
    backgroundColor: '#e85d04'
  },
  btnDelete: {
    backgroundColor: '#b01035'
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5
  },
  consoleSection: {
    backgroundColor: '#07090f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1d2238',
    overflow: 'hidden',
    marginTop: 8
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f121e',
    borderBottomWidth: 1,
    borderBottomColor: '#1d2238'
  },
  consoleTitle: {
    color: '#828ba8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1
  },
  busyIndicator: {
    color: '#ffaa00',
    fontSize: 12,
    fontWeight: '600'
  },
  consoleBody: {
    padding: 16,
    minHeight: 120
  },
  consoleText: {
    color: '#49f2b8',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19
  }
});
