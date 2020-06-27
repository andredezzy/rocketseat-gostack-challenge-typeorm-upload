import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    if (!isUuid(id)) {
      throw new AppError('ID should be a UUID.');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const deleteResult = await transactionsRepository.delete(id);

    if (!deleteResult.affected) {
      throw new AppError('No transaction found with this ID.', 404);
    }
  }
}

export default DeleteTransactionService;
