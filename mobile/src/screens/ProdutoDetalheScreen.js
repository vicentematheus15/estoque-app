import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet
} from 'react-native';

import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ProdutoDetalheScreen({ route }) {
  const { produto } = route.params;
  const { user } = useContext(AuthContext);

  const [estoque, setEstoque] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);

  async function carregarEstoque() {
    const response = await api.get(`/estoque/${produto.id_produto}`);
    setEstoque(response.data);
  }

  async function carregarHistorico() {
    const response = await api.get(
      `/movimentacoes/${estoque.id_produto_estoque}`
    );
    setMovimentacoes(response.data);
  }

  async function registrarSaida() {
    try {
      await api.post('/movimentacoes/saida', {
        id_produto_estoque: estoque.id_produto_estoque,
        quantidade: 1,
        descricao: 'Saída via app',
        id_usuario: user.id_usuario
      });

      Alert.alert('Sucesso', 'Saída registrada');
      carregarEstoque();
      carregarHistorico();
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro na saída'
      );
    }
  }

  async function registrarEntrada() {
    try {
      await api.post('/movimentacoes/entrada', {
        id_produto_estoque: estoque.id_produto_estoque,
        quantidade: 1,
        descricao: 'Entrada via app',
        id_usuario: user.id_usuario
      });

      Alert.alert('Sucesso', 'Entrada registrada');
      carregarEstoque();
      carregarHistorico();
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro na entrada'
      );
    }
  }

  useEffect(() => {
    carregarEstoque();
  }, []);

  useEffect(() => {
    if (estoque) carregarHistorico();
  }, [estoque]);

  if (!estoque) {
    return <Text>Carregando estoque...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{produto.nome_produto}</Text>

      <Text>Quantidade atual: {estoque.qtd_atual}</Text>

      <View style={styles.buttons}>
        <Button title="Registrar Saída" onPress={registrarSaida} />

        {user.nivel_acesso === 'admin' && (
          <Button title="Registrar Entrada" onPress={registrarEntrada} />
        )}
      </View>

      <Text style={styles.subTitle}>Histórico</Text>

      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => String(item.id_movimentacao)}
        renderItem={({ item }) => (
          <Text>
            {item.tipo_movimentacao} | {item.quantidade} | {item.data_movimentacao}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subTitle: { marginTop: 20, fontWeight: 'bold' },
  buttons: { marginVertical: 10 }
});
