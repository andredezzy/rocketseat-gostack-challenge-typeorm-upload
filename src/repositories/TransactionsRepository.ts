import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const sum = (accumulator: number, transaction: Transaction): number =>
      accumulator + transaction.value;

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(sum, 0);
    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(sum, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
