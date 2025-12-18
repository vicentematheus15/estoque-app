import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ProdutosScreen() {
    const { user, signOut } = useContext(AuthContext);
    const navigation = useNavigation();
    
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log('Produtos:', produtos);

  async function carregarProdutos() {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
        console.log('ERRO AO CARREGAR PRODUTOS');
        console.log('message:', error.message);
        console.log('response:', error.response);
        console.log('request:', error.request);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Carrega ao entrar na tela
  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔹 Recarrega sempre que voltar para a tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarProdutos);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>

        {user.nivel_acesso === 'admin' && (
          <Button
            title="Novo Produto"
            onPress={() => navigation.navigate('ProdutoCadastro')}
          />
        )}

        <Button title="Sair" onPress={signOut} />
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={produtos || []}
        keyExtractor={(item) => String(item.id_produto)}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum produto cadastrado</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome_produto}</Text>
            <Text>Categoria: {item.categoria}</Text>
            <Text>Preço: R$ {item.preco}</Text>

            <Button
              title="Ver Detalhes"
              onPress={() =>
                navigation.navigate('ProdutoDetalhe', { produto: item })
              }
            />

            {/* Ações exclusivas do admin */}
            {user.nivel_acesso === 'admin' && (
              <View style={styles.adminActions}>
                <Button title="Editar" onPress={() => {}} />
                <Button title="Desativar" onPress={() => {}} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  center: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  }
});