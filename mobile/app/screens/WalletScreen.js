import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import walletService from '../services/walletService';
import authService from '../services/authService';
import { formatDistanceToNow } from 'date-fns';

const WalletScreen = ({ navigation }) => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const walletData = await walletService.getWallet(user.id);
      setWallet(walletData);

      const txnData = await walletService.getTransactionHistory(user.id);
      setTransactions(txnData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const handleAddMoney = () => {
    navigation.navigate('AddFunds');
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View>
        <Text style={styles.txnDescription}>{item.description}</Text>
        <Text style={styles.txnDate}>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </Text>
      </View>
      <Text
        style={[
          styles.txnAmount,
          item.transactionType === 'credit' ? styles.credit : styles.debit,
        ]}
      >
        {item.transactionType === 'credit' ? '+' : '-'}₦{item.amount}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {wallet && (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balance}>₦{wallet.balance.toFixed(2)}</Text>
          <Text style={styles.balanceSubtitle}>
            Total Spent: ₦{wallet.totalSpent.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddMoney}>
            <Text style={styles.addButtonText}>+ Add Funds</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: '#1a73e8',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#e8f0fe',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  balanceSubtitle: {
    fontSize: 12,
    color: '#e8f0fe',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#1a73e8',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txnDescription: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  txnDate: {
    fontSize: 12,
    color: '#999',
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  credit: {
    color: '#34a853',
  },
  debit: {
    color: '#ea4335',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
    fontSize: 14,
  },
});

export default WalletScreen;
