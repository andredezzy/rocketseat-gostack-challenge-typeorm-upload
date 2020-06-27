import path from 'path';

import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import loadCSV from '../utils/loadCSV';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  importFilename: string;
}

class ImportTransactionsService {
  async execute({ importFilename }: Request): Promise<Transaction[]> {
    const importFilePath = path.join(uploadConfig.directory, importFilename);

    const lines = await loadCSV(importFilePath);

    const transactions: Transaction[] = [];

    const createTransaction = new CreateTransactionService();

    for (const line of lines) {
      const title = line[0];
      const type = line[1];
      const value = line[2];
      const category = line[3];

      if (type !== 'income' && type !== 'outcome') {
        throw new AppError(
          "Some line in CSV has an invalid type, it should be 'income' or 'outcome'",
        );
      }

      const transaction = await createTransaction.execute({
        title,
        type: type as 'income' | 'outcome',
        value: Number(value),
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
