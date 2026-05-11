import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type DrawCodeStatus = 'generated' | 'used' | 'canceled';

type DrawCodeRecord = {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  code: string;
  createdAt: string;
  status: DrawCodeStatus;
};

const statusLabels: Record<DrawCodeStatus, string> = {
  generated: 'Gerado',
  used: 'Utilizado',
  canceled: 'Cancelado',
};

type StatusBadgeStyle = {
  backgroundColor: string;
  borderColor: string;
};

const statusStyles: Record<DrawCodeStatus, StatusBadgeStyle> = {
  generated: {
    backgroundColor: '#E8F7F0',
    borderColor: '#B8E4D0',
  },
  used: {
    backgroundColor: '#EEF4FF',
    borderColor: '#C7D7FE',
  },
  canceled: {
    backgroundColor: '#FEF3F2',
    borderColor: '#FECDCA',
  },
};

const statusTextColors: Record<DrawCodeStatus, string> = {
  generated: '#087443',
  used: '#3538CD',
  canceled: '#B42318',
};

const mockRecords: DrawCodeRecord[] = [
  {
    id: 'mock-001',
    name: 'Maria Eduarda Alves',
    cpf: '123.456.789-09',
    phone: '(85) 98888-1200',
    code: '482917306',
    createdAt: '2026-05-11T09:18:00.000-03:00',
    status: 'generated',
  },
  {
    id: 'mock-002',
    name: 'Joao Pedro Lima',
    cpf: '987.654.321-00',
    phone: '(85) 97777-4501',
    code: '730195824',
    createdAt: '2026-05-11T10:42:00.000-03:00',
    status: 'used',
  },
  {
    id: 'mock-003',
    name: 'Ana Clara Martins',
    cpf: '456.789.123-22',
    phone: '(85) 96666-7812',
    code: '195608473',
    createdAt: '2026-05-10T16:07:00.000-03:00',
    status: 'generated',
  },
  {
    id: 'mock-004',
    name: 'Carlos Henrique Rocha',
    cpf: '321.654.987-11',
    phone: '(85) 95555-9012',
    code: '604318729',
    createdAt: '2026-05-10T14:33:00.000-03:00',
    status: 'canceled',
  },
];

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponivel';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function buildSearchText(record: DrawCodeRecord) {
  return `${record.name} ${record.cpf} ${record.phone} ${record.code}`.toLowerCase();
}

export default function AdminScreen() {
  const [records, setRecords] = useState<DrawCodeRecord[]>(mockRecords);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DrawCodeStatus | 'all'>('all');

  const filteredRecords = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return records.filter((record) => {
      const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
      const matchesQuery = !normalizedQuery || buildSearchText(record).includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [query, records, selectedStatus]);

  const metrics = useMemo(
    () => ({
      total: records.length,
      generated: records.filter((record) => record.status === 'generated').length,
      used: records.filter((record) => record.status === 'used').length,
      canceled: records.filter((record) => record.status === 'canceled').length,
    }),
    [records],
  );

  const handleCreateDemoRecord = () => {
    const index = records.length + 1;
    const createdAt = new Date().toISOString();
    const code = String((604318729 + index * 13791) % 1_000_000_000).padStart(9, '0');

    setRecords((currentRecords) => [
      {
        id: `mock-${Date.now()}`,
        name: `Cliente Demonstracao ${index}`,
        cpf: '111.222.333-44',
        phone: '(85) 99999-0000',
        code,
        createdAt,
        status: 'generated',
      },
      ...currentRecords,
    ]);
  };

  const handleStatusChange = (id: string, status: DrawCodeStatus) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) => (record.id === id ? { ...record, status } : record)),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.backgroundLayer}>
          <View style={[styles.blurCircle, styles.blurCirclePrimary]} />
          <View style={[styles.blurCircle, styles.blurCircleSecondary]} />
          <View style={[styles.blurCircle, styles.blurCircleAccent]} />
        </View>

        <View style={styles.shell}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Painel administrativo</Text>
              <Text style={styles.title}>Codigos de sorteio</Text>
              <Text style={styles.subtitle}>
                Consulta local dos codigos gerados com dados do cliente, horario e status.
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Link href="/" asChild>
                <Pressable style={styles.backButton}>
                  <Text style={styles.backButtonText}>Cadastro</Text>
                </Pressable>
              </Link>

              <Pressable
                accessibilityRole="button"
                onPress={handleCreateDemoRecord}
                style={({ pressed }) => [styles.createButton, pressed && styles.buttonPressed]}>
                <Text style={styles.createButtonText}>Novo demo</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard label="Total" value={metrics.total} tone="dark" />
            <MetricCard label="Gerados" value={metrics.generated} tone="green" />
            <MetricCard label="Utilizados" value={metrics.used} tone="blue" />
            <MetricCard label="Cancelados" value={metrics.canceled} tone="red" />
          </View>

          <View style={styles.toolbar}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Buscar por nome, CPF, telefone ou codigo"
              placeholderTextColor="#D4DCEA"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />

            <ScrollView
              horizontal
              contentContainerStyle={styles.filterList}
              showsHorizontalScrollIndicator={false}>
              {(['all', 'generated', 'used', 'canceled'] as const).map((status) => (
                <Pressable
                  accessibilityRole="button"
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  style={[
                    styles.filterButton,
                    selectedStatus === status && styles.filterButtonActive,
                  ]}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedStatus === status && styles.filterButtonTextActive,
                    ]}>
                    {status === 'all' ? 'Todos' : statusLabels[status]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Registros</Text>
            <Text style={styles.listCount}>{filteredRecords.length} encontrados</Text>
          </View>

          <View style={styles.recordsList}>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <DrawCodeCard
                  key={record.id}
                  record={record}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Nenhum codigo encontrado</Text>
                <Text style={styles.emptyText}>
                  Ajuste a busca ou selecione outro status para visualizar os registros.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'dark' | 'green' | 'blue' | 'red';
}) {
  return (
    <View style={[styles.metricCard, styles[`metricCard_${tone}`]]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function DrawCodeCard({
  record,
  onStatusChange,
}: {
  record: DrawCodeRecord;
  onStatusChange: (id: string, status: DrawCodeStatus) => void;
}) {
  const nextStatus: DrawCodeStatus = record.status === 'generated' ? 'used' : 'generated';

  return (
    <View style={styles.recordCard}>
      <View style={styles.recordTopLine}>
        <View style={styles.customerBlock}>
          <Text style={styles.customerName}>{record.name}</Text>
          <Text style={styles.createdAt}>{formatDateTime(record.createdAt)}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusStyles[record.status].backgroundColor,
              borderColor: statusStyles[record.status].borderColor,
            },
          ]}>
          <Text style={[styles.statusText, { color: statusTextColors[record.status] }]}>
            {statusLabels[record.status]}
          </Text>
        </View>
      </View>

      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>Codigo</Text>
        <Text selectable style={styles.codeValue}>
          {record.code}
        </Text>
      </View>

      <View style={styles.detailsGrid}>
        <DetailItem label="CPF" value={record.cpf} />
        <DetailItem label="Telefone" value={record.phone} />
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onStatusChange(record.id, nextStatus)}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
          <Text style={styles.secondaryButtonText}>
            Marcar como {statusLabels[nextStatus].toLowerCase()}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => onStatusChange(record.id, 'canceled')}
          style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}>
          <Text style={styles.dangerButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071426',
  },
  container: {
    width: '100%',
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#071426',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blurCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.72,
  },
  blurCirclePrimary: {
    width: 280,
    height: 280,
    top: -80,
    left: -90,
    backgroundColor: '#00A6A6',
  },
  blurCircleSecondary: {
    width: 340,
    height: 340,
    right: -130,
    top: 130,
    backgroundColor: '#3454D1',
  },
  blurCircleAccent: {
    width: 230,
    height: 230,
    bottom: -70,
    left: 70,
    backgroundColor: '#F6B73C',
  },
  shell: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 22,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.13)',
    ...Platform.select({
      web: {
        boxShadow: '0 28px 80px rgba(7, 20, 45, 0.28)',
        backdropFilter: 'blur(18px)',
      },
      default: {
        shadowColor: '#07142D',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.22,
        shadowRadius: 28,
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerCopy: {
    flex: 1,
    minWidth: 260,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
  },
  eyebrow: {
    color: '#8EE8DE',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    maxWidth: 560,
    marginTop: 6,
    color: '#D4DCEA',
    fontSize: 15,
    lineHeight: 22,
  },
  backButton: {
    minHeight: 44,
    minWidth: 104,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  backButtonText: {
    color: '#EAF2FF',
    fontSize: 14,
    fontWeight: '900',
  },
  createButton: {
    minHeight: 44,
    minWidth: 116,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: '#00A6A6',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    minWidth: 138,
    flexGrow: 1,
    borderRadius: 8,
    padding: 16,
  },
  metricCard_dark: {
    backgroundColor: '#101828',
  },
  metricCard_green: {
    backgroundColor: '#087443',
  },
  metricCard_blue: {
    backgroundColor: '#3538CD',
  },
  metricCard_red: {
    backgroundColor: '#B42318',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  metricLabel: {
    marginTop: 4,
    color: '#F2F4F7',
    fontSize: 13,
    fontWeight: '700',
  },
  toolbar: {
    gap: 12,
    borderWidth: 1,
    borderColor: '#D9E1EC',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 18px rgba(11, 31, 58, 0.06)',
      },
      default: {
        shadowColor: '#0B1F3A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 2,
      },
    }),
  },
  searchInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CAD5E2',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FAFBFC',
    color: '#101828',
    fontSize: 15,
  },
  filterList: {
    gap: 8,
  },
  filterButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  filterButtonActive: {
    borderColor: '#0B6B72',
    backgroundColor: '#E6F4F1',
  },
  filterButtonText: {
    color: '#344054',
    fontSize: 13,
    fontWeight: '800',
  },
  filterButtonTextActive: {
    color: '#0B6B72',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  listTitle: {
    color: '#101828',
    fontSize: 20,
    fontWeight: '900',
  },
  listCount: {
    color: '#667085',
    fontSize: 13,
    fontWeight: '700',
  },
  recordsList: {
    gap: 12,
  },
  recordCard: {
    gap: 14,
    borderWidth: 1,
    borderColor: '#D9E1EC',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  recordTopLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  customerBlock: {
    flex: 1,
    gap: 4,
  },
  customerName: {
    color: '#101828',
    fontSize: 17,
    fontWeight: '900',
  },
  createdAt: {
    color: '#667085',
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  codeBox: {
    borderWidth: 1,
    borderColor: '#E1D6BE',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FFF9EA',
  },
  codeLabel: {
    color: '#7A5B12',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  codeValue: {
    marginTop: 2,
    color: '#101828',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    minWidth: 180,
    flex: 1,
    gap: 4,
    borderWidth: 1,
    borderColor: '#EAECF0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FCFCFD',
  },
  detailLabel: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#101828',
    fontSize: 15,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  secondaryButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#0B6B72',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  dangerButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECDCA',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FEF3F2',
  },
  dangerButtonText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '900',
  },
  buttonPressed: {
    opacity: 0.86,
  },
  emptyState: {
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#D9E1EC',
    borderRadius: 8,
    padding: 22,
    backgroundColor: '#FFFFFF',
  },
  emptyTitle: {
    color: '#101828',
    fontSize: 17,
    fontWeight: '900',
  },
  emptyText: {
    maxWidth: 360,
    color: '#667085',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
