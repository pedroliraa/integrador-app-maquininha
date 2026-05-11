import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type CustomerForm = {
  name: string;
  cpf: string;
  phone: string;
};

type GeneratedReceipt = CustomerForm & {
  code: string;
  createdAt: string;
};

const initialForm: CustomerForm = {
  name: '',
  cpf: '',
  phone: '',
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function generateNineDigitCode() {
  return Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
}

function formatReceiptDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function Home() {
  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [receipt, setReceipt] = useState<GeneratedReceipt | null>(null);

  const nameIsValid = form.name.trim().length >= 3;
  const cpfIsValid = onlyDigits(form.cpf).length === 11;
  const phoneIsValid = [10, 11].includes(onlyDigits(form.phone).length);
  const canGenerate = nameIsValid && cpfIsValid && phoneIsValid;

  const updateField = (field: keyof CustomerForm, value: string) => {
    const formatters = {
      name: (text: string) => text,
      cpf: formatCpf,
      phone: formatPhone,
    };

    setForm((current) => ({
      ...current,
      [field]: formatters[field](value),
    }));

    if (receipt) {
      setReceipt(null);
    }
  };

  const handleGenerateCode = () => {
    if (!canGenerate) {
      Alert.alert(
        'Dados incompletos',
        'Informe nome, CPF com 11 digitos e telefone com DDD para gerar o codigo de sorteio.',
      );
      return;
    }

    setReceipt({
      name: form.name.trim().replace(/\s+/g, ' '),
      cpf: form.cpf,
      phone: form.phone,
      code: generateNineDigitCode(),
      createdAt: new Date().toISOString(),
    });
  };

  const handlePrint = () => {
    Alert.alert('Impressao', 'A impressao sera integrada posteriormente.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardArea}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.backgroundLayer}>
            <View style={[styles.glow, styles.glowPrimary]} />
            <View style={[styles.glow, styles.glowSecondary]} />
            <View style={[styles.glow, styles.glowWarm]} />
          </View>

          <View style={styles.page}>
            <View style={styles.topBar}>
              <View style={styles.brand}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandMarkText}>CV</Text>
                </View>
                <View style={styles.brandTextGroup}>
                  <Text style={styles.brandName}>CredVisa Sorteio</Text>
                  <Text style={styles.brandSubtitle}>Emissao de codigo para sorteio</Text>
                </View>
              </View>

              <Link href="/admin" asChild>
                <Pressable style={styles.adminButton}>
                  <Text style={styles.adminButtonText}>Admin</Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.heroCard}>
              <Text style={styles.kicker}>Atendimento presencial</Text>
              <Text style={styles.title}>Cadastro do participante</Text>
              <Text style={styles.subtitle}>
                Preencha os dados do cliente para gerar um comprovante com codigo de 9 numeros.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Dados do cliente</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholder="Ex.: Maria Silva"
                  placeholderTextColor="#8EA0B8"
                  style={styles.input}
                  value={form.name}
                  onChangeText={(value) => updateField('name', value)}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={14}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#8EA0B8"
                  style={styles.input}
                  value={form.cpf}
                  onChangeText={(value) => updateField('cpf', value)}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  keyboardType="phone-pad"
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#8EA0B8"
                  style={styles.input}
                  value={form.phone}
                  onChangeText={(value) => updateField('phone', value)}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={!canGenerate}
                onPress={handleGenerateCode}
                style={({ pressed }) => [
                  styles.primaryButton,
                  !canGenerate && styles.primaryButtonDisabled,
                  pressed && canGenerate && styles.pressed,
                ]}>
                <Text style={styles.primaryButtonText}>Gerar codigo de sorteio</Text>
              </Pressable>
            </View>

            <View style={styles.receiptCard}>
              <View style={styles.receiptHeader}>
                <View>
                  <Text style={styles.receiptEyebrow}>Comprovante</Text>
                  <Text style={styles.receiptTitle}>Codigo do sorteio</Text>
                </View>
                <Text style={styles.receiptStatus}>{receipt ? 'Gerado' : 'Pendente'}</Text>
              </View>

              <View style={styles.codeBox}>
                <Text selectable={!!receipt} style={[styles.code, !receipt && styles.codeEmpty]}>
                  {receipt?.code ?? '000000000'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.receiptDetails}>
                <ReceiptRow label="Cliente" value={receipt?.name ?? '-'} />
                <ReceiptRow label="CPF" value={receipt?.cpf ?? '-'} />
                <ReceiptRow label="Telefone" value={receipt?.phone ?? '-'} />
                <ReceiptRow
                  label="Gerado em"
                  value={receipt ? formatReceiptDate(receipt.createdAt) : '-'}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={!receipt}
                onPress={handlePrint}
                style={({ pressed }) => [
                  styles.printButton,
                  !receipt && styles.printButtonDisabled,
                  pressed && receipt && styles.pressed,
                ]}>
                <Text style={styles.printButtonText}>Imprimir comprovante</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={styles.receiptValue}>{value}</Text>
    </View>
  );
}

const glassShadow = Platform.select({
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
});

const cardShadow = Platform.select({
  web: {
    boxShadow: '0 14px 34px rgba(7, 20, 45, 0.16)',
  },
  default: {
    shadowColor: '#07142D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071426',
  },
  keyboardArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#071426',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.72,
  },
  glowPrimary: {
    width: 260,
    height: 260,
    top: -70,
    left: -80,
    backgroundColor: '#00A6A6',
  },
  glowSecondary: {
    width: 310,
    height: 310,
    right: -120,
    top: 170,
    backgroundColor: '#3454D1',
  },
  glowWarm: {
    width: 220,
    height: 220,
    bottom: -70,
    left: 50,
    backgroundColor: '#F6B73C',
  },
  page: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.13)',
    ...glassShadow,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  brandMark: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 14,
    backgroundColor: 'rgba(7,20,38,0.78)',
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  brandTextGroup: {
    flex: 1,
    minWidth: 0,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  brandSubtitle: {
    color: '#C9D6E8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
  },
  adminButton: {
    minHeight: 38,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  adminButtonText: {
    color: '#EAF2FF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  heroCard: {
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  kicker: {
    color: '#8EE8DE',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#D4DCEA',
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    gap: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.34)',
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    ...cardShadow,
  },
  sectionTitle: {
    color: '#101828',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    color: '#243247',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  input: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: 'rgba(52, 64, 84, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.78)',
    color: '#101828',
    fontSize: 16,
  },
  primaryButton: {
    width: '100%',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 2,
    backgroundColor: '#00A6A6',
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(104, 119, 141, 0.56)',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  receiptCard: {
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.42)',
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(255, 249, 234, 0.9)',
    ...cardShadow,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  receiptEyebrow: {
    color: '#806116',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  receiptTitle: {
    marginTop: 3,
    color: '#101828',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  receiptStatus: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(128, 97, 22, 0.2)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.58)',
    color: '#806116',
    fontSize: 12,
    fontWeight: '900',
  },
  codeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 82,
    borderWidth: 1,
    borderColor: 'rgba(128, 97, 22, 0.18)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  code: {
    color: '#071426',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  codeEmpty: {
    color: 'rgba(7, 20, 38, 0.22)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 97, 22, 0.18)',
  },
  receiptDetails: {
    gap: 9,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  receiptLabel: {
    flexShrink: 0,
    color: '#806116',
    fontSize: 13,
    fontWeight: '900',
  },
  receiptValue: {
    flex: 1,
    color: '#1D2939',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  printButton: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#071426',
  },
  printButtonDisabled: {
    backgroundColor: 'rgba(7, 20, 38, 0.38)',
  },
  printButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});
